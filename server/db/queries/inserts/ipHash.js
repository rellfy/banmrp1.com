﻿module.exports = `
  INSERT INTO ipHashes(ipHash)
  SELECT $1
  WHERE
  NOT EXISTS (
    SELECT ipHash FROM ipHashes WHERE ipHash = $1
  )
`;