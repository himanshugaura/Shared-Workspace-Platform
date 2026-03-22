const BASE_URL = process.env.NEXT_PUBLIC_API_URL + "/api";

// AUTH ENDPOINTS
export const AuthEndpoints = {
  LOGIN_API: BASE_URL + "/auth/login",
  REGISTER_API: BASE_URL + "/auth/register",
  GOOGLE_LOGIN_API: BASE_URL + "/auth/google",
  LOGOUT_API: BASE_URL + "/auth/logout",
  PROFILE_API: BASE_URL + "/auth/profile",
  CHECK_USERNAME_API: BASE_URL + "/auth/checkUsername",
  VERIFY_EMAIL_API: BASE_URL + "/auth/verify-email",
  SEND_VERIFICATION_TOKEN_API: BASE_URL + "/auth/send-verification-email",
  GET_USER_PROFILE_API: BASE_URL + "/auth/profile",
  UPDATE_PROFILE_API: BASE_URL + "/auth/update-profile",
};
