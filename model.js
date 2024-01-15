const format = require("pg-format");
const db = require("./db/connection");


exports.fetchTopics = () => {
  const query = format(`SELECT * FROM topics;`);
  return db.query(query).then((data) => {
    return data.rows
  });
};
