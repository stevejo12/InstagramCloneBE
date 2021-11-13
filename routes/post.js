import express from 'express';
import cloudinaryConfig from '../utils/cloudinary.js';
import { findUserIdentificationInPosts } from '../helper/user.js';
import postSchema  from '../schema/post.js';

const router = express.Router();

router.post("/new", async (req,res) => {
  try {
    const image = req.body.photo;
  
    const uploadedResponse = await cloudinaryConfig.uploader.upload(image, {
      upload_preset: 'instagram_clone',
      type: 'upload',
      eager: [{
        width: 614,
        height: 614,
        crop: "fit"
      }]
    })

    // get image url
    let imageURL;
    if (Array.isArray(uploadedResponse.eager)) {
      imageURL = uploadedResponse.eager[0].secure_url || uploadedResponse.secure_url
    } else {
      imageURL = uploadedResponse.secure_url
    }

    const data = {
      user_id: req.body.user_id,
      caption: req.body.caption,
      uri: imageURL
    }

    postSchema.create(data, (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).json({
          message: "Post successfully uploaded"
        })
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ err: "Something went wrong" })
  }
})

// temporary get all posts
// later will be used as explore for random

// NOTE TO CONTINUE: CHANGE USER_ID to avatar & username data
router.get("/allPosts", (req, res) => {
  let refactoredPostsData = [];
  let data;
  postSchema.find().sort({createdAt: 'desc'}).exec((err, posts) => {
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