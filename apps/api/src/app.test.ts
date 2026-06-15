import request from "supertest";
import { app } from "./app";
import { prisma } from "./config/prisma";

jest.mock("./config/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

const mockedPrisma = prisma as unknown as {
  user: { findUnique: jest.Mock };
};

beforeEach(() => {
  jest.clearAllMocks();
  mockedPrisma.user.findUnique.mockResolvedValue(null);
});

describe("POST /api/auth/login rate limiting", () => {
  it("returns 401 for invalid credentials, then 429 once the limit is exceeded", async () => {
    const credentials = { email: "user@example.com", password: "password123" };

    for (let i = 0; i < 10; i++) {
      const res = await request(app).post("/api/auth/login").send(credentials);
      expect(res.status).toBe(401);
    }

    const limited = await request(app).post("/api/auth/login").send(credentials);
    expect(limited.status).toBe(429);
  });
});
