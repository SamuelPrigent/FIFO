import { expect } from "chai";
import request from "supertest";
import app from "../app.js";

// Check response format
describe("GET Credits", () => {
  it("Response have correct format", (done) => {
    request(app)
      .get("/api/credits/A")
      .end((err, res) => {
        if (err) return done(err);
        // Vérifie le status 200
        expect(res.status).to.equal(200);
        // Vérifie propriétés de response
        // expect(res.body).to.have.property("_id");
        // expect(res.body).to.have.property("name");
        // expect(res.body).to.have.property("number");
        // expect(res.body).to.have.property("maxNumber");
        // expect(res.body).to.have.property("__v");
        done();
      });
  });
});
