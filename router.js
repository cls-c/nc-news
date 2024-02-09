const express = require('express')
const { getAllUsers, getAllArticles, updateArticle, getArticleWithID, getApiInfo, getTopics, getArticleComments, addArticleComment, deleteComment, getUsername, patchComment } = require('./controller')
const router = express.Router()

// middleware that is specific to this router
router.use((req, res, next) => {
  next()
})
router.get('/',getApiInfo )
router.delete("/comments/:comment_id", deleteComment);
router.get('/users', getAllUsers)
router.get('/users/:username',getUsername)
router.patch('/comments/:comment_id',patchComment)
router.get('/topics', getTopics)

const articleRouter = express.Router()
articleRouter.use((req,res,next)=> {
    next()
})
articleRouter.get('/', getAllArticles)
articleRouter.get('/:articleId', getArticleWithID)
articleRouter.patch('/:articleId',updateArticle)
articleRouter.get('/:articleId/comments', getArticleComments)
articleRouter.post('/:articleId/comments', addArticleComment)

module.exports = {router, articleRouter}
