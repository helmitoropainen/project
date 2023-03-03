var express = require('express');
var router = express.Router();
const Post = require("../models/Posts")
const User = require("../models/Posts")
var validateToken = require("../auth/validateToken")
const { Buffer } = require('buffer')

/* Get all root posts */
router.get('/post/list', async function(req, res, next) {
  try {
    let posts = await Post.find({parentPost: null})
    res.json(posts)
  } catch (e) { throw e }
});

/* Get post and comments */
router.get('/post/:id', async function(req, res, next) {
  const id = req.params.id
  try {
    let root = await Post.findById(id)
    try {
      let comments = await Post.find({parentPost: root._id})
      let data = ({
        root: root,
        comments: comments
      })
      res.json(data)
    } catch (e) { throw e }
  } catch (e) { throw e }
});

/* Get just post */
router.get('/content/post/:id', async function (req, res, next) {
  console.log("get content")
  const id = req.params.id
  try {
    let post = await Post.findById(id)
    res.json(post)
  } catch (e) { console.log(e) }
})

/* New post */
router.post("/post", validateToken, function(req, res, next) {
  let token = req.cookies["token"]
  let userID = JSON.parse(Buffer.from(token.split(".")[1], "base64")).id
  Post.create({
    user: userID,
    title: req.body.title,
    content: req.body.content,
    parentPost: req.body.parentPost,
  })
  res.status(200)
  res.json({message: "Post created"})
})

/* Edit post */
router.post("/edit", validateToken, async function (req, res, next) {
   try { 
    let post = await Post.findByIdAndUpdate(req.body.post, req.body.edit, {new: true})
    if(post) {
        res.json({success: true})
    } else {
        res.json({success: false})
    }
  } catch (e) { throw e }
})

/* Vote */
router.post("/vote", validateToken, async function (req, res, next) {
  let token = req.cookies["token"]
  let userID = JSON.parse(Buffer.from(token.split(".")[1], "base64")).id
  let postID = req.body.post
  let voteValue = req.body.vote
  let vote = { user: userID, vote: voteValue }

  try {
    let post = await Post.findOneAndUpdate({_id: postID, "votes.user": userID}, { $set: { 'votes.$': vote } }, {new: true}) 
    if (post) {
      console.log("old", post)
      res.status(200)
      res.json({post: post})
    } else {
      let post = await Post.findByIdAndUpdate(postID, { $push: { votes: vote }}, {new: true})
      if(post) {
        console.log("new", post)
        res.status(200)
        res.json({post: post})
      } else {
        console.log("nothing")
        res.status(404)
        res.json({success: false})
      }
    }
  } catch (e) { throw e }
})

module.exports = router;
