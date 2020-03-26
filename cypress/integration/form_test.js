describe("Testing the Form", function() {
  beforeEach(function() {
    cy.visit("http://localhost:3000");
  });
  it("check for empty inputs", function() {
    cy.get("input:invalid").should("have.length", 0);
  });

  it("adding test to inputs to sumit form", function() {
    cy.get('input[name="name"]')
      .type("anthony")
      .should("have.value", "anthony");

    //  cy.expect('input[name="name"]').to.not.equal("");

    cy.get('input[name="email"]')
      .type("example@example.com")
      .should("have.value", "example@example.com");

    cy.get('[name="password"]')
      .type("password")
      .should("have.value", "password");

    cy.get("[name='role']")
      .select("Backend")
      .should("have.value", "Backend");

    cy.get("[type='checkbox']")
      .check()
      .should("be.checked");

    cy.get('[type="submit"]').click();
  });
});
