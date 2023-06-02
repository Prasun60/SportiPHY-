const User = require('../models/userModel');
const Group = require('../models/groupModal');

const filterInterest = (req) => {
  let typeArray, interestObject;

  if (req.query.type.includes(',')) {
    typeArray = req.query.type.split(',');
    interestObject = {
      $in: typeArray,
    };
  } else if (req.query.type.includes('$')) {
    typeArray = req.query.type.split('$');
    interestObject = {
      $all: typeArray,
    };
  } else interestObject = req.query.type;

  return interestObject;
};

exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.editProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.find({ _id: req.params.id });
    console.log(user[0]);
    if (!user) {
      res.status(200).json({
        message: 'No user found',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.setLocation = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $set: {
          location: {
            type: 'Point',
            coordinates: [req.body.longitude, req.body.latitude],
          },
        },
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.searchByInterest = async (req, res, next) => {
  try {
    const users = await User.find({ interest: filterInterest(req) });

    if (!users.length) {
      res.status(200).json({
        message: 'No user found!',
      });
      return;
    }

    res.status(200).json({
      result: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.searchByUserName = async (req, res, next) => {
  try {
    const { username } = req.params;
    console.log(username);

    const users = await User.find({ userName: username });

    if (!users.length) {
      res.status(200).json({
        message: 'No user found!',
      });
      return;
    }

    res.status(200).json({
      result: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.searchByEmail = async (req, res, next) => {
  try {
    const { email } = req.params;
    const users = await User.find({ email: email });

    if (!users.length) {
      res.status(200).json({
        message: 'No user found!',
      });
      return;
    }

    res.status(200).json({
      result: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Friends
exports.sendRequest = async (req, res, next) => {
  try {
    const { id, friendId } = req.params;
    const response = await User.findByIdAndUpdate(
      id,
      {
        $push: {
          sentRequests: friendId,
        },
      },
      {
        new: true,
      }
    );
    const oppositeUser = await User.findByIdAndUpdate(
      friendId,
      {
        $push: {
          getRequests: id,
        },
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      status: 'success',
      data: {
        response,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};
exports.acceptRequest = async (req, res, next) => {
  try {
    const { id, friendId } = req.params;
    const response = await User.findByIdAndUpdate(
      id,
      {
        $pull: {
          getRequests: friendId,
        },
        $push: {
          friends: friendId,
        },
      },
      {
        new: true,
      }
    );
    const friendResponse = await User.findByIdAndUpdate(
      friendId,
      {
        $pull: {
          sentRequests: id,
        },
        $push: {
          friends: id,
        },
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      status: 'success',
      data: {
        response,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};
exports.cancelRequest = async (req, res, next) => {
  try {
    const { id, friendId } = req.params;
    const response = await User.findByIdAndUpdate(
      id,
      {
        $pull: {
          sentRequests: friendId,
        },
      },
      {
        new: true,
      }
    );
    const friendRes = await User.findByIdAndUpdate(
      friendId,
      {
        $pull: {
          getRequests: id,
        },
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      status: 'success',
      data: {
        response,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};
exports.removeFriend = async (req, res, next) => {
  try {
    const { id, friendId } = req.params;
    const response = await User.findByIdAndUpdate(
      id,
      {
        $pull: {
          friends: friendId,
        },
      },
      {
        new: true,
      }
    );
    const friendRes = await User.findByIdAndUpdate(
      friendId,
      {
        $pull: {
          friends: id,
        },
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      status: 'success',
      data: {
        response,
      },
    });
  } catch (err) {
    es.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.addRemoveFriend = async (req, res, next) => {
  try {
    const { id, friendId } = req.params;
    let frnd = true;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
      frnd = false;
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
      frnd = true;
    }
    await user.save();
    await friend.save();
    const msg = frnd
      ? 'Friends added successfully'
      : 'Friends Removed Succesfully';

    res.status(200).json({ msg });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};
exports.getUserFriends = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const friendIds = user.friends;
    const friends = await User.find({ _id: { $in: friendIds } });
    res.status(200).json({
      status: 'success',
      data: {
        friends,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.matchUserWithinRange = async (req, res) => {
  try {
    const { distance, latlng, unit } = req.params;
    const [latitude, longitude] = latlng.split(',');
    const type = req.query.type;

    let radius;
    if (unit === 'mi') radius = distance / 3963.2;
    else if (unit === 'km') radius = distance / 6378.1;

    let queryObject = {
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radius],
        },
      },
    };

    if (type)
      queryObject = Object.assign(
        { interest: filterInterest(req) },
        queryObject
      );

    const users = await User.find(queryObject);

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.acceptInvitation = async (req, res) => {
  try {
    const { groupId, userId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        status: 'fail',
        message: 'Group not found',
      });
    }

    if (!group.invitations.includes(userId)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invitation not found',
      });
    }

    // Remove the userId from invitations array
    group.invitations = group.invitations.filter(
      (invitedId) => invitedId !== userId
    );

    // Add userId to players array
    group.players.push(userId);

    await group.save();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    // Remove the groupId from invitations array
    user.invitations = user.invitations.filter(
      (invitedGroupId) => invitedGroupId !== groupId
    );

    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Invitation accepted!',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
