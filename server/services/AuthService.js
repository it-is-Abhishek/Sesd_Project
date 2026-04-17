import { clerkClient, getAuth } from '@clerk/express';

class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  getAuthenticatedUserId(req) {
    const { isAuthenticated, userId } = getAuth(req);

    if (!isAuthenticated || !userId) {
      throw new Error('Authentication required.');
    }

    return userId;
  }

  async ensureUser(req) {
    const clerkUserId = this.getAuthenticatedUserId(req);
    const clerkUser = await clerkClient.users.getUser(clerkUserId);
    const primaryEmail =
      clerkUser.emailAddresses.find(
        (email) => email.id === clerkUser.primaryEmailAddressId
      )?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress;

    if (!primaryEmail) {
      throw new Error('Unable to resolve Clerk user email.');
    }

    const fullName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ').trim();

    return this.userRepository.upsertByClerkUserId(clerkUserId, {
      clerkUserId,
      email: primaryEmail,
      firstName: clerkUser.firstName || '',
      lastName: clerkUser.lastName || '',
      fullName,
      imageUrl: clerkUser.imageUrl || '',
      lastSignInAt: clerkUser.lastSignInAt ? new Date(clerkUser.lastSignInAt) : null
    });
  }
}

export default AuthService;
