describe("Note App", function () {
    beforeEach(function () {
        cy.request("POST", "http://localhost:3001/api/testing/reset");
        const user = {
            name: "Eric",
            username: "echin",
            password: "password"
        };
        cy.request("POST", "http://localhost:3001/api/users", user);
        cy.visit("http://localhost:3000");
    });

    it("Front page can be opened", function () {
        cy.contains("Notes");
        cy.contains("Note App, EC 2022");
    });

    it("User can log in", function () {
        cy.contains("Login").click();
        cy.get("#username").type("echin");
        cy.get("#password").type("password");
        cy.get("#login-button").click();

        cy.contains("Eric logged-in");
    });

    describe("When logged in", function () {
        beforeEach(function () {
            cy.contains("Login").click();
            cy.get("#username").type("echin");
            cy.get("#password").type("password");
            cy.get("#login-button").click();

            cy.contains("Eric logged-in");
        });

        it("A new note can be created", function () {
            cy.contains("New Note").click();
            cy.get("input").type("A note created by cypress");
            cy.contains("Save").click();
            cy.contains("A note created by cypress");
        });
    });
});
