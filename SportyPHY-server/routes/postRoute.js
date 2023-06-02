const express = require('express');
const router = express.Router();
const {
  addPost,
  editPost,
  getAllPosts,
  getUserposts,
  getfriendsPosts,
  deletePost,
} = require('../controllers/postController');
const upload = require('../utils/multerConfig');

router.post('/', upload.single('image'), addPost);
router.put('/editpost/:id', editPost);
router.get('/', getAllPosts);
router.get('/:id', getUserposts);
router.get('/friendposts/:id', getfriendsPosts);
router.delete('/:id', deletePost);

module.exports = router;
