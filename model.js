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
  const query = format(
    `SELECT * FROM articles WHERE article_id = ${articleId};`
  );
  return db.query(query).then((data) => {
    return data.rows;
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

exports.fetchArticleComment = async (articleId) => {
  articleId = Number(articleId);

  const query = `SELECT comment_id, votes, created_at, author,body,article_id FROM comments WHERE article_id = ${articleId} ORDER BY created_at DESC`;
  return db.query(query).then((data) => {
    return data.rows;
  });
};

exports.addNewComment = async (articleId, username, commentBody, users) => {
  articleId = Number(articleId);

  const allValidUsername = users.map(({ username }) => {
    return username;
  });

  if (typeof username !== "string" || typeof commentBody !== "string") {
    return Promise.reject({ msg: "invalid input" });
  }

  const inputData = [[articleId, username, commentBody]];

  const query = format(
    "INSERT INTO comments (article_id,author,body) VALUES %L RETURNING *",
    inputData
  );
  return db.query(query).then((data) => {
    return data.rows;
  });
};

exports.fetchAllUsers = () => {
  const query = "SELECT * FROM users";
  return db.query(query).then((data) => {
    return data.rows;
  });
};

exports.updateArticleObj = async () => {
  articleId = Number(articleId);

  const query = "";
  return db.query(query).then((data) => {
    return data.rows;
  });
};

exports.validateArticleId = async (articleId) => {
  articleId = Number(articleId);
  const allArticle = await this.fetchArticles();
  const validArticldId = allArticle.map(({ article_id }) => {
    return article_id;
  });
  if (Number.isInteger(articleId) === false) {
    return Promise.reject({ msg: "invalid input" });
  } else if (!validArticldId.includes(articleId)) {
    return Promise.reject({ msg: "Non-existent id" });
  } else {
    return articleId;
  }
};

exports.updateArticleVote = (articleId, newVote) => {
  newVote = Number(newVote);
  const inputData = [[newVote, articleId]];
  if (!Number.isInteger(newVote)) {
    return Promise.reject({ msg: "invalid input" });
  } else {
    const query = format(
      "UPDATE articles SET votes = votes + %L WHERE article_id = %L RETURNING *",
      newVote,articleId
    );
    return db.query(query).then((data)=>{
      return data.rows;
    })
  }
};
