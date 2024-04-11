import request from "supertest";
import { test, assert, beforeAll } from "vitest";
import server from "../../dist/server.js";

import "dotenv/config";
const allTypeString = process.env.CreditList || "";
const allType = allTypeString.split(",");

// ===========================

beforeAll(async () => {
  // Vérifier et créer les crédits pour chaque type s'ils n'existent pas
  await Promise.all(
    allType.map(async (type) => {
      const res = await request(server)
        .get(`/api/credits/${type}`)
        .set("Accept", "application/json");
      // Si le crédit n'existe pas, le créer
      if (res.status === 404) {
        await request(server)
          .post("/api/credits")
          .send({ name: type, number: 5, maxNumber: 5 })
          .set("Accept", "application/json");
      }
    })
  );
});

// ===========================

// Tests pour vérifier la réponse pour chaque type de crédit
allType.forEach((type) => {
  test(`GET ${type} (response format)`, async () => {
    const res = await request(server)
      .get(`/api/credits/${type}`)
      .set("Accept", "application/json");

    assert.equal(res.status, 200);
    assert.property(res.body, "_id");
    assert.propertyVal(res.body, "name", type);
    assert.property(res.body, "number");
    assert.property(res.body, "maxNumber");
    assert.property(res.body, "__v");
  });

  // PUT test pour chaque type
  test(`PUT ${type}`, async () => {
    const requestBody = {
      number: 10,
      __v: -1,
    };
    const res = await request(server)
      .put(`/api/credits/${type}`)
      .send(requestBody)
      .set("Accept", "application/json");

    assert.equal(res.status, 200);
    assert.propertyVal(res.body, "number", 10);
  });

  // DELETE test pour chaque type
  test(`Delete ${type}`, async () => {
    const resDelete = await request(server)
      .delete(`/api/credits/${type}`)
      .set("Accept", "application/json");

    assert.equal(resDelete.status, 200);
  });

  // POST (Create) test pour chaque type
  test(`Create ${type}`, async () => {
    const newCredit = {
      name: type.toLowerCase(), // Assurez-vous que la casse correspond à vos attentes côté serveur
      number: 5,
      maxNumber: 5,
    };
    const res = await request(server)
      .post("/api/credits")
      .send(newCredit)
      .set("Accept", "application/json");

    assert.equal(res.status, 201);
    assert.equal(res.body.name, type);
    assert.equal(res.body.number, 5);
    assert.equal(res.body.maxNumber, 5);
  });
});
