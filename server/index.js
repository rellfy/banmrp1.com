const express = require("express");
const path = require("path");
const server = express();
const clientPath = path.resolve(__dirname, "../client/");
const crypto = require("crypto");
const getSigners = require("./db/getSigners");
const db = require("./db");

const processingIpHashes = [];

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
  const ipHash = sha256(request.headers["x-real-ip"] || request.connection.remoteAddress);
  if (processingIpHashes.includes(ipHash))
    return response.send({ error: "only click the button once noob" });
  processingIpHashes.push(ipHash);
  let error = null
  try {
    const signer = request.body?.signer;
    if (signer == null || typeof signer !== "string" || signer.length < 2 || signer.length > 50) 
      return response.send({ error: "sign correctly noob" });
    await db.addSigner(signer, ipHash);
  } catch (e) {
    error = e;
  } finally {
    const ipHashIndex = processingIpHashes.indexOf(ipHash);
    if (ipHashIndex > -1)
      processingIpHashes.splice(ipHashIndex, 1);
  }
  response.send({ error });
});

server.listen(process.env.PORT || 80);
db.setupTables().then(() => { console.log("db initialised") });
