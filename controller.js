const {
  fetchTopics,
  fetchApiInformation,
  fetchArticleWithCorrectId,
  fetchArticles,
  fetchArticleComment,
  addNewComment,
  fetchAllUsers,
  validateArticleId,
  updateArticleVote,
  validateCommentId,
  deleteCommentModel,
} = require("./model");

exports.getTopics = async (req, res) => {
  try {
    const topic = await fetchTopics();
    res.status("200").send({ topic });
  } catch (err) {
    (err) => {
      return next(err);
    };
  }
};

exports.invalidPath = (req, res) => {
  res.status(404).send({ msg: "invalid endpoint" });
};

exports.getApiInfo = async (req, res) => {
  try {
    const apiInformation = fetchApiInformation();
    res.status("200").send({ apiInfo: apiInformation });
  } catch {
    return next(err);
  }
};

exports.getArticleWithID = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const validatedId = await validateArticleId(articleId);
    const article = await fetchArticleWithCorrectId(validatedId);
    res.status("200").send({ article });
  } catch (err) {
    return next(err);
  }
};

exports.getAllArticles = async (req, res, next) => {
  try {
    const { topic, sort_by } = req.query;
    const allArticles = await fetchArticles(sort_by,topic);
    res.status("200").send({ article: allArticles });
  } catch (err) {
    return next(err);
  }
};

exports.getArticleComments = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const validatedId = await validateArticleId(articleId);
    const associatedComments = await fetchArticleComment(validatedId);
    res.status("200").send({ comments: associatedComments });
  } catch (err) {
    return next(err);
  }
};

exports.addArticleComment = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const { username, body } = req.body;
    const allUsers = await fetchAllUsers();
    // const validatedId = await validateArticleId(articleId);
    const newComment = await addNewComment(
      articleId,
      username,
      body,
      allUsers
    );
    res.status("201").send({ newComment });
  } catch (err) {
    console.log(err)
    return next(err);
  }
};

exports.updateArticle = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const { inc_votes } = req.body;
    const validatedArticleId = await validateArticleId(articleId);
    const modifiedArticle = await updateArticleVote(
      validatedArticleId,
      inc_votes
    );
    res.status("200").send({ article: modifiedArticle });
  } catch (err) {
    return next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    const validatedCommentId = await validateCommentId(comment_id);
    const deleteComment = await deleteCommentModel(validatedCommentId);
    res.sendStatus("204");
  } catch (err) {
    return next(err);
  }
};

exports.getAllUsers = async (req,res,next) => {
  try{ 
    const allAvailableUsers = await fetchAllUsers(); 
    res.status("200").send({users: allAvailableUsers})

  } catch (err) {
    return next(err);
  }
}