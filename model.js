const format = require("pg-format");
const db = require("./db/connection");
const apiInfo = require("./endpoints.json")

exports.fetchTopics = () => {
  const query = format(`SELECT * FROM topics;`);
  return db.query(query).then((data) => {
    return data.rows;
  });
};

exports.fetchApiInformation = () => {
    return apiInfo
}

exports.fetchArticleWithCorrectId = (articleId) => {
  const query = format(`SELECT * FROM articles WHERE article_id = ${articleId};`);
  return db.query(query).then((data)=> {
    if (data.rows.length === 0){
      return Promise.reject({msg:'Not found!'})
    } else {
      return data.rows;
    }
  });
}