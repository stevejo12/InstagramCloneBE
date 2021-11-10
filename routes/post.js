import express from 'express';
import { findUserIdentificationInPosts } from '../helper/user.js';
import postSchema  from '../schema/post.js';

const router = express.Router();

router.post("/new", (req,res) => {
  const reqData = new postSchema({
    user_id: req.body.userID,
    caption: req.body.caption,
    uri: req.body.uri
  })

  postSchema.create(reqData, (err, data) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(201).json({
        message: "Post successfully uploaded"
      })
    }
  })
})

// temporary get all posts
// later will be used as explore for random

// NOTE TO CONTINUE: CHANGE USER_ID to avatar & username data
router.get("/allPosts", (req, res) => {
  let refactoredPostsData = [];
  let data;
  postSchema.find().exec((err, posts) => {
    if (Array.isArray(posts)) {
      const requests = posts.map(post => {
        findUserIdentificationInPosts(post.user_id)
          .then((result) => {
            data = Object.assign({}, post.toJSON(), { user_id: result });
          })
          .catch((err) =>{
            console.log('error post: ', err);
          })
          .finally(() => {
            console.log('finish promise', data);
            return refactoredPostsData.push(data);
          })
      })

      // find alternative to resolve this
      // promise.all doesn't finish the map before returning the "res"
      setTimeout(() => {
        Promise.all(requests).then(() => {
          res.status(200).send({
            data: refactoredPostsData,
            message: "Retrieving Posts successful"
          });
        }).catch(() => {
          res.status(500).send({
            data: refactoredPostsData,
            message: "Retrieving Posts failed"
          })
        })
      }, 500);

      
    }
  })
})

export default router;