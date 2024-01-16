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
  articleId = Number(articleId)
  if (Number.isInteger(articleId) === false){
    return Promise.reject({msg:'invalid input'})
  }
  const query = format(`SELECT * FROM articles WHERE article_id = ${articleId};`);
  return db.query(query).then((data)=> {
    if (data.rows.length === 0){
      return Promise.reject({msg:'Non-existent id'})
    } else {
      return data.rows;
    }
  });
}
exports.fetchArticles = () => {
  const query = format(`SELECT articles.author,articles.title,articles.article_id,articles.topic,articles.created_at,articles.votes,articles.article_img_url,comments.body FROM articles INNER JOIN comments ON articles.article_id = comments.article_id ORDER BY articles.created_at ASC;`)
  return db.query(query).then((data)=>{
    console.log(data.rows)
    return data.rows;
  })
}