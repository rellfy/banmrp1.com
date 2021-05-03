﻿﻿const { Pool } = require("pg");
const pool = new Pool();
const tables = require("./queries/tables");
const insertIphash = require("./queries/inserts/ipHash");
const insertSignature = require("./queries/inserts/signature");

pool.on("error", (error, client) => {
  console.error("Unexpected error on idle database client", error);
});

module.exports.setupTables = async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (let table of tables) {
      await client.query(table)
    }
    await client.query("END");
  } catch (e) {
    await client.query("ROLLBACK");
    console.error(e);
  } finally {
    client.release();
  }
};

/**
 * @param {string} signature
 * @param {string} ipHash
 * @returns {Promise<boolean>}
 */
const signerExists = async (signature, ipHash) => {
  const client = await pool.connect();
  const hasSignature = (await client.query(`
    SELECT *
    FROM signatures
    WHERE LOWER(signature)=LOWER($1)
    LIMIT 1
  `, [signature]))?.rows?.length === 1;
  if (hasSignature)
    return true;
  const hasIpHash = (await client.query(`
    SELECT *
    FROM ipHashes
    WHERE LOWER(ipHash)=LOWER($1)
    LIMIT 1
  `, [ipHash]))?.rows?.length === 1;
  client.release();
  return hasIpHash;
};

/**
 * @param {string} signature
 * @param {string} ipHash
 * @returns {Promise<void>}
 */
module.exports.addSigner = async (signature, ipHash) => {
  const client = await pool.connect();
  if (await signerExists(signature, ipHash))
    throw "cant sign twice noob";
  let error = null;
  try {
    await client.query("BEGIN");
    await client.query(insertSignature, [signature]);
    await client.query(insertIphash, [ipHash]);
    await client.query("END");
  } catch (e) {
    await client.query("ROLLBACK");
    console.error(e);
    error = "not today noob";
  } finally {
    client.release();
  }
  if (error != null)
    throw error;
};

module.exports.pool = pool;
