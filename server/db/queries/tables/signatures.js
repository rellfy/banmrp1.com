﻿module.exports = `
  CREATE TABLE IF NOT EXISTS signatures
  (
    id SERIAL,
    signature TEXT NOT NULL,
    PRIMARY KEY (id)
  )
`;
