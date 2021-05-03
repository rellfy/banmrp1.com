﻿﻿module.exports = `
  CREATE TABLE IF NOT EXISTS ipHashes
  (
    id SERIAL,
    ipHash TEXT NOT NULL,
    PRIMARY KEY (id)
  )
`;
