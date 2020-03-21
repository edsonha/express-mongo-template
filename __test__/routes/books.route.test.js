const app = require("../../src/app");
const request = require("supertest");
const { books } = require("../../data/mockBooks.json");

describe("GET /books", () => {
  it("should return all books in the database", async () => {
    const response = await request(app).get("/books");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(books);
    expect(response.body.length).toBe(3);
    expect(response.headers["content-type"]).toMatch(/json/);
  });
});
