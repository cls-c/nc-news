const express = require("express");
const {
  getTopics,
  invalidPath,
  getApiInfo,
  getArticleWithID,
  getAllArticles,
  getArticleComments,
  updateArticleComment,
} = require("./controller");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getApiInfo);
app.get("/api/articles/:articleId", getArticleWithID);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:articleId/comments", getArticleComments);
app.post("/api/articles/:articleId/comments",updateArticleComment);


app.all("*", invalidPath);

app.use((err, req, res, next) => {
  if (err.msg === "invalid input") {
    res.status(400).send({ msg: "Bad Request: ID provided is not valid" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.msg === "Non-existent id") {
    res
      .status(404)
      .send({ msg: "Bad Request: ID provided has not been found." });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "42703") {
    res
      .status(404)
      .send({ msg: "Bad Request: ID provided has not been found." });
  } else {
    next(err);
  }
});


app.use((err, req, res, next) => {
    if (err.code === "23503") {
        res
        .status(404)
        .send({ msg: "Bad Request: ID provided has not been found." });
    } else {
      next(err);
    }
  });





app.use((err, req, res, next) => {
  if (err.msg === "invalid Sort_by") {
    res
      .status(404)
      .send({ msg: "Bad Request: sorting key provided is invalid." });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Unexpected Error - Bad code in server." });
});

module.exports = app;
