const express = require("express");
const {
  getTopics,
  invalidPath,
  getApiInfo,
  getArticleWithID,
  getAllArticles,
  getArticleComments,
  addArticleComment,
  updateArticle,
  deleteComment,
  getAllUsers,
} = require("./controller");
const app = express();
app.use(express.json());

const {router, articleRouter} = require('./router')
app.use('/api',router)
app.use('/api/articles',articleRouter)

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
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request: invalid type provided." });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "23502") {
    res.status(400).send({ msg: "Bad Request: missing payload value." });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "42703" || err.code === "23503") {
    res
      .status(404)
      .send({
        msg: "Bad Request: Parameter(s) i.e. ID provided has not been found.",
      });
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
  if (err.msg === "Non-existent username") {
    res
      .status(404)
      .send({ msg: "Bad Request: Username provided has not been found." });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Unexpected Error - Bad code in server." });
});

module.exports = app;
