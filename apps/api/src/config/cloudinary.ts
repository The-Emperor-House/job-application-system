import { randomUUID } from "crypto";
import { v2 as cloudinary, UploadApiOptions } from "cloudinary";
import { env } from "./env";

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

export { cloudinary };

export function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: string,
  resourceType: "image" | "raw" | "auto" = "auto",
  originalFilename?: string
): Promise<{ url: string; format?: string }> {
  return new Promise((resolve, reject) => {
    const options: UploadApiOptions = { folder, resource_type: resourceType };

    // Raw uploads don't get a file extension in their delivery URL unless the
    // public_id itself includes one, which breaks "open/download as PDF" etc.
    if (resourceType === "raw" && originalFilename) {
      const ext = originalFilename.split(".").pop();
      if (ext && ext !== originalFilename) {
        options.public_id = `${randomUUID()}.${ext}`;
      }
    }

    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error || !result) {
        return reject(error ?? new Error("Cloudinary upload failed"));
      }
      resolve({ url: result.secure_url, format: result.format });
    });
    stream.end(buffer);
  });
}
