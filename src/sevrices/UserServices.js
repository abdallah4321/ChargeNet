import {
  createUser,
  deleteUser,
  findUserByEmail,
  findUserById,
  getAllUser,
  updateUser,
} from '../dataAccess/user.dataAccess.js';

export const newUser = async (data) => {
  return await createUser(data);
};

export const getUserById = async (id) => {
  return await findUserById(id);
};

export const getUserByEmail = async (id) => {
  return await findUserByEmail(id);
};

export const AllUsers = async () => {
  return await getAllUser();
};

export const UpdateUser = async (id, data) => {
  return await updateUser(id, data);
};

export const DeleteUser = async (id) => {
  return await deleteUser(id);
};
