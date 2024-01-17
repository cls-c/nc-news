const {
  fetchTopics,
  fetchApiInformation,
  fetchArticleWithCorrectId,
  fetchArticles,
  fetchArticleComment,
  addNewComment,
  fetchAllUsers,
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
    const article = await fetchArticleWithCorrectId(articleId);
    res.status("200").send({ article });
  } catch (err) {
    return next(err);
  }
};

exports.getAllArticles = async (req, res, next) => {
  try {
    const { sort_by } = req.query;
    const allArticles = await fetchArticles(sort_by);
    res.status("200").send({ article: allArticles });
  } catch (err) {
    return next(err);
  }
};

exports.getArticleComments = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const associatedComments = await fetchArticleComment(articleId);
    res.status("200").send({ comments: associatedComments });
  } catch (err) {
    return next(err);
  }
};

exports.updateArticleComment = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const { username, body } = req.body;
    const allUsers = await fetchAllUsers();
    const newComment = await addNewComment(articleId, username, body, allUsers);
    res.status("200").send({ newComment });
  } catch (err) {
    return next(err);
  }
};
