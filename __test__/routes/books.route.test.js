const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const app = require("../../src/app");
const request = require("supertest");
const { books } = require("../../data/mockBooks");

describe("Book", () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    db = await connection.db();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await connection.close();
    await db.close();
  });

  const insertBookDataIntoTestDB = async () => {
    const collection = db.collection("books");
    await collection.insertMany(books);
  };

  beforeEach(async () => {
    await db.dropDatabase();
    await insertBookDataIntoTestDB();
  });

  const route = (params = "") => {
    return `/books/${params}`;
  };

  describe("GET", () => {
    it("/books should return all books in the database", async () => {
      const response = await request(app).get(route());
      expect(response.status).toBe(200);

      const mockBooksWithStringID = [];
      for (let book of books) {
        mockBooksWithStringID.push(JSON.parse(JSON.stringify(book)));
      }

      expect(response.body).toEqual(mockBooksWithStringID);
      expect(response.body.length).toBe(3);
      expect(response.headers["content-type"]).toMatch(/json/);
    });

    it("/books/:id should return one book based on id given", async () => {
      const validId = "5e784e071292de616c5bc987";
      const response = await request(app).get(route(validId));
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        _id: "5e784e071292de616c5bc987",
        title: "Fahrenheit 451",
        author: "Ray Bradbury"
      });
    });

    it("/books/:id should return 404 error if invalid id is given", async () => {
      const invalidId = "5d2e7e1aec0f970d68a71465";
      const response = await request(app).get(route(invalidId));
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: `Unable to find book with id: ${invalidId}`
      });
    });
  });

  describe("DELETE", () => {
    it("/books/:id should delete one book based on id given ", async () => {
      const validId = "7d2e85951b62fc093cc3319b";
      const response = await request(app).delete(route(validId));
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        _id: "7d2e85951b62fc093cc3319b",
        title: "Brave New World",
        author: "Aldous Huxley"
      });

      const collection = db.collection("books");
      const deletedBook = await collection.findOne({
        _id: `${validId}`
      });
      expect(deletedBook).toBeNull();
    });

    it("/books/:id should return 404 error if invalid id is given ", async () => {
      const invalidId = "5d2e7e1aec0f970d68a71465";
      const response = await request(app).delete(route(invalidId));
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: `Unable to delete book with id: ${invalidId}`
      });
    });
  });

  describe("POST", () => {
    it("/books should create a new book in database", async () => {
      const newBook = { title: "test title", author: "test author" };
      const postResponse = await request(app)
        .post(route())
        .set("Content-Type", "application/json")
        .send(newBook);
      expect(postResponse.status).toBe(201);
      expect(postResponse.body).toEqual(newBook);

      const getResponse = await request(app).get(route());
      const responseLength = getResponse.body.length;
      expect(responseLength).toBe(4);

      const createdBook = {
        title: "test title",
        author: "test author"
      };
      expect(getResponse.body[responseLength - 1]).toMatchObject(createdBook);
    });

    it("/books should not create a new book in database if there is same title and same author", async () => {
      const duplicateBook = { title: "1984", author: "George Orwell" };
      const postResponse = await request(app)
        .post(route())
        .set("Content-Type", "application/json")
        .send(duplicateBook);
      expect(postResponse.status).toBe(422);
      expect(postResponse.body).toEqual({
        message: `Unable to create. Matching title and author detected`
      });

      const getResponse = await request(app).get(route());
      expect(getResponse.body).toHaveLength(3);
    });
  });
});
