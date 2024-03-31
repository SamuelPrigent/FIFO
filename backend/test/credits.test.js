import request from "supertest";
import { expect } from "chai";
import server from "../server.js";

// ----------- Note -----------
// if backend already run => use : PORT=3001 npm run test
// else => use : npm run test
// -------------------------------

describe("Check response format for Credits (A, B C)", () => {
  // --- Credits A
  it("Response for credits A have correct format", (done) => {
    request(server)
      .get("/api/credits/A")
      .set("Accept", "application/json")
      .end((err, res) => {
        if (err) return done(err);
        // Check if Status 200
        expect(res.status).to.equal(200);
        // Vérifie propriétés de response
        expect(res.body).to.have.property("_id");
        expect(res.body).to.have.property("name");
        expect(res.body).to.have.property("number");
        expect(res.body).to.have.property("maxNumber");
        expect(res.body).to.have.property("__v");
        done(); // Fin du test
      });
  });
  // --- Credits B
  it("Response for credits B have correct format", (done) => {
    request(server)
      .get("/api/credits/B")
      .set("Accept", "application/json")
      .end((err, res) => {
        if (err) return done(err);
        // Check if Status 200
        expect(res.status).to.equal(200);
        // Vérifie propriétés de response
        expect(res.body).to.have.property("_id");
        expect(res.body).to.have.property("name");
        expect(res.body).to.have.property("number");
        expect(res.body).to.have.property("maxNumber");
        expect(res.body).to.have.property("__v");
        done(); // Fin du test
      });
  });
  // --- Credits C
  it("Response for credits C have correct format", (done) => {
    request(server)
      .get("/api/credits/C")
      .set("Accept", "application/json")
      .end((err, res) => {
        if (err) return done(err);
        // Check if Status 200
        expect(res.status).to.equal(200);
        // Vérifie propriétés de response
        expect(res.body).to.have.property("_id");
        expect(res.body).to.have.property("name");
        expect(res.body).to.have.property("number");
        expect(res.body).to.have.property("maxNumber");
        expect(res.body).to.have.property("__v");
        done(); // Fin du test
      });
  });
});

// -------------------------------

describe("Response with proper name", () => {
  // --- Credits A
  it("GET credits A => name: A", (done) => {
    request(server)
      .get("/api/credits/A")
      .set("Accept", "application/json")
      .end((err, res) => {
        if (err) return done(err);
        // Check if Status 200
        expect(res.status).to.equal(200);
        // Vérifie propriétés de response
        expect(res.body).to.have.property("name").to.equals("A");
        done(); // Fin du test
      });
  });
  // --- Credits B
  it("GET credits B => name: B", (done) => {
    request(server)
      .get("/api/credits/B")
      .set("Accept", "application/json")
      .end((err, res) => {
        if (err) return done(err);
        // Check if Status 200
        expect(res.status).to.equal(200);
        // Vérifie propriétés de response
        expect(res.body).to.have.property("name").to.equals("B");
        done(); // Fin du test
      });
  });
  // --- Credits C
  it("GET credits C => name: C", (done) => {
    request(server)
      .get("/api/credits/C")
      .set("Accept", "application/json")
      .end((err, res) => {
        if (err) return done(err);
        // Check if Status 200
        expect(res.status).to.equal(200);
        // Vérifie propriétés de response
        expect(res.body).to.have.property("name").to.equals("C");
        done(); // Fin du test
      });
  });
});

// -------------------------------

describe("Does PUT request works => PUT (number : x) => res (number : x)", () => {
  it("PUT for credits A", (done) => {
    const requestBody = {
      number: 10,
    };
    request(server)
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
  it("PUT for credits B", (done) => {
    const requestBody = {
      number: 10,
    };
    request(server)
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
  it("PUT for credits C", (done) => {
    const requestBody = {
      number: 10,
    };
    request(server)
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
