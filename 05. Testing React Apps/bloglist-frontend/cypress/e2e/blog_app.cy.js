describe("Blog App", function () {
    beforeEach(function () {
        cy.request("POST", "http://localhost:3003/api/testing/reset");
        const user = {
            name: "Eric",
            username: "echin",
            password: "password"
        };
        cy.request("POST", "http://localhost:3003/api/users/", user);
        cy.visit("http://localhost:3000");
    });

    it("Login form is shown", function () {
        cy.contains("Log Into Application");
    });

    describe("Login", function () {
        it("Succeeds with correct credentials", function () {
            cy.get("#username").type("echin");
            cy.get("#password").type("password");
            cy.get("#login-button").click();

            cy.contains("Eric logged in");
        });

        it("Fails with wrong credentials", function () {
            cy.get("#username").type("echin");
            cy.get("#password").type("wrong");
            cy.get("#login-button").click();

            cy.contains("Wrong username or password");
            cy.get("html").should("not.contain", "Eric logged in");
        });
    });

    describe("When logged in", function () {
        beforeEach(function () {
            cy.get("#username").type("echin");
            cy.get("#password").type("password");
            cy.get("#login-button").click();
        });

        it("A blog can be created", function () {
            cy.contains("New Blog").click();
            cy.get("#title").type("Sample Blog");
            cy.get("#author").type("Sample Author");
            cy.get("#url").type("https://www.google.com");
            cy.get("#create-button").click();
            cy.contains("Sample Blog");
        });

        it("A blog can be liked", function () {
            cy.contains("New Blog").click();
            cy.get("#title").type("Sample Blog");
            cy.get("#author").type("Sample Author");
            cy.get("#url").type("https://www.google.com");
            cy.get("#create-button").click();
            cy.contains("View").click();
            cy.get("#like-button").click();
            cy.contains("1");
        });

        it("A blog can be removed", function () {
            cy.contains("New Blog").click();
            cy.get("#title").type("Sample Blog");
            cy.get("#author").type("Sample Author");
            cy.get("#url").type("https://www.google.com");
            cy.get("#create-button").click();
            cy.contains("View").click();
            cy.get("#remove-button").click();
        });
    });
});
