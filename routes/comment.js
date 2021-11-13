import express from 'express';
import { isEmpty } from '../helper/checkers.js';
import { findUserIdentification } from '../helper/user.js';
import commentSchema from '../schema/comment.js';

const router = express.Router();

router.post("/new/:postId", (req, res) => {
  const reqData = new commentSchema({
    post_id: req.params.postId,
    user_id: req.body.user_id,
    comment: req.body.comment
  })

  commentSchema.create(reqData, (err, data) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(201).json({
        message: "Comment successfully posted"
      })
    }
  })
})

// get all the comments
router.get("/:postId", (req, res) => {
  const postId = req.params.postId;
  const refactoredCommentData = [];
  let oneComment;

  commentSchema.find({ post_id: postId}).exec((err, data) => {
    if (err) {
      res.status(500).send(err);
      return;
    } 

    if (isEmpty(data)) {
      res.status(200).send({
        data: data,
        message: "Successful retrieving comments"
      })
    } else {
      const requests = data.map(comment => {
        findUserIdentification(comment.user_id)
          .then((result) => {
            oneComment = Object.assign({}, comment.toJSON(), { user_id: result });
          })
          .catch((err) =>{
            console.log('error post: ', err);
          })
          .finally(() => {
            return refactoredCommentData.push(oneComment);
          })
      })

      setTimeout(() => {
        Promise.all(requests).then(() => {
          res.status(200).send({
            data: refactoredCommentData,
            message: "Retrieving Comments successful"
          });
        }).catch(() => {
          res.status(500).send({
            data: refactoredCommentData,
            message: "Retrieving Comments failed"
          })
        })
      }, 500);
    }
  })
})

export default router;