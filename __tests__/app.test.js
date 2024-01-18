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

describe("GET /api/articles/:article_id", () => {
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
        expect(response.body.msg).toBe("Bad Request: ID provided is not valid");
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
              comment_count: expect.any(String),
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
        expect(body.article).toBeSorted({
          key: "created_at",
          descending: true,
        });
      });
  });
  test("If specified a sortby optional parameter, will return object that is ordered by sorted by optional parameter, in asending order", () => {
    const sortingKey = "author";
    return request(app)
      .get(`/api/articles?sort_by=${sortingKey}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toBeSorted({ key: sortingKey, descending: true });
      });
  });

  test("should return 404 badRequest if sort_by parameter is invalid", () => {
    const sortingKey = "invalid";
    return request(app)
      .get(`/api/articles?sort_by='invalid'`)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe(
          "Bad Request: sorting key provided is invalid."
        );
      });
  });
});

describe("GET /api/articles/:articleid/comments", () => {
  test("should return 200", () => {
    return request(app).get("/api/articles/1/comments").expect(200);
  });
  test("should return an array of object that all the comments of the given article ", () => {
    const articleId = 1;
    const count = commentData.reduce((counter, obj) => {
      if (obj.article_id === articleId) counter += 1;
      return counter;
    }, 0);
    return request(app)
      .get(`/api/articles/${articleId}/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toEqual(count);
      });
  });
  test("should return an array of object for the expected article id, each with the following keys: title, article_idtopic, author,created_at,votes,image_img_url,comment_count  ", () => {
    return request(app)
      .get(`/api/articles/1/comments`)
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: 1,
            }),
          ])
        );
      });
  });
  test("should return an array of objects, sorted by created_at date by default where the most recent is on top ", () => {
    return request(app)
      .get(`/api/articles/1/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSorted({
          key: "created_at",
          descending: true,
        });
      });
  });

  test("should return  400 Not Found if provided id is invalid", () => {
    return request(app)
      .get(`/api/articles/notanumber/comments`)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request: ID provided is not valid");
      });
  });
  test("should return  404 badRequest if provided id is non existent", () => {
    return request(app)
      .get(`/api/articles/9999/comments`)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe(
          "Bad Request: ID provided has not been found."
        );
      });
  });
  test("should return enpty array if the id provided  does not havea any comments", () => {
    return request(app)
      .get(`/api/articles/2/comments`)
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toEqual([]);
      });
  });
});

describe("POST /api/articles/:articleid/comments", () => {
  test("should return 200", () => {
    const payload = {
      username: "lurker",
      body: "this is a comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(payload)
      .expect(200);
  });
  test("should update the comments table with the newest comment if all input ar valid.", () => {
    const articleId = 1;
    const count =
      commentData.reduce((counter, obj) => {
        if (obj.article_id === articleId) counter += 1;
        return counter;
      }, 0) + 1;
    const payload = {
      username: "lurker",
      body: "this is a comment",
    };
    return request(app)
      .post(`/api/articles/${articleId}/comments`)
      .expect(200)
      .send(payload)
      .then(({ body }) => {
        return request(app)
          .get(`/api/articles/${articleId}/comments`)
          .expect(200)
          .then(({ body }) => {
            return expect(body.comments.length).toEqual(count);
          });
      });
  });
  test("should return an array of object for the newest comment inserted associated with the article, with the following keys: title, article_idtopic, author,created_at,votes,image_img_url,comment_count  ", () => {
    const articleId = 1;
    const payload = {
      username: "lurker",
      body: "this is a comment",
    };
    return request(app)
      .post(`/api/articles/${articleId}/comments`)
      .send(payload)
      .expect(200)
      .then((response) => {
        expect(response.body.newComment).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: articleId,
            }),
          ])
        );
      });
  });

  test("should return  400 badRequest if provided article id is invalid", () => {
    const payload = {
      username: "lurker",
      body: "this is a comment",
    };
    return request(app)
      .post(`/api/articles/notANumber/comments`)
      .send(payload)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request: ID provided is not valid");
      });
  });
  test("should return  404 badRequest if provided article id is non existent", () => {
    const articleId = 9999;
    const payload = {
      username: "lurker",
      body: "this is a comment",
    };
    return request(app)
      .post(`/api/articles/9999/comments`)
      .send(payload)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe(
          "Bad Request: ID provided has not been found."
        );
      });
  });
  test("should return  400 badRequest if provided payload (username or commentbdoy) is invalid", () => {
    const payload = {
      body: "this is a comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(payload)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request: ID provided is not valid");
      });
  });
  test("should return 404 badRequest if provided username is non existent", () => {
    const payload = {
      username: "non-existent",
      body: "this is a comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(payload)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe(
          "Bad Request: Parameter(s) provided has not been found."
        );
      });
  });
});

describe("PATCH /api/articles/:articleid", () => {
  test("should return 200", () => {
    const payload = { inc_votes: 1 };
    return request(app).patch("/api/articles/1").send(payload).expect(200);
  });
  test("should update annd retun the  article specified with the article with the correct vote if all input ar valid, and new vote is a positive number.", () => {
    const articleId = 1;
    const payload = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(payload)
      .expect(200)
      .then((response) => {
        expect(response.body.article).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: articleId,
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
            }),
          ])
        );
      });
  });
  test("should update annd retun the  article specified with the correct vote if all new votes is negative.", () => {
    const articleId = 1;
    const payload = { inc_votes: -100 };
    return request(app)
      .patch("/api/articles/1")
      .send(payload)
      .expect(200)
      .then((response) => {
        expect(response.body.article).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: articleId,
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
            }),
          ])
        );
      });
  });

  test("should return  400 badRequest if provided article id is invalid", () => {
    const payload = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/invalid")
      .send(payload)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request: ID provided is not valid");
      });
  });
  test("should return  404 badRequest if provided article id is non existent", () => {
    const articleId = 9999;
    const payload = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/9999")
      .send(payload)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe(
          "Bad Request: ID provided has not been found."
        );
      });
  });
  test("should return  400 badRequest if provided payloadis invalid", () => {
    const payload = { inc_votes: "notanumber" };
    return request(app)
      .patch("/api/articles/1")
      .send(payload)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request: ID provided is not valid");
      });
  });
});

describe("DELETE api/comments/:comment_id", () => {
  test("should return 200", () => {
    return request(app).delete("/api/comments/1")
      .expect(204)
  });
  test("should delete the comment of the associated comment id", () => {
    const articleId = 9;
    const count = commentData.reduce((counter, obj) => {
      if (obj.article_id === articleId) counter += 1;
      return counter;
    }, 0);
    return request(app).delete("/api/comments/1")
      .expect(204)
      .then(() => {
        return request(app)
          .get(`/api/articles/${articleId}/comments`)
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).toEqual(count-1);
          });
      });
  });
  test("should return an empty object  ", () => {
    return request(app).delete("/api/comments/1")
      .expect(204)
      .then((response) => {
        expect(response.body).toEqual({});
      });
  });

  test("should return  400 Not Found if provided id is invalid", () => {
    return request(app).delete("/api/comments/notanumber")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request: ID provided is not valid");
      });
  });
  test("should return  404 badRequest if provided id is non existent", () => {
    return request(app).delete("/api/comments/9999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe(
          "Bad Request: ID provided has not been found."
        );
      });
  });
});


describe("GET /api/users", () => {
  test("should return 200", () => {
    return request(app).get("/api/users").expect(200);
  });
  test("should return an array of objects with all userss in the database. ", () => {
    const numOfUser = userData.length;
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response.body.users.length).toEqual(numOfUser);
      });
  });
  test("should return an array of objects, each with the following keys: username, name, avatar_url ", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response.body.users).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            }),
          ])
        );
      });
  });
})

describe("GET /api/articles ADDITIONAL FEATURE - Filer by topic", () => {
  test("should return 200", () => {
    return request(app).get("/api/articles").expect(200);
  });
  test("should return an array of objects, each with the following keys: title, article_idtopic, author,created_at,votes,image_img_url,comment_count  ", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then((response) => {
        expect(response.body.article).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: "mitch",
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(String),
            }),
          ])
        );
      });
  });
  test("should return 404 Bad Request if topic parameter is non-existent", () => {
    return request(app)
      .get(`/api/articles?topic=hello`)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe(
          "Bad Request: ID provided has not been found."
        );
      });
  });
});

describe("GET /api/articles/:articleid ADDITIONAL FEATURE - Filer by topic", () => {
  test("should return 200", () => {
    return request(app).get("/api/articles/1").expect(200);
  });
  test("should return an array of objects, each with the following keys: title, article_idtopic, author,created_at,votes,image_img_url,comment_count ", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body.article).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: 1,
              article_img_url: expect.any(String),
              title: expect.any(String),
              topic: expect.any(String),
              comment_count: expect.any(String)
            }),
          ])
        );
      });
  });
})