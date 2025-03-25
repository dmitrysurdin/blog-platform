export const DATABASE = {
  NAME: 'database',
  TESTING_COLLECTION: 'testing',
  BLOG_COLLECTION: 'blogs',
  COMMENTS_COLLECTION: 'comments',
  POSTS_COLLECTION: 'posts',
  USERS_COLLECTION: 'users',
  REGISTRATION_USERS_COLLECTION: 'registration-users',
  REVOKED_TOKENS_COLLECTION: 'revoked-tokens',
  PASSWORD_RECOVERY_COLLECTION: 'password-recovery',
};

export enum LikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

export const AUTH_TYPE = {
  BASIC: 'basic',
  JWT_ACCESS: 'jwt-access',
  JWT_SOFT: 'jwt-soft',
  REFRESH_TOKEN: 'refresh-token',
};
