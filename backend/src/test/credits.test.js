import request from "supertest";
import { expect } from "chai";
import serverTest from "../../dist/serverTest.js";

// ----------- Note -----------
// if backend already run => use : PORT=3001 npm run test
// else => use : npm run test
// -------------------------------

describe("POST {object} to create a credit", () => {
  // -- Crédit A
  it("Credits A created", (done) => {
    const newCreditA = {
      name: "a",
      number: 5,
      maxNumber: 5,
    };
    // console.log(newCredit);
    request(serverTest)
      .post("/api/credits")
      .send(newCreditA)
      .set("Accept", "application/json")
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property("name").to.equal("A");
        expect(res.body).to.have.property("number").to.equal(5);
        expect(res.body).to.have.property("maxNumber").to.equal(5);
        done();
      });
  });
  // -- Crédit B
  it("Credits B created", (done) => {
    const newCreditB = {
      name: "b",
      number: 5,
      maxNumber: 5,
    };
    request(serverTest)
      .post("/api/credits")
      .send(newCreditB)
      .set("Accept", "application/json")
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property("name").to.equal("B");
        expect(res.body).to.have.property("number").to.equal(5);
        expect(res.body).to.have.property("maxNumber").to.equal(5);
        done();
      });
  });
  // -- Crédit C
  it("Credits C created", (done) => {
    const newCreditC = {
      name: "c",
      number: 5,
      maxNumber: 5,
    };
    request(serverTest)
      .post("/api/credits")
      .send(newCreditC)
      .set("Accept", "application/json")
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property("name").to.equal("C");
        expect(res.body).to.have.property("number").to.equal(5);
        expect(res.body).to.have.property("maxNumber").to.equal(5);
        done();
      });
  });
});

// -------------------------------

describe("GET/:id check response format and informations", () => {
  // --- Credits A
  it("Response for credits A is correct", (done) => {
    request(serverTest)
      .get("/api/credits/A")
      .set("Accept", "application/json")
      .end((err, res) => {
        if (err) return done(err);
        // Check if Status 200
        expect(res.status).to.equal(200);
        // Vérifie propriétés de response
        expect(res.body).to.have.property("_id");
        expect(res.body).to.have.property("name").to.equals("A");
        expect(res.body).to.have.property("number");
        expect(res.body).to.have.property("maxNumber");
        expect(res.body).to.have.property("__v");
        done(); // Fin du test
      });
  });
  // --- Credits B
  it("Response for credits B is correct", (done) => {
    request(serverTest)
      .get("/api/credits/B")
      .set("Accept", "application/json")
      .end((err, res) => {
        if (err) return done(err);
        // Check if Status 200
        expect(res.status).to.equal(200);
        // Vérifie propriétés de response
        expect(res.body).to.have.property("_id");
        expect(res.body).to.have.property("name").to.equals("B");
        expect(res.body).to.have.property("number");
        expect(res.body).to.have.property("maxNumber");
        expect(res.body).to.have.property("__v");
        done(); // Fin du test
      });
  });
  // --- Credits C
  it("Response for credits C is correct", (done) => {
    request(serverTest)
      .get("/api/credits/C")
      .set("Accept", "application/json")
      .end((err, res) => {
        if (err) return done(err);
        // Check if Status 200
        expect(res.status).to.equal(200);
        // Vérifie propriétés de response
        expect(res.body).to.have.property("_id");
        expect(res.body).to.have.property("name").to.equals("C");
        expect(res.body).to.have.property("number");
        expect(res.body).to.have.property("maxNumber");
        expect(res.body).to.have.property("__v");
        done(); // Fin du test
      });
  });
});

// -------------------------------

describe("PUT/:id credits", () => {
  it("Credits A updated", (done) => {
    const requestBody = {
      number: 10,
      __v: -1,
    };
    request(serverTest)
      .put("/api/credits/A")
      .send(requestBody) // Envoyer le corps de la requête
      .set("Accept", "application/json")
      .end((err, res) => {
        if (err) return done(err);
        // Vérifier le statut de la réponse
        expect(res.status).to.equal(200);
        // Vérifier que le champ "number" a été correctement modifié
        expect(res.body).to.have.property("number").to.equal(10);
        done(); // Fin du test
      });
  });
  it("Credits B updated", (done) => {
    const requestBody = {
      number: 10,
      __v: -1,
    };
    request(serverTest)
      .put("/api/credits/B")
      .send(requestBody) // Envoyer le corps de la requête
      .set("Accept", "application/json")
      .end((err, res) => {
        if (err) return done(err);
        // Vérifier le statut de la réponse
        expect(res.status).to.equal(200);
        // Vérifier que le champ "number" a été correctement modifié
        expect(res.body).to.have.property("number").to.equal(10);
        done(); // Fin du test
      });
  });
  it("Credits C updated", (done) => {
    const requestBody = {
      number: 10,
      __v: -1,
    };
    request(serverTest)
      .put("/api/credits/C")
      .send(requestBody) // Envoyer le corps de la requête
      .set("Accept", "application/json")
      .end((err, res) => {
        if (err) return done(err);
        // Vérifier le statut de la réponse
        expect(res.status).to.equal(200);
        // Vérifier que le champ "number" a été correctement modifié
        expect(res.body).to.have.property("number").to.equal(10);
        done(); // Fin du test
      });
  });
});

// -------------------------------

describe("DELETE/:id credit", () => {
  // -- Suppression Crédit A
  it("Credit A deleted", (done) => {
    request(serverTest)
      .delete("/api/credits/A")
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body)
          .to.have.property("message")
          .to.equal("Crédit supprimé avec succès");
        done();
      });
  });

  // -- Suppression Crédit B
  it("Credit B deleted", (done) => {
    request(serverTest)
      .delete("/api/credits/B")
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body)
          .to.have.property("message")
          .to.equal("Crédit supprimé avec succès");
        done();
      });
  });

  // -- Suppression Crédit C
  it("Credit C deleted", (done) => {
    request(serverTest)
      .delete("/api/credits/C")
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body)
          .to.have.property("message")
          .to.equal("Crédit supprimé avec succès");
        done();
      });
  });
});
