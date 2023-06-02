const express = require('express');
const {
  createUser,
  getAllUsers,
  searchByInterest,
  searchByUserName,
  editProfile,
  addRemoveFriend,
  matchUserWithinRange,
  getUser,
  setLocation,
  getUserFriends,
  sendRequest,
  acceptRequest,
  cancelRequest,
  removeFriend,
  searchByEmail,
  acceptInvitation,
} = require('../controllers/userController');
const router = express.Router();

router
  .route('/users-within/:distance/center/:latlng/unit/:unit')
  .get(matchUserWithinRange);
router.route('/').post(createUser).get(getAllUsers);
router.route('/:id').get(getUser);
router.route('/interests').get(searchByInterest);
router.route('/setlocation/:id').patch(setLocation);
router.route('/editprofile/:id').patch(editProfile);
router.route('/:username').get(searchByUserName);
router.route('/:email').get(searchByEmail);
// router.patch('/:id/:friendId', addRemoveFriend);
router.route('/sendrequest/:id/:friendId').patch(sendRequest);
router.route('/acceptrequest/:id/:friendId').patch(acceptRequest);
router.route('/cancelrequest/:id/:friendId').patch(cancelRequest);
router.route('/removefriend/:id/:friendId').patch(removeFriend);
router.route('/getuserfriends/:id').get(getUserFriends);
router.route('/acceptinvitation/:groupId/:userId').post(acceptInvitation);

module.exports = router;
