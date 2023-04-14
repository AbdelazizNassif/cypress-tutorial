/// <reference types="Cypress" />

import config from "./config.json";
import 'cypress-plugin-api'


describe("Create new user", () => {
  var userId;
  const email = "email" + Date.now() + "@email.com"
  const name = "nameUser"
var newEmail;
  it("Create new user with valid token", () => {
    cy.api({
      method: "POST",
      url: config.URL + "/users",
      failOnStatusCode:false,
      headers:
      {
        "Content-Type": "application/json",
        Authorization: "Bearer " + config.Bearer_Rest,
      },
      body: 
        {
            "name": name,
            "gender": "male",
            "email": email,
            "status": "active"
        }
    }).as("user");
    cy.get("@user").its("status").should("eq", 201);
    cy.get("@user").then((response) => {
      expect(response.body.id).to.be.not.null
      expect(response.body.email).to.equal(email)
      expect(response.body.name).to.equal(name)
      var body = response.body;
      userId = body['id']
    });
  });
  it("Get newly created user", () => {
    
    cy.api({
      method: "GET",
      url: config.URL + "/users/" + userId,
      failOnStatusCode:false,
      headers:
      {
        "Content-Type": "application/json",
        Authorization: "Bearer " + config.Bearer_Rest,
      }
    }).as("user");
    cy.get("@user").its("status").should("eq", 200);
    cy.get("@user").then((response) => {
      expect(response.body.id).to.equal(userId)
      expect(response.body.email).to.equal(email)
      expect(response.body.name).to.equal(name)
    });
  });
  it("Get all existing users and check that the newly created user is added in the lsit of users", () => {
    
    cy.api({
      method: "GET",
      url: config.URL + "/users/",
      failOnStatusCode:false,
      headers:
      {
        "Content-Type": "application/json",
        Authorization: "Bearer " + config.Bearer_Rest,
      }
    }).as("user");
    cy.get("@user").its("status").should("eq", 200);
    cy.get("@user").then((response) => {
      expect(response.body[0].id).to.equal(userId)
      expect(response.body[0].email).to.equal(email)
      expect(response.body[0].name).to.equal(name)
      expect(response.body).to.have.length.greaterThan(0)
    });
  });
  it("Edit newly created user", () => {
    newEmail = "newEmail" + Date.now() +"@example.com"
    cy.api({
      method: "PATCH",
      url: config.URL + "/users/" + userId,
      failOnStatusCode:false,
      headers:
      {
        "Content-Type": "application/json",
        Authorization: "Bearer " + config.Bearer_Rest,
      },
      body: {
        "name":name,
        "email": newEmail, 
        "status":"active"
      }
    }).as("user");
    cy.get("@user").its("status").should("eq", 200);
    cy.get("@user").then((response) => {
      expect(response.body.id).to.equal(userId)
      expect(response.body.email).to.equal(newEmail)
      expect(response.body.name).to.equal(name)
    });
  });
  it("after editing first user, Get all existing users and check that the newly created user is added in the lsit of users", () => {
    
    cy.api({
      method: "GET",
      url: config.URL + "/users/",
      failOnStatusCode:false,
      headers:
      {
        "Content-Type": "application/json",
        Authorization: "Bearer " + config.Bearer_Rest,
      }
    }).as("user");
    cy.get("@user").its("status").should("eq", 200);
    cy.get("@user").then((response) => {
      expect(response.body[0].id).to.equal(userId)
      expect(response.body[0].email).to.equal(newEmail)
      expect(response.body[0].name).to.equal(name)
      expect(response.body).to.have.length.greaterThan(0)
    });
  });
  it("Delete the newly created user", () => {
    cy.api({
      method: "DELETE",
      url: config.URL + "/users/" + userId,
      failOnStatusCode:false,
      headers:
      {
        "Content-Type": "application/json",
        Authorization: "Bearer " + config.Bearer_Rest,
      }
    }).as("user");
    cy.get("@user").its("status").should("eq", 204);
    cy.get("@user").then((response) => {
      expect(response.body).to.be.empty
    });
  });
  it("Get all existing users and check that the newly created user is deleted from the users list", () => {
    
    cy.api({
      method: "GET",
      url: config.URL + "/users/",
      failOnStatusCode:false,
      headers:
      {
        "Content-Type": "application/json",
        Authorization: "Bearer " + config.Bearer_Rest,
      }
    }).as("user");
    cy.get("@user").its("status").should("eq", 200);
    cy.get("@user").then((response) => {
      expect(response.body[0].id).not.to.equal(userId)
      expect(response.body[0].email).not.to.equal(email)
      expect(response.body).to.have.length.greaterThan(0)
    });
  });
  it("Check that newly created user is deleted", () => {
    
    cy.api({
      method: "GET",
      url: config.URL + "/users/" + userId,
      failOnStatusCode:false,
      headers:
      {
        "Content-Type": "application/json",
        Authorization: "Bearer " + config.Bearer_Rest,
      }
    }).as("user");
    cy.get("@user").its("status").should("eq", 404);
    cy.get("@user").then((response) => {
      expect(response.body.message).to.equal("Resource not found")
    });
  });
});