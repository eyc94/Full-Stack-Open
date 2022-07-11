describe("Note App", function () {
    it("Front page can be opened", function () {
        cy.visit("http://localhost:3000");
        cy.contains("Notes");
        cy.contains("Note App, EC 2022");
    });
});
