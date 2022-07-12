describe("Blog App", function () {
    beforeEach(function () {
        cy.request("POST", "http://localhost:3003/api/testing/reset");
        const user = {
            name: "Eric",
            username: "echin",
            password: "password"
        };
        cy.request("POST", "http://localhost:3003/api/users", user);
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
});
