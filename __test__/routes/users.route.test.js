const app = require("../../src/app");
const request = require("supertest");
const { users } = require("../../data/mockUsers");

describe("GET /users", () => {
  it("should return all users in the database", async () => {
    const response = await request(app).get("/users");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(users);
    expect(response.body.length).toBe(2);
    expect(response.headers["content-type"]).toMatch(/json/);
  });
});
