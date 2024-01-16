const {
  fetchTopics,
  fetchApiInformation,
  fetchArticleWithCorrectId,
} = require("./model");

exports.getTopics = async (req, res) => {
  try {
    const topic = await fetchTopics();
    res.status("200").send({ topic });
  } catch (err) {
    (err) => {
      console.log(err);
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

exports.getArticleWithID = async (req, res,next) => {
  try {
    const { articleId } = req.params;
    const article = await fetchArticleWithCorrectId(articleId);
    res.status("200").send({ article });
  } catch (err) {
    return next(err);
  }
};
