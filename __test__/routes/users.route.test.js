const { MongoClient } = require("mongodb");
const request = require("supertest");
const app = require("../../src/app");
const mongoose = require("mongoose");
const { users } = require("../../data/mockUsers");

describe("User", () => {
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

  const insertUserDataIntoTestDB = async () => {
    const collection = db.collection("users");
    await collection.insertMany(users);
  };

  beforeEach(async () => {
    await db.dropDatabase();
    await insertUserDataIntoTestDB();
  });

  const route = (params = "") => {
    return `/users/${params}`;
  };

  describe("login route", () => {
    it("POST should be able to login a user if correct email and password is given", async () => {
      const response = await request(app)
        .post(route("login"))
        .set("Content-Type", "application/json")
        .send({ email: "bob@gmail.com", password: "123" });
      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Bob");
      expect(response.body.books[0].title).toBe("Brave New World");
      expect(response.body.books[1].title).toBe("Fahrenheit 451");
    });
  });
});
