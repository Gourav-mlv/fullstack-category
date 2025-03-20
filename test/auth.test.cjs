const chai = require("chai");
const chaiHttp = require("chai-http");
const { app, server } = require("../index");
const expect = chai.expect;

chai.use(chaiHttp);

let token = ""; // Store JWT token
let categoryId = ""; // Store Category ID for update/delete tests

describe(" LOGIN API TESTS", function () {
    this.timeout(10000); // Increase timeout to avoid test failure due to slow response

    // Before tests, get authentication token
    before(async function () {
        try {
            if (!server?.address()) {
                await server.listen(process.env.PORT || 6900);
                console.log("✅ server started for tests...");
            }

            const res = await chai.request(server)
                .post("/auth/login") // Fixed missing `/`
                .send({ username: "testuser", password: "test123" });
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("token");
            token = res.body.token;
            console.log("✅ Authenticated successfully!");
        } catch (err) {
            console.error("❌ Error in before hook:", err.message);
            throw err;
        }
    });
    it("✅ Should login with valid credentials", async function () {
        const res = await chai.request(server)
            .post("/auth/login")
            .send({ username: "testuser", password: "test123" });

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("token");
    });

    it("❌ Should fail login with incorrect username", async function () {
        const res = await chai.request(server)
            .post("/auth/login")
            .send({ username: "wronguser", password: "test123" });

        expect(res).to.have.status(401);
        expect(res.body).to.have.property("message").equal("Invalid credentials");
    });


    it("❌ Should fail login with incorrect password", async function () {
        const res = await chai.request(server)
            .post("/auth/login")
            .send({ username: "testuser", password: "wrongpass" });

        expect(res).to.have.status(401);
        expect(res.body).to.have.property("message").equal("Invalid credentials");
    });

    it("❌ Should return 400 for missing username field", async function () {
        const res = await chai.request(server)
            .post("/auth/login")
            .send({ password: "test123" });

        expect(res).to.have.status(400);
        expect(res.body).to.have.property("message").equal("Username and password are required");
    });

    it("❌ Should return 400 for missing password field", async function () {
        const res = await chai.request(server)
            .post("/auth/login")
            .send({ username: "testuser" });

        expect(res).to.have.status(400);
        expect(res.body).to.have.property("message").equal("Username and password are required");
    });
    // Cleanup: Close the server after tests
    after(async function () {
        console.log("🛑 Closing server and database...");
        await server?.close();
    });
});