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

    });
});
