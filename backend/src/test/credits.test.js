import request from "supertest";
import { test, assert, beforeAll, afterAll } from "vitest";
import server from "../../dist/server.js";
import { allType, creditsData } from "../../dist/constants/constants.js";

// ===========================

// beforeAll
beforeAll(async () => {
  // Vérifier et créer les crédits pour chaque type s'ils n'existent pas
  await Promise.all(
    allType.map(async (type) => {
      const res = await request(server)
        .get(`/api/credits/${type}`)
        .set("Accept", "application/json");
      // Si le crédit n'existe pas, le créer
      if (res.status === 404) {
        // Données de crédit dans creditsData
        const creditData = creditsData.find((item) => item[type]);
        if (creditData) {
          const { number, maxNumber } = creditData[type];
          // Create crédit avec les données trouvées
          await request(server)
            .post("/api/credits")
            .send({ name: type, number, maxNumber })
            .set("Accept", "application/json");
        } else {
          // Create crédit avec des valeurs par défaut
          await request(server)
            .post("/api/credits")
            .send({ name: type, number: 5, maxNumber: 5 })
            .set("Accept", "application/json");
        }
      }
    })
  );
});

// afterAll
afterAll(async () => {
  // Récupérer tous les crédits existants
  const getAllResponse = await request(server)
    .get("/api/credits")
    .set("Accept", "application/json");

  if (getAllResponse.status === 200 && getAllResponse.body.length > 0) {
    // Supprimer chaque crédit récupéré
    await Promise.all(
      getAllResponse.body.map(async (credit) => {
        await request(server)
          .delete(`/api/credits/${credit.name}`)
          .set("Accept", "application/json");
      })
    );
  }
});

// ===========================

allType.forEach((type) => {
  // GET -- check le format de la réponse
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

  // POST (Create) test pour chaque type --- avec valeur définis ou par défault si non éxistante
  test(`Create ${type}`, async () => {
    // default value
    let number = 5;
    let maxNumber = 5;
    // Target data dans creditsData
    const creditData = creditsData.find((item) => item[type]);
    // Si data exist => on les utilise
    if (creditData) {
      number = creditData[type].number;
      maxNumber = creditData[type].maxNumber;
    }
    const newCredit = {
      name: type.toLowerCase(),
      number: number,
      maxNumber: maxNumber,
    };
    const res = await request(server)
      .post("/api/credits")
      .send(newCredit)
      .set("Accept", "application/json");
    assert.equal(res.status, 201);
    assert.equal(res.body.name, type);
    assert.equal(res.body.number, number);
    assert.equal(res.body.maxNumber, maxNumber);
  });
});
