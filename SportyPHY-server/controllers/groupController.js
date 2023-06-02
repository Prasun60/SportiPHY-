const Group = require('../models/groupModal');
const User = require('../models/userModel');
const cloudinary = require('../utils/cloudinaryConfig');

exports.createGroup = async (req, res) => {
  console.log(req.body);
  try {
    console.log('Hi');
    const image = await cloudinary.uploader.upload(req.file.path);
    console.log(image);
    const group = await Group.create({
      ...req.body,
      image: image.secure_url,
      cloudinary_id: image.public_id,
    });
    console.log(group);
    res.status(201).json({
      status: 'success',
      data: {
        group,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find();

    res.status(200).json({
      status: 'success',
      results: groups.length,
      data: {
        groups,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getGroupAllMembers = async (req, res) => {
  try {
    const roomId = req.params.id;
    const group = await Group.findById(roomId);
    const userIds = group.players;
    const users = await User.find({ _id: { $in: userIds } });
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    console.log(group);
    if (!group) {
      return res.status(404).json({
        status: 'fail',
        message: 'No group found with that ID',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        group,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getSpecificGroup = async (req, res) => {
  try {
    const groups = await Group.find({ type: req.params.type });

    res.status(200).json({
      status: 'success',
      results: groups.length,
      data: {
        groups,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getGroupByInvitationLink = async (req, res) => {
  try {
    const group = await Group.find({
      invitationLink: req.params.invitationLink,
    });

    if (!group) {
      return res.status(404).json({
        status: 'fail',
        message: 'No group found with that link',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        group,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.addUserToGroup = async (req, res) => {
  try {
    const group = await Group.find({
      invitationLink: req.params.invitationLink,
    });
    const user = await User.find({ _id: req.params.id });

    if (!group.length || !user.length) {
      return res.status(404).json({
        status: 'fail',
        message: 'No group or user found with that ID',
      });
    }

    if (group[0].players.includes(req.params.id)) {
      return res.status(400).json({
        status: 'fail',
        message: 'User already in group',
      });
    }

    group[0].players.push(req.params.id);
    await group[0].save();

    res.status(201).json({
      status: 'success',
      data: {
        group,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.playMatch = async (req, res) => {
  //change the status of the group to playing
  try {
    const { id } = req.params;
    const group = await Group.findByIdAndUpdate(
      id,
      { status: 'open' },
      {
        $new: true,
      }
    );
    res.status(200).json({
      status: 'success',
      data: {
        group,
      },
    });
  } catch (err) {
    es.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.findmatch = async (req, res) => {
  try {
    const { id } = req.params;
    const requestingRoom = await Group.findById(id);
    const requestUser = await User.find({ email: requestingRoom.creator });
    const groups = await Group.find({
      type: requestingRoom.type,
      status: 'open',
      creator: { $ne: requestingRoom.creator },
    });
    // if no groups found
    res.status(200).json({
      status: 'success',
      data: {
        group,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.joinGroup = async (req, res, next) => {
  try {
    const { userId, roomId } = req.params;
    const joinGroup = await Group.findById(roomId);
    console.log(joinGroup);
    joinGroup.players.push(userId);
    joinGroup.save();

    res.status(200).json({
      status: 'success',
      data: {
        joinGroup,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.deleteGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteGroup = await Group.findByIdAndDelete(id);
    res.status(200).json({
      status: 'success',
      data: {
        deleteGroup,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.leaveGroup = async (req, res, next) => {
  try {
    const { id, userId } = req.params;
    const updatedGroup = await Group.findByIdAndUpdate(
      id,
      { $pull: { players: userId } },
      { new: true }
    );
    res.status(200).json({
      status: 'success',
      data: {
        group: updatedGroup,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.addRoomId = async (req, res) => {
  try {
    const { roomId, id } = req.params;
    const updatedGroup = await Group.findByIdAndUpdate(
      id,
      {
        roomId: roomId,
      },
      {
        $new: true,
      }
    );
    res.status(200).json({
      status: 'success',
      data: {
        group: updatedGroup,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.changeGroupVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findById(id);
    if (group.visibility === 'Public') {
      group.visibility = 'Private';
    } else {
      group.visibility = 'Public';
    }
    await group.save();
    res.status(200).json({
      status: 'success',
      data: {
        group,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.sendInviteToUser = async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        status: 'fail',
        message: 'Group not found',
      });
    }

    if (group.invitations.includes(userId)) {
      return res.status(400).json({
        status: 'fail',
        message: 'User already invited',
      });
    }

    group.invitations.push(userId);
    await group.save();

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    user.invitations.push(groupId);
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Invitation sent!',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
