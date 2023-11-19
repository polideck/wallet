import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
const baseURL = "http://localhost:5050";

// endpoint testing

describe("GET /", () => {
  it("should return 200", async () => {
    const response = await request(baseURL).get("/");
    expect(response.statusCode).toBe(200);
  });
  it("should return hi", async () => {
    const response = await request(baseURL).get("/");
    expect(response.text).toBe("hello");
  });
});

describe("GET /api/getNonce", () => {
  it("should return 200", async () => {
    const response = await request(baseURL).get(`/api/getNonce/${ethAddress}`);
    expect(response.statusCode).toBe(200);
  });
  it("should return hi", async () => {
    const response = await request(baseURL).get("/");
    expect(response.text).toBe("hello");
  });
});
