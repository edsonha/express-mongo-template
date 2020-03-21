const app = require("../../src/app");
const request = require("supertest");
const { books } = require("../../data/mockBooks.json");

describe("GET", () => {
  it("/books should return all books in the database", async () => {
    const response = await request(app).get("/books");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(books);
    expect(response.body.length).toBe(3);
    expect(response.headers["content-type"]).toMatch(/json/);
  });

  it("/books/:id should return one book based on id given", async () => {
    const response = await request(app).get("/books/3");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: "3",
      title: "Fahrenheit 451",
      author: "Ray Bradbury"
    });
  });

  it("/books/:id should return 404 error if invalid id is given", async () => {
    const response = await request(app).get("/books/100");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Unable to find book with id: 100"
    });
  });
});

describe("DELETE", () => {
  it("/books/:id should delete one book based on id given ", async () => {
    const response = await request(app).delete("/books/2");
    expect(response.status).toBe(200);
    expect(books.length).toBe(2);
    expect(response.body).toEqual({
      id: "2",
      title: "Brave New World",
      author: "Aldous Huxley"
    });
  });

  it("/books/:id should return 404 error if invalid id is given ", async () => {
    const response = await request(app).delete("/books/100");
    expect(response.status).toBe(404);
    expect(books.length).toBe(2);
    expect(response.body).toEqual({
      message: "Unable to delete book with id: 100"
    });
  });
});
