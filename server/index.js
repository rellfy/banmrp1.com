const express = require("express");
const path = require("path");
const server = express();
const clientPath = path.resolve(__dirname, "../client/");
const crypto = require("crypto");

const signers = [];
const ipHashes = [];

const sha256 = (x) => {
  return crypto.createHash("sha256").update(x).digest("hex");
};

server.use(express.json());
server.use(express.static(path.join(clientPath)));
server.get("/", (request, response) => {
  response.sendFile(path.join(clientPath, "index.html"));
});
server.get("/signers", (request, response) => {
  response.send({ signers });
});
server.post("/sign", (request, response) => {
  const signer = request.body?.signer;
  const ipHash = sha256(request.headers["x-forwarded-for"] || request.connection.remoteAddress);
  if (ipHashes.includes(ipHash))
    return response.send({ error: "cant sign twice noob" });
  if (signer == null || signer.length < 2 || typeof signer !== "string" || signer.length > 50)
    return response.send({ error: "sign correctly noob" });
  ipHashes.push(ipHash);
  signers.push(signer);
  response.send({ error: null });
});

server.listen(process.env.PORT || 80);