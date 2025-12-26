import request from "supertest";
import app from "../src/app.js";
import { prisma } from "../prisma/client.js";

const email = `tasks_${Date.now()}@test.com`;
const password = "123456";

let token;

beforeAll(async () => {
  await request(app)
    .post("/auth/register")
    .send({ email, password });

  const login = await request(app)
    .post("/auth/login")
    .send({ email, password });

  token = login.body.token;
});

describe("Tasks", () => {
  test("POST /tasks -> crea tarea (JWT)", async () => {
    const res = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Tarea test" });

    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("task");
    expect(res.body.task).toHaveProperty("id");
    expect(res.body.task).toHaveProperty("title", "Tarea test");
    expect(res.body.task).toHaveProperty("completed", false);
  });

  test("GET /tasks -> lista tareas (JWT)", async () => {
    await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Otra tarea" });

    const res = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("tasks");
    expect(Array.isArray(res.body.tasks)).toBe(true);
    expect(res.body.tasks.length).toBeGreaterThan(0);
  });

  test("PATCH /tasks/:id -> actualiza completed (JWT)", async () => {
    const created = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Completarme" });

    const id = created.body.task.id;

    const res = await request(app)
      .patch(`/tasks/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ completed: true });

    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("task");
    expect(res.body.task).toHaveProperty("completed", true);
  });

  test("DELETE /tasks/:id -> elimina tarea (JWT)", async () => {
    const created = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Borrame" });

    const id = created.body.task.id;

    const res = await request(app)
      .delete(`/tasks/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect([200, 204]).toContain(res.statusCode);
  });

  test("GET /tasks sin token -> 401/403", async () => {
    const res = await request(app).get("/tasks");
    expect([401, 403]).toContain(res.statusCode);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

