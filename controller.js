const { fetchTopics } = require("./model");

exports.getTopics = async (req, res) => {
  try {
    const topic = await fetchTopics();
    res.status("200").send({topic});
  } catch (err){
    (err) => {
      console.log(err);
    };
  }
};
