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

    it.only("Login fails with wrong password", function () {
        cy.contains("Login").click();
        cy.get("#username").type("echin");
        cy.get("#password").type("wrong");
        cy.get("#login-button").click();

        cy.get(".error").should("contain", "Wrong credentials");
        cy.get(".error").should("have.css", "color", "rgb(255, 0, 0)");
        cy.get(".error").should("have.css", "border-style", "solid");
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

        describe("And a note exists", function () {
            beforeEach(function () {
                cy.contains("New Note").click();
                cy.get("input").type("Another note cypress");
                cy.contains("Save").click();
            });

            it("It can be made important", function () {
                cy.contains("Another note cypress")
                    .contains("make important")
                    .click();

                cy.contains("Another note cypress")
                    .contains("make not important");
            });
        });
    });
});
