import request from "supertest";
import app from "../src/app.js";
import { prisma } from "../prisma/client.js"; // ✅ Import correcto arriba

const email = `test_${Date.now()}@test.com`;
const password = "123456";

describe("Auth", () => {
  test("POST /auth/register", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ email, password });

    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("email", email);
  });

  test("POST /auth/register duplicado -> 409", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ email, password });

    expect(res.statusCode).toBe(409);
  });

  test("POST /auth/login -> token", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email, password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("email", email);
  });
});

// ✅ Prisma se desconecta al final de todos los tests
afterAll(async () => {
  await prisma.$disconnect();
});

