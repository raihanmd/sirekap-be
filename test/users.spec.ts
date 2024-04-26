import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { TestService } from "./utils/test.service";
import { TestModule } from "./utils/test.module";
import { User } from "@prisma/client";

describe("UserController", () => {
  let app: INestApplication;
  let testService: TestService;
  let jwt: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    testService = app.get(TestService);
  });

  afterAll(async () => {
    await testService.deleteAll();
    await app.close();
  });

  describe("POST /v1/auth/register", () => {
    beforeEach(async () => {
      await testService.deleteAll();
    });

    it("should be rejected if request is invalid", async () => {
      const response = await request(app.getHttpServer())
        .post("/v1/auth/register")
        .send({
          username: "",
          password: "",
          full_name: "",
          province_id: 0,
          city_id: 0,
          date_of_birth: 0,
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it("should be able to register", async () => {
      const response = await request(app.getHttpServer())
        .post("/v1/auth/register")
        .send({
          username: "test",
          password: "testtest",
          full_name: "testtest",
          province_id: 32,
          city_id: 3207,
          date_of_birth: 0,
        });

      expect(response.status).toBe(201);
      expect(response.body.payload.token).toBeDefined();
    });

    it("should be rejected if username already exists", async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post("/v1/auth/register")
        .send({
          username: "test",
          password: "testtest",
          full_name: "testtest",
          province_id: 32,
          city_id: 3207,
          date_of_birth: 0,
        });

      expect(response.status).toBe(403);
      expect(response.body.error).toBeDefined();
    });

    it("should be rejected if province not found", async () => {
      const response = await request(app.getHttpServer())
        .post("/v1/auth/register")
        .send({
          username: "test",
          password: "testtest",
          full_name: "testtest",
          province_id: 99,
          city_id: 3207,
          date_of_birth: 0,
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
    });

    it("should be rejected if city not found", async () => {
      const response = await request(app.getHttpServer())
        .post("/v1/auth/register")
        .send({
          username: "test",
          password: "testtest",
          full_name: "testtest",
          province_id: 32,
          city_id: 9999,
          date_of_birth: 0,
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
    });
  });

  describe("POST /v1/auth/login", () => {
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createUser();
    });

    it("should be rejected if request is invalid", async () => {
      const response = await request(app.getHttpServer())
        .post("/v1/auth/login")
        .send({
          username: "",
          password: "",
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it("should be reject if username or password wrong", async () => {
      const response = await request(app.getHttpServer())
        .post("/v1/auth/login")
        .send({
          username: "test",
          password: "wrong",
        });

      expect(response.status).toBe(401);
    });

    it("should be able to login", async () => {
      const response = await request(app.getHttpServer())
        .post("/v1/auth/login")
        .send({
          username: "test",
          password: "test",
        });

      expect(response.status).toBe(200);
      expect(response.body.payload.token).toBeDefined();
    });
  });

  describe("GET /v1/users/current", () => {
    beforeEach(async () => {
      await testService.deleteAll();
      jwt = await testService.createUser();
    });

    it("should be rejected if token is invalid", async () => {
      const response = await request(app.getHttpServer())
        .get("/v1/users/current")
        .set("Authorization", "wrong");

      expect(response.status).toBe(401);
    });

    it("should be able to get user", async () => {
      const response = await request(app.getHttpServer())
        .get("/v1/users/current")
        .set("Authorization", `Bearer ${jwt}`);

      expect(response.status).toBe(200);
      expect(response.body.payload.username).toBe("test");
    });
  });

  describe("PATCH /v1/users/current", () => {
    beforeEach(async () => {
      await testService.deleteAll();
      jwt = await testService.createUser();
    });

    it("should be rejected if request is invalid", async () => {
      const response = await request(app.getHttpServer())
        .patch("/v1/users/current")
        .set("Authorization", `Bearer ${jwt}`)
        .send({
          username: "",
          password: "",
          full_name: "",
          province_id: 0,
          city_id: 0,
          date_of_birth: 0,
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it("should be able update full_name", async () => {
      const response = await request(app.getHttpServer())
        .patch("/v1/users/current")
        .set("Authorization", `Bearer ${jwt}`)
        .send({
          full_name: "test updated",
        });

      expect(response.status).toBe(200);
      expect(response.body.payload.full_name).toBe("test updated");
    });

    it("should be able update password", async () => {
      let response = await request(app.getHttpServer())
        .patch("/v1/users/current")
        .set("Authorization", `Bearer ${jwt}`)
        .send({
          password: "updatedpassword",
        });

      expect(response.status).toBe(200);
      expect(response.body.payload.username).toBe("test");

      response = await request(app.getHttpServer())
        .post("/v1/auth/login")
        .send({
          username: "test",
          password: "updatedpassword",
        });

      expect(response.status).toBe(200);
      expect(response.body.payload.token).toBeDefined();
    });
  });

  describe("DELETE /v1/users/current", () => {
    beforeEach(async () => {
      await testService.deleteAll();
      jwt = await testService.createUser();
    });

    it("should be rejected if token is invalid", async () => {
      const response = await request(app.getHttpServer())
        .delete("/v1/users/current")
        .set("Authorization", "wrong");

      expect(response.status).toBe(401);
    });

    it("should be able to logout user", async () => {
      const response = await request(app.getHttpServer())
        .delete("/v1/users/current")
        .set("Authorization", `Bearer ${jwt}`);

      expect(response.status).toBe(200);
      expect(response.body.payload.success).toBe(true);

      const user: User = (await testService.getUser()) as User;
      expect(user.token).toBeNull();
    });
  });
});
