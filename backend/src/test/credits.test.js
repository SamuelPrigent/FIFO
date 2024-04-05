import request from "supertest";
import { test, assert, beforeAll, afterAll } from "vitest";
import server from "../../dist/server.js";

// ===========================

beforeAll(async () => {
  // Vérifier si les crédits A, B et C existent
  const resA = await request(server)
    .get("/api/credits/A")
    .set("Accept", "application/json");
  const resB = await request(server)
    .get("/api/credits/B")
    .set("Accept", "application/json");
  const resC = await request(server)
    .get("/api/credits/C")
    .set("Accept", "application/json");

  // Si l'un des crédits n'existe pas, les créer
  if (resA.status === 404) {
    await request(server)
      .post("/api/credits")
      .send({ name: "A", number: 5, maxNumber: 5 })
      .set("Accept", "application/json");
  }
  if (resB.status === 404) {
    await request(server)
      .post("/api/credits")
      .send({ name: "B", number: 5, maxNumber: 5 })
      .set("Accept", "application/json");
  }
  if (resC.status === 404) {
    await request(server)
      .post("/api/credits")
      .send({ name: "C", number: 5, maxNumber: 5 })
      .set("Accept", "application/json");
  }
});

// ===========================

// Response for credits A
test("GET A : response format", async () => {
  // const resA = await request(serverTest)
  const resA = await request(server)
    .get("/api/credits/A")
    .set("Accept", "application/json");
  //
  assert.equal(resA.status, 200);
  assert.property(resA.body, "_id");
  assert.propertyVal(resA.body, "name", "A");
  assert.property(resA.body, "number");
  assert.property(resA.body, "maxNumber");
  assert.property(resA.body, "__v");
});

// Response for credits B
test("GET B : response format", async () => {
  //
  // const resB = await request(serverTest)
  const resB = await request(server)
    .get("/api/credits/B")
    .set("Accept", "application/json");
  //
  assert.equal(resB.status, 200);
  assert.property(resB.body, "_id");
  assert.propertyVal(resB.body, "name", "B");
  assert.property(resB.body, "number");
  assert.property(resB.body, "maxNumber");
  assert.property(resB.body, "__v");
});

// Response for credits C
test("GET C : response format", async () => {
  // const resC = await request(serverTest)
  const resC = await request(server)
    .get("/api/credits/C")
    .set("Accept", "application/json");
  assert.equal(resC.status, 200);
  assert.property(resC.body, "_id");
  assert.propertyVal(resC.body, "name", "C");
  assert.property(resC.body, "number");
  assert.property(resC.body, "maxNumber");
  assert.property(resC.body, "__v");
});

// PUT A
test("PUT A", async () => {
  // body
  const requestBody = {
    number: 10,
    __v: -1,
  };
  //
  // const resA = await request(serverTest)
  const resA = await request(server)
    .put("/api/credits/A")
    .send(requestBody)
    .set("Accept", "application/json");
  //
  assert.equal(resA.status, 200);
  assert.propertyVal(resA.body, "number", 10);
});

// PUT B
test("PUT B", async () => {
  const requestBody = {
    number: 10,
    __v: -1,
  };
  // const resB = await request(serverTest)
  const resB = await request(server)
    .put("/api/credits/B")
    .send(requestBody)
    .set("Accept", "application/json");
  //
  assert.equal(resB.status, 200);
  assert.propertyVal(resB.body, "number", 10);
});

// PUT C
test("PUT C", async () => {
  const requestBody = {
    number: 10,
    __v: -1,
  };
  // const resC = await request(serverTest)
  const resC = await request(server)
    .put("/api/credits/C")
    .send(requestBody)
    .set("Accept", "application/json");
  //
  assert.equal(resC.status, 200);
  assert.propertyVal(resC.body, "number", 10);
});

// DELETE A
test("Delete A", async () => {
  // request
  // const resDeleteA = await request(serverTest)
  const resDeleteA = await request(server)
    .delete("/api/credits/A")
    .set("Accept", "application/json");
  // response
  assert.equal(resDeleteA.status, 200);
});

// DELETE B
test("Delete B", async () => {
  // request
  // const resDeleteB = await request(serverTest)
  const resDeleteB = await request(server)
    .delete("/api/credits/B")
    .set("Accept", "application/json");
  // response
  assert.equal(resDeleteB.status, 200);
});

// DELETE C
test("Delete C", async () => {
  // request
  // const resDeleteC = await request(serverTest)
  const resDeleteC = await request(server)
    .delete("/api/credits/C")
    .set("Accept", "application/json");
  // response
  assert.equal(resDeleteC.status, 200);
});

// POST A
test("Create A", async () => {
  // object
  const newCreditA = {
    name: "a",
    number: 5,
    maxNumber: 5,
  };
  // request
  // const resA = await request(serverTest)
  const resA = await request(server)
    .post("/api/credits")
    .send(newCreditA)
    .set("Accept", "application/json");
  // response
  assert.equal(resA.status, 201);
  assert.equal(resA.body.name, "A");
  assert.equal(resA.body.number, 5);
  assert.equal(resA.body.maxNumber, 5);
});

// POST B
test("Create B", async () => {
  // object
  const newCreditB = {
    name: "b",
    number: 5,
    maxNumber: 5,
  };
  // request
  // const resB = await request(serverTest)
  const resB = await request(server)
    .post("/api/credits")
    .send(newCreditB)
    .set("Accept", "application/json");
  // response
  assert.equal(resB.status, 201);
  assert.equal(resB.body.name, "B");
  assert.equal(resB.body.number, 5);
  assert.equal(resB.body.maxNumber, 5);
});

// POST C
test("Create C", async () => {
  // object
  const newCreditC = {
    name: "c",
    number: 5,
    maxNumber: 5,
  };
  // request
  // const resC = await request(serverTest)
  const resC = await request(server)
    .post("/api/credits")
    .send(newCreditC)
    .set("Accept", "application/json");
  // response
  assert.equal(resC.status, 201);
  assert.equal(resC.body.name, "C");
  assert.equal(resC.body.number, 5);
  assert.equal(resC.body.maxNumber, 5);
});
