import mongoose from "mongoose";

export type UCFMapUser = {
  id?: string;
  username: string;
  email: string;
  password: string;
};

const User = mongoose.model(
  "User",
  new mongoose.Schema<UCFMapUser>({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  })
);

/**
 *
 * @param username
 * @param email
 * @param password
 * @returns
 */
export async function createUser(user: UCFMapUser): Promise<UCFMapUser> {
  const dbUser = new User({
    username: user.username,
    email: user.email,
    password: user.password,
  });
  await dbUser.save();
  return {
    id: dbUser._id.toString(),
    username: user.username,
    email: user.email,
    password: user.password,
  };
}

/**
 * Find a user by their id in the database
 * @param userId - The mongoose document ID of the user to retrieve
 * @returns the user object if found
 * @returns null if the user was not found
 */
export async function getUserById(userId: string): Promise<UCFMapUser | null> {
  const user = await User.findById(userId);
  if (!user) return null;
  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    password: user.password,
  };
}

/**
 * Find a user by their username in the database
 * @param username - The username of the user to retrieve
 * @returns the user object if found
 * @returns null if the user was not found
 */
export async function getUserByUsername(userName: string): Promise<UCFMapUser | null> {
  const user = await User.findOne(
    { username: userName },
    { _id: 1, username: 1, email: 1, password: 1 }
  );
  if (!user) return null;
  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    password: user.password,
  };
}

/**
 * Find a user by their email in the database
 * @param email - The email of the user to retrieve
 * @returns the user object if found
 * @returns null if the user was not found
 */
export async function getUserByEmail(email: string): Promise<UCFMapUser | null> {
  const user = await User.findOne({ email: email }, { _id: 1, username: 1, email: 1, password: 1 });
  if (!user) return null;
  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    password: user.password,
  };
}

/**
 * Update a user in the database
 * @param userId - The mongoose document ID of the user to update
 * @param user - The user object to update
 * @returns the updated user object
 * @returns null if the user was not found
 */
export async function updateUser(
  userId: string,
  user: Partial<UCFMapUser>
): Promise<UCFMapUser | null> {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      username: user.username,
      email: user.email,
      password: user.password,
    },
    { new: true }
  );
  if (!updatedUser) return null;
  return {
    id: updatedUser._id.toString(),
    username: updatedUser.username,
    email: updatedUser.email,
    password: updatedUser.password,
  };
}

/**
 * Delete a user in the database
 * @param userId - The mongoose document ID of the user to delete
 * @returns the deleted user object, if found
 * @returns null if the user was not found
 */
export async function deleteUser(userId: string): Promise<UCFMapUser | null> {
  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) return null;
  return {
    id: deletedUser._id.toString(),
    username: deletedUser.username,
    email: deletedUser.email,
    password: deletedUser.password,
  };
}
