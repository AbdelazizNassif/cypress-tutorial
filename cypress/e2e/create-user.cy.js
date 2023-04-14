/// <reference types="Cypress" />

import config from "./config.json";
import "cypress-plugin-api";

describe("Create new user with - Negative tests", () => {
  var userId;
  const invalidEmail = "email" + Date.now() 
  const name = "nameUser";
  var newEmail;
  it("Create new user with invalid email", () => {
    cy.api({
      method: "POST",
      url: config.URL + "/users",
      failOnStatusCode: false,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + config.Bearer_Rest,
      },
      body: {
        name: name,
        gender: "male",
        email: invalidEmail,
        status: "active",
      },
    }).as("user");
    cy.get("@user").its("status").should("eq", 422);
    cy.get("@user").then((response) => {
      // cy.log(JSON.stringify(response.body));
      expect(response.body[0].field).to.equal("email")
      expect(response.body[0].message).to.equal("is invalid")
    });
  });
  it("Create new user with empty email and empty status", () => {
    cy.api({
      method: "POST",
      url: config.URL + "/users",
      failOnStatusCode: false,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + config.Bearer_Rest,
      },
      body: {
        name: name,
        gender: "male",
      },
    }).as("user");
    cy.get("@user").its("status").should("eq", 422);
    cy.get("@user").then((response) => {
      // cy.log(JSON.stringify(response.body));
      expect(response.body[0].field).to.equal("email")
      expect(response.body[0].message).to.equal("can't be blank")
      expect(response.headers['content-type']).to.be.equal("application/json; charset=utf-8")
      expect(response.headers['content-type']).to.be.contain("application/json;")
      expect(response.body[1].field).to.equal("status")
      expect(response.body[1].message).to.equal("can't be blank")
    });
  });
  it("Create new user with invalid gender and invalid status", () => {
    cy.api({
      method: "POST",
      url: config.URL + "/users",
      failOnStatusCode: false,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + config.Bearer_Rest,
      },
      body: {
        email: "validEmail@email.com",
        name: name,
        gender: "man",
        status: "new",
      },
    }).as("user");
    cy.get("@user").its("status").should("eq", 422);
    cy.get("@user").then((response) => {
      // cy.log(JSON.stringify(response.body));
      expect(response.body[0].field).to.equal("gender")
      expect(response.body[0].message).to.equal("can't be blank, can be male of female")
      expect(response.headers['content-type']).to.be.equal("application/json; charset=utf-8")
      expect(response.body[1].field).to.equal("status")
      expect(response.body[1].message).to.equal("can't be blank")
    });
  });
  it("Create new user with invalid token", () => {
    cy.api({
      method: "POST",
      url: config.URL + "/users",
      failOnStatusCode: false,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + "invalid_access_token_value",
      },
      body: {
        email: "validEmail@email.com",
        name: name,
        gender: "man",
        status: "active",
      },
    }).as("user");
    cy.get("@user").its("status").should("eq", 401);
    cy.get("@user").then((response) => {
      expect(response.body.message).to.equal("Invalid token")
    });
  });
});
