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

  describe("GET", () => {
    it("/books should return all books in the database", async () => {
      const response = await request(app).get("/books");
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
      const response = await request(app).get(`/books/${validId}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        _id: "5e784e071292de616c5bc987",
        title: "Fahrenheit 451",
        author: "Ray Bradbury"
      });
    });

    it("/books/:id should return 404 error if invalid id is given", async () => {
      const invalidId = "5d2e7e1aec0f970d68a71465";
      const response = await request(app).get(`/books/${invalidId}`);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: `Unable to find book with id: ${invalidId}`
      });
    });
  });

  describe("DELETE", () => {
    it("/books/:id should delete one book based on id given ", async () => {
      const validId = "7d2e85951b62fc093cc3319b";
      const response = await request(app).delete(`/books/${validId}`);
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
      const response = await request(app).delete(`/books/${invalidId}`);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: `Unable to delete book with id: ${invalidId}`
      });
    });
  });
});
