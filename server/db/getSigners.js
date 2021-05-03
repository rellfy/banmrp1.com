const pool = require("./index").pool;

let signersCache = [];
let lastFetchTime = 0;
const maxCacheTime = 500;

const updateCache = async () => {
  const client = await pool.connect();
  signersCache = (await client.query(`
    SELECT *
    FROM signatures
  `))?.rows?.map(x => x.signature) ?? [];
  client.release();
};

module.exports = async () => {
  if (Date.now() - lastFetchTime > maxCacheTime)
    await updateCache();
  return signersCache;
};
