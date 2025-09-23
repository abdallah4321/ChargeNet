import {
  AllUsers,
  DeleteUser,
  getUserByEmail,
  getUserById,
  newUser,
  UpdateUser,
} from '../sevrices/UserServices.js';
import APIError from '../utils/apiError.js';

export const createUser = async (req, res, next) => {
  try {
    const User = await newUser(req.body);
    res.status(201).json({
      message: 'User created successflly',
      User: {
        id: User._id,
        name: User.name,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const User = await getUserById(req.params.id);
    res.status(200).json(User);
  } catch (err) {
    next(err);
  }
};

export const getByEmail = async (req, res, next) => {
  try {
    const { email } = req.query;
    const User = await getUserByEmail(email);
    res.status(200).json(User);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const Users = req.body;
    const UpdatedUsers = await UpdateUser(id, Users);
    res.status(200).json(UpdatedUsers);
  } catch (err) {
    next(err);
  }
};

export const deletedUser = async (req, res, next) => {
  try {
    const User = await getUserById(req.params.id);
    if (!User) {
      throw new APIError('User not found ', 400);
    }

    const Userdeleted = await DeleteUser(User);
    res.status(200).json({ message: 'User deleted successflly' });
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await AllUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};
