describe("Note App", function () {
    beforeEach(function () {
        cy.visit("http://localhost:3000");
    });

    it("Front page can be opened", function () {
        cy.contains("Notes");
        cy.contains("Note App, EC 2022");
    });

    it("User can login", function () {
        cy.contains("Login").click();
        cy.get("#username").type("echin");
        cy.get("#password").type("password");
        cy.get("#login-button").click();

        cy.contains("Eric logged-in");
    });
});
