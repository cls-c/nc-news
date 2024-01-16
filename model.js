const format = require("pg-format");
const db = require("./db/connection");
const apiInfo = require("./endpoints.json");

exports.fetchTopics = () => {
  const query = format(`SELECT * FROM topics;`);
  return db.query(query).then((data) => {
    return data.rows;
  });
};

exports.fetchApiInformation = () => {
  return apiInfo;
};

exports.fetchArticleWithCorrectId = (articleId) => {
  articleId = Number(articleId);
  if (Number.isInteger(articleId) === false) {
    return Promise.reject({ msg: "invalid input" });
  }
  const query = format(
    `SELECT * FROM articles WHERE article_id = ${articleId};`
  );
  return db.query(query).then((data) => {
    if (data.rows.length === 0) {
      return Promise.reject({ msg: "Non-existent id" });
    } else {
      return data.rows;
    }
  });
};
exports.fetchArticles = (sortingKey) => {
  let sortBy = "articles.created_at";
  const acceptedKey = {
    author: "articles",
    title: "articles",
    article_id: "articles",
    topic: "articles",
    votes: "articles",
    count_comment: "t2",
  };
  let key;
  const validInput = Object.keys(acceptedKey);
  if (sortingKey != undefined) {
    if (validInput.includes(sortingKey) === false) {
      return Promise.reject({ msg: "invalid Sort_by", status: 404 });
    }

    sortBy = `${
      Object.entries(acceptedKey).find((element) => {
        return element[0] === sortingKey;
      })[1]
    }.${sortingKey}`;
  }
  const query = format(
    `SELECT articles.author,articles.title,articles.article_id,articles.topic,articles.created_at,articles.votes,articles.article_img_url, t2.count_comment AS comment_count FROM articles LEFT JOIN (SELECT article_id, COUNT(*) AS count_comment FROM comments GROUP BY article_id) AS t2 ON articles.article_id = t2.article_id ORDER BY ${sortBy} DESC;`
  );
  return db.query(query).then((data) => {
    return data.rows;
  });
};

exports.fetchArticleComment = (articleId) => {
  articleId = Number(articleId);
  if (Number.isInteger(articleId) === false) {
    console.log(articleId, "rejection");
    return Promise.reject({ msg: "invalid input" });
  }
  const query = `SELECT comment_id, votes, created_at, author,body,article_id FROM comments WHERE article_id = ${articleId} ORDER BY created_at DESC`;
  return db.query(query).then((data) => {
    if (data.rows.length === 0) {
      return Promise.reject({ msg: "Non-existent id" });
    } else {
      return data.rows;
    }
  });
};
