import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { authenticateToken, authorizeRole, AuthUser } from "./auth";
import { env } from "../config/env";

function mockRes() {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res as Response;
}

describe("authenticateToken", () => {
  it("rejects requests without an Authorization header", () => {
    const req = { headers: {} } as Request;
    const res = mockRes();
    const next = jest.fn();

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Missing access token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects an invalid token", () => {
    const req = { headers: { authorization: "Bearer not-a-real-token" } } as Request;
    const res = mockRes();
    const next = jest.fn();

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid or expired token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("attaches the decoded user and calls next for a valid token", () => {
    const payload: AuthUser = { id: 1, email: "user@example.com", role: "ADMIN" };
    const token = jwt.sign(payload, env.jwtSecret, { expiresIn: "1h" });
    const req = { headers: { authorization: `Bearer ${token}` } } as Request;
    const res = mockRes();
    const next = jest.fn();

    authenticateToken(req, res, next);

    expect(req.user).toEqual(payload);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});

describe("authorizeRole", () => {
  it("returns 403 when the user role is not allowed", () => {
    const req = { user: { id: 1, email: "user@example.com", role: "APPLICANT" } } as Request;
    const res = mockRes();
    const next = jest.fn();

    authorizeRole("SUPER_ADMIN", "ADMIN")(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Forbidden" });
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next when the user role is allowed", () => {
    const req = { user: { id: 1, email: "user@example.com", role: "ADMIN" } } as Request;
    const res = mockRes();
    const next = jest.fn();

    authorizeRole("SUPER_ADMIN", "ADMIN")(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});
