const chai = require("chai");
const chaiHttp = require("chai-http");
const { app,  server } = require("../index");
const expect = chai.expect;

chai.use(chaiHttp);

let token = ""; // Store JWT token
let categoryId = ""; // Store Category ID for update/delete tests

describe(" CATEGORY API TESTS", function () {
  this.timeout(10000); // Increase timeout to avoid test failure due to slow response

  // Before tests, get authentication token
  before(async function () {
    try {
      if (!server?.address()) {
        await server.listen(3000);
        console.log("✅ server started for tests...");
      }

      const res = await chai.request(server)
        .post("/auth/login") // Fixed missing `/`
        .send({ username: "testuser", password: "test123" });
        console.log(JSON.stringify(res));
      expect(res).to.have.status(200);
      expect(res.body).to.have.property("token");

      token = res.body.token;
      console.log("✅ Authenticated successfully!");
    } catch (err) {
      console.error("❌ Error in before hook:", err.message);
      throw err;
    }
  });

  // 1. Test Category Creation
  it("Should create a new category", async function () {
    const res = await chai.request(server)
      .post("/categories")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Men's Clothing", parentId: null });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("name").equal("Men's Clothing");
    expect(res.body).to.have.property("_id"); // Ensure ID exists
    categoryId = res.body._id;
    console.log("✅ Category created with ID:", categoryId);
  });

  // 2. Test Fetching Categories
  it("Should fetch all categories", async function () {
    const res = await chai.request(server)
      .get("/categories")
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
    console.log("✅ Fetched categories");
  });

  // 3. Test Updating a Category
  it("Should update a category", async function () {
    const res = await chai.request(server)
      .put(`/categories/`)
      .set("Authorization", `Bearer ${token}`)
      .send({ id : categoryId,
        name: "Men's serverarel" });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("name").equal("Men's serverarel");
    console.log("✅ Category updated");
  });

  // 4. Test Deleting a Category
  it("Should delete a category", async function () {
    const res = await chai.request(server)
      .delete(`/categories`)
      .set("Authorization", `Bearer ${token}`)
      .send({ id : categoryId});;

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("message").equal("Category and its children deleted");
    console.log("✅ Category deleted");
  });

  // 5. Test Deleting a Non-Existent Category
  it("Should return 404 when deleting a non-existent category", async function () {
    const res = await chai.request(server)
      .delete(`/categories/`)
      .set("Authorization", `Bearer ${token}`)
      .send({ id : "6600abcd1234567890123456"});
    expect(res).to.have.status(404);
    expect(res.body).to.have.property("message").equal("Category not found");
    console.log("✅ Verified 404 for non-existent category");
  });

  // Cleanup: Close the server after tests
  after(async function () {
    console.log("🛑 Closing server and database...");
    await server?.close();
  });
});