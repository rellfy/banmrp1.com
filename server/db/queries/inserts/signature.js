module.exports = `
  INSERT INTO signatures(signature)
  SELECT $1
  WHERE
  NOT EXISTS (
    SELECT signature FROM signatures WHERE LOWER(signature) = LOWER($1)
  )
`;