const request = require("supertest");
const db = require("../db/connection.js");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index.js");
const apiData = require("../endpoints.json");
const seed = require("../db/seeds/seed.js");
const app = require("../app.js");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed({ articleData, commentData, topicData, userData });
});

describe("GET /api/topics", () => {
  test("should return 200", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("should return an array of topic objects,each of which including slug and description ", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topic).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            }),
          ])
        );
      });
  });
  test("when invalid path, should return 404 message and error message to say invalid path. ", () => {
    return request(app)
      .get("/api/topicss")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("invalid endpoint");
      });
  });
  test("test all topics in the test file are returned as part of the response by testing  if both of the array length equals ", () => {
    const numOfArrayExpected = topicData.length;
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topic.length).toEqual(numOfArrayExpected);
      });
  });
});

describe("GET /api", () => {
  test("should return 200", () => {
    return request(app).get("/api").expect(200);
  });
  test("should return an object, referenced from endpoints.json", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body.apiInfo).toEqual(apiData);
      });
  });
});

describe.only("GET /api/articles/:article_id", () => {
  test("should return an object, with the following keys: title, article_idtopic, author,body,created_at,votes,image_img_url  ", () => {
    const articleId = 2;
    return request(app)
      .get(`/api/articles/${articleId}`)
      .expect(200)
      .then((response) => {
        expect(response.body.article).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: articleId,
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
            }),
          ])
        );
      });
  });
  test("should return  400 badRequest if provided id is invalid", () => {
    const articleId = "invalid";
    return request(app)
      .get(`/api/articles/${articleId}`)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe(
          'Bad Request: ID provided is not valid'
        );
      });
  });
  test("should return  404 badRequest if provided id is non existent", () => {
    const articleId = 9999;
    return request(app)
      .get(`/api/articles/${articleId}`)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe(
          "Bad Request: ID provided has not been found."
        );
      });
  });
});

describe("GET /api/articles", () => {
  test("should return 200", () => {
    return request(app).get("/api/articles").expect(200);
  });
  test("should return an array of objects of all articles in the database. ", () => {
    const numOfArrayExpected = articleData.length;
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.article.length).toEqual(numOfArrayExpected);
      });
  });
  test("should return an array of objects, each with the following keys: title, article_idtopic, author,created_at,votes,image_img_url,comment_count  ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.article).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            }),
          ])
        );
      });
  });
  test("should return an array of objects, sorted by created_at date by default  ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toBeSorted({ key: "created_at" });
      });
  });
  test("If specified a sortby optional parameter, will return object that is ordered by sorted by optional parameter, in asending order", () => {
    const sortingKey = "author";
    return request(app)
      .get(`/api/articles?sort_by=${sortingKey}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toBeSorted({ key: sortingKey });
      });
  });

  test("should return  404 badRequest if sort_by parameter is invalid", () => {
    const sortingKey = "invalid";
    return request(app)
      .get(`/api/articles?sort_by=${sortingKey}`)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe(
          "Bad Request: sorting key provided is invalid."
        );
      });
  });
});
