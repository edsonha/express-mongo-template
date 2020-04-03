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

    it("POST should not be able to login if wrong email is given", async () => {
      const response = await request(app)
        .post(route("login"))
        .set("Content-Type", "application/json")
        .send({ email: "random@gmail.com", password: "123" });
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Wrong credentials");
    });

    it("POST should not be able to login if wrong password is given", async () => {
      const response = await request(app)
        .post(route("login"))
        .set("Content-Type", "application/json")
        .send({ email: "bob@gmail.com", password: "random" });
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Wrong password");
    });
  });

  describe("register route", () => {
    it("POST should be able to register a new user", async () => {
      const newUser = {
        name: "Tom",
        email: "tom@gmail.com",
        password: "qwe",
        passwordConfirmation: "qwe"
      };

      const response = await request(app)
        .post(route("register"))
        .set("Content-Type", "application/json")
        .send(newUser);
      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Account created");
      expect(response.body.name).toBe("Tom");
      expect(response.body.books).toEqual([]);
    });

    it("POST should deny registration if the same email is already registered", async () => {
      const sameEmailUser = {
        name: "Johny",
        email: "john@gmail.com",
        password: "123",
        passwordConfirmation: "123"
      };
      const response = await request(app)
        .post(route("register"))
        .set("Content-Type", "application/json")
        .send(sameEmailUser);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("User already exists");
    });

    it("POST should deny registration if password and confirm password don't match", async () => {
      const newUser = {
        name: "Tom",
        email: "tom@gmail.com",
        password: "abc",
        passwordConfirmation: "123"
      };

      const response = await request(app)
        .post(route("register"))
        .set("Content-Type", "application/json")
        .send(newUser);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Password does not match");
    });
  });
});
