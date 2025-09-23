import Users from '../models/UsersModels.js';

export const createUser = async (dataUser) => {
  const user = new Users(dataUser);
  return await user.save();
};

export const findUserByEmail = async (email) => {
  return await Users.findOne({ email });
};

export const findUserById = async (id) => {
  return await Users.findById(id);
};

export const updateUser = async (id, updateData) => {
  return await Users.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

export const deleteUser = async (id) => {
  return await Users.findByIdAndDelete(id);
};

export const getAllUser = async () => {
  return await Users.find({});
};
