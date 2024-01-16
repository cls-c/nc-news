const express = require("express");
const { getTopics, invalidPath, getApiInfo, getArticleWithID, getAllArticles } = require("./controller");
const app = express();

app.get("/api/topics", getTopics);
app.get("/api",getApiInfo);
app.get("/api/articles/:articleId", getArticleWithID)

app.get("/api/articles", getAllArticles)
app.all("*", invalidPath);

app.use((err,req,res,next)=>{
    if (err.msg === 'invalid input'){
      res.status(400).send({msg:'Bad Request: ID provided is not valid'})
    }
    else {
      next(err);
    }
  })

  app.use((err,req,res,next)=>{
    if (err.msg === 'Non-existent id'){
      res.status(404).send({msg:'Bad Request: ID provided has not been found.'})
    }
    else {
      next(err);
    }
  })

app.use((err,req,res,next)=>{
    if (err.code === '42703'){
      res.status(404).send({msg:'Bad Request: ID provided has not been found.'})
    }
    // else {
    //   next(err);
    // }
  })


module.exports = app;
