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
        cy.get("input:first").type("echin");
        cy.get("input:last").type("password");
    });
});
