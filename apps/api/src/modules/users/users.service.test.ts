import { prisma } from "../../config/prisma";
import { HttpError } from "../../middlewares/errorHandler";
import { updateUserRole } from "./users.service";

jest.mock("../../config/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
  },
}));

jest.mock("../../utils/mailer", () => ({
  sendPasswordResetNotification: jest.fn(),
}));

const mockedPrisma = prisma as unknown as {
  user: { findUnique: jest.Mock; update: jest.Mock; count: jest.Mock };
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("updateUserRole", () => {
  it("throws when the user does not exist", async () => {
    mockedPrisma.user.findUnique.mockResolvedValue(null);

    await expect(updateUserRole(1, "ADMIN")).rejects.toThrow(HttpError);
  });

  it("blocks demoting the last SUPER_ADMIN", async () => {
    mockedPrisma.user.findUnique.mockResolvedValue({ id: 1, role: "SUPER_ADMIN" });
    mockedPrisma.user.count.mockResolvedValue(0);

    await expect(updateUserRole(1, "ADMIN")).rejects.toThrow("Cannot remove the last super admin");
    expect(mockedPrisma.user.update).not.toHaveBeenCalled();
  });

  it("allows demoting a SUPER_ADMIN when another one exists", async () => {
    mockedPrisma.user.findUnique.mockResolvedValue({ id: 1, role: "SUPER_ADMIN" });
    mockedPrisma.user.count.mockResolvedValue(1);
    mockedPrisma.user.update.mockResolvedValue({ id: 1, role: "ADMIN" });

    const result = await updateUserRole(1, "ADMIN");

    expect(result).toEqual({ id: 1, role: "ADMIN" });
    expect(mockedPrisma.user.count).toHaveBeenCalledWith({
      where: { role: "SUPER_ADMIN", id: { not: 1 } },
    });
  });

  it("allows changing role for a non-SUPER_ADMIN user without checking counts", async () => {
    mockedPrisma.user.findUnique.mockResolvedValue({ id: 2, role: "HR" });
    mockedPrisma.user.update.mockResolvedValue({ id: 2, role: "ADMIN" });

    await updateUserRole(2, "ADMIN");

    expect(mockedPrisma.user.count).not.toHaveBeenCalled();
    expect(mockedPrisma.user.update).toHaveBeenCalled();
  });
});
