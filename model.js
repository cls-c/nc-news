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
    "SELECT articles.author AS author,articles.title AS title,articles.article_id AS article_id,articles.topic AS topic,articles.created_at AS created_at,articles.votes AS votes,articles.body AS body, articles.article_img_url AS article_img_url, t2.count_comment AS comment_count FROM articles LEFT JOIN (SELECT article_id, COUNT(*) AS count_comment FROM comments GROUP BY article_id) AS t2 ON articles.article_id = t2.article_id WHERE articles.article_id = %L",
    articleId
  );

  return db.query(query).then((data) => {
    return data.rows;
  });
};
exports.fetchArticles = (sortingKey, topic,order) => {
  let sortBy = "created_at";
  let topicQuery = "";
  let sortingOrder = "DESC";
  const acceptedTopic = ["mitch", "cats", "paper"];
  if (topic !== undefined) {
    if (acceptedTopic.includes(topic)) {
      topicQuery = format("WHERE topic = %L", topic);
    } else {
      return Promise.reject({ msg: "Non-existent id", status: 404 });
    }
  }

  const acceptedSortByKey = [
    "author",
    "title",
    "article_id",
    "topic",
    "votes",
    "comment_count",
  ];

  const acceptedSortOrderKey = [
    "ASC",
    "DESC"
  ]

  if (sortingKey != undefined) {
    if (acceptedSortByKey.includes(sortingKey) === false) {
      return Promise.reject({ msg: "invalid Sort_by", status: 404 });
    }
    sortBy = sortingKey;
  }
  if (order != undefined) {
    if (acceptedSortOrderKey.includes(order) === false) {
      return Promise.reject({ msg: "invalid Sort_by", status: 404 });
    } 
    sortingOrder = order;
  }

  const query = format(
    `SELECT articles.author AS author,articles.title AS title,articles.article_id AS article_id,articles.topic AS topic,articles.created_at AS created_at,articles.votes AS votes,articles.article_img_url AS article_img_url, t2.count_comment AS comment_count FROM articles LEFT JOIN (SELECT article_id, COUNT(*) AS count_comment FROM comments GROUP BY article_id) AS t2 ON articles.article_id = t2.article_id ${topicQuery} ORDER BY ${sortBy} ${sortingOrder};`
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

  if (typeof commentBody !== "string") {
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
  const query = "SELECT username,name,avatar_url FROM users";
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
      newVote,
      articleId
    );200
    return db.query(query).then((data) => {
      return data.rows;
    });
  }
};

exports.fetchComments = () => {
  const query = "SELECT * FROM comments;";
  return db.query(query).then((data) => {
    return data.rows;
  });
};

exports.validateCommentId = async (commentId) => {
  commentId = Number(commentId);
  const allComments = await this.fetchComments();
  const validCommentsId = allComments.map(({ comment_id }) => {
    return comment_id;
  });
  if (Number.isInteger(commentId) === false) {
    return Promise.reject({ msg: "invalid input" });
  } else if (!validCommentsId.includes(commentId)) {
    return Promise.reject({ msg: "Non-existent id" });
  } else {
    return commentId;
  }
};

exports.deleteCommentModel = (commentId) => {
  const query = format(`DELETE FROM comments WHERE comment_id = %L`, commentId);
  return db.query(query).then((data) => {
    return data.rows;
  });
};


exports.fetchUsername = (username,allUser) => {
const allUserArray = allUser.map(({username}) => {return username})
  if (!(allUserArray.includes(username))){
    return Promise.reject({msg: "Non-existent username"})
  }
  
  const query = format(`SELECT * FROM users WHERE username = %L`, username)
  return db.query(query).then((data)=> { 
    return data.rows;
  })
}