const express = require("express");
const path = require("path");
const server = express();
const clientPath = path.resolve(__dirname, "../client/");
const crypto = require("crypto");
const getSigners = require("./db/getSigners");
const db = require("./db");

const sha256 = (x) => {
  return crypto.createHash("sha256").update(x).digest("hex");
};

server.use(express.json());
server.use(express.static(path.join(clientPath)));
server.get("/", (request, response) => {
  response.sendFile(path.join(clientPath, "index.html"));
});
server.get("/signers", async (request, response) => {
  response.send({ signers: await getSigners() });
});
server.post("/sign", async (request, response) => {
  try {
    const signer = request.body?.signer;
    if (signer == null || typeof signer !== "string" || signer.length < 2 || signer.length > 50) 
      return response.send({ error: "sign correctly noob" });
    const ipHash = sha256(request.connection.remoteAddress);
    await db.addSigner(signer, ipHash);
  } catch (error) {
    return response.send({ error });
  }
  response.send({ error: null });
});

server.listen(process.env.PORT || 80);
db.setupTables().then(() => { console.log("db initialised") });
