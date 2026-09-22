describe("Registration", () => {
  it("opens and fills the registration form", () => {
    cy.visit("/register");

    cy.url().should("include", "/register");

    // Full name
    cy.get("#name").type("Cypress Test User");

    // Email
    cy.get("#email").type(`cypress${Date.now()}@example.com`);

    // Password
    cy.get("#password").type("TestPassword123!");

    // Confirm password
    cy.get("#confirm").type("TestPassword123!");

    // Open location selector
    cy.get('[role="combobox"]').click();

    // Select a location
    cy.get('[role="option"]').first().click();

    // Accept terms
    cy.get('[role="checkbox"]').click();

    // Verify the form is filled
    cy.get("#name").should("have.value", "Cypress Test User");
    cy.get("#email").should("have.value");
    cy.get("#password").should("have.value", "TestPassword123!");
    cy.get("#confirm").should("have.value", "TestPassword123!");
  });
});