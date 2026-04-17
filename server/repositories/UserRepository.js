import User from '../models/User.js';

class UserRepository {
  async upsertByClerkUserId(clerkUserId, userData) {
    return User.findOneAndUpdate(
      { clerkUserId },
      { $set: userData },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
  }

  async findByClerkUserId(clerkUserId) {
    return User.findOne({ clerkUserId });
  }
}

export default UserRepository;
