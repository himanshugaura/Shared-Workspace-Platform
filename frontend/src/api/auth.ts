import { AppDispatch } from "@/store/store";
import { apiConnector } from "@/utils/apiConnector";
import { AuthEndpoints } from "./apis";
import toast from "react-hot-toast";
import { setUser } from "@/store/features/auth.slice";
import { User } from "@/types/entity.types";
import { setViewProfile } from "@/store/features/viewProfile.slice";


export const register = (name: string, username: string, email: string, password: string) => async (dispatch: AppDispatch): Promise<boolean> => {
  const toastId = toast.loading("Registering...");
  try {
    const res = await apiConnector("POST", AuthEndpoints.REGISTER_API, {
      name,
      username,
      email,
      password,
    });

    if (res.success && res.data) {
      toast.dismiss(toastId);
      dispatch(setUser(res.data as User));
      toast.success("Registered successfully");
      return true;
    } else {
      toast.dismiss(toastId);
      toast.error(res.message || "Registration failed");
      return false;
    }
  } catch (error) {
    console.error("Registration error:", error);
    toast.dismiss(toastId);
    toast.error("Registration failed");
    return false;
  }
};

export const login =
  (email: string, password: string) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    const toastId = toast.loading("Logging In...");
    try {
      const res = await apiConnector("POST", AuthEndpoints.LOGIN_API, {
        email,
        password,
      });
      
      if (res.success && res.data) {
        toast.dismiss(toastId);
        dispatch(setUser(res.data as User));
        toast.success("Logged In");
        return true;
      } else {
        toast.dismiss(toastId);
        toast.error(res.message || "Login failed");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.dismiss(toastId);
      toast.error("Login failed");
      return false;
    }
  };

export const googleLogin =
  (token: string) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    const toastId = toast.loading("Logging In with Google...");
    try {
      const res = await apiConnector(
        "POST",
        AuthEndpoints.GOOGLE_LOGIN_API,
        { token },
      );        

      if (res.success && res.data) {
        toast.dismiss(toastId);
        dispatch(setUser(res.data as User));
        toast.success("Logged In with Google");
        window.location.href = "/profile";
        return true;
      } else {
        toast.dismiss(toastId);
        toast.error(res.message || "Google login failed");
        return false;
      }
    } catch (error) {
      console.error("Google login error:", error);

      toast.dismiss(toastId);
      toast.error("Google login failed");

      return false;
    }
  };

  export const verifyUsername = (username: string) =>  async(): Promise<boolean> => { 
    try {
        const res = await apiConnector("GET", AuthEndpoints.CHECK_USERNAME_API + `?username=${encodeURIComponent(username)}`);
         
        if (res.success) {
            return true;
        }
        return false;
    } catch (error) {
        console.error("Username verification error:", error);
        return false;
    }
};

export const verifyEmail = (token : string) => async (): Promise<boolean> => {
  try {
    const res = await apiConnector("GET", `${AuthEndpoints.VERIFY_EMAIL_API}/${token}`);
    
    if (res.success) {
      return true;
    } else {
      toast.error(res.message || "Email verification failed");
      return false; 
    }
  } catch (error) {
    console.error("Email verification error:");
    return false;
  }
};

export const sendVerificaitonToken = () => async (): Promise<boolean> => {
  const toastId = toast.loading("Sending verification email...");
  try {
    const res = await apiConnector("POST", AuthEndpoints.SEND_VERIFICATION_TOKEN_API);

    if (res.success) {
      toast.dismiss(toastId);
      toast.success("Verification email resent");
      return true;
    } else {
      toast.dismiss(toastId);
      toast.error(res.message || "Failed to resend verification email");
      return false;
    }
  } catch (error) {
    toast.dismiss(toastId);
    console.error("Resend verification email error:", error);
    toast.error("Failed to resend verification email");
    return false;
  }
};

export const getProfile = () => async (dispatch: AppDispatch): Promise<boolean> => {
  try {
    const res = await apiConnector("GET", AuthEndpoints.GET_USER_PROFILE_API);

    if (res.success && res.data) {
      dispatch(setUser(res.data as User));
      return true;
    } else {
      toast.error(res.message || "Failed to fetch profile");
      return false;
    }
  } catch (error) {
    console.error("Get profile error:", error);
    toast.error("Failed to fetch profile");
    return false;
  }
};

export const updateProfile = (formData: FormData) => async (dispatch: AppDispatch): Promise<boolean> => {
  const toastId = toast.loading("Updating profile...");
  try {
    const res = await apiConnector("PUT", AuthEndpoints.UPDATE_PROFILE_API, formData);

    console.log(res);

    if (res.success && res.data) {
      dispatch(setUser(res.data as User));
      toast.dismiss(toastId);
      toast.success("Profile updated successfully");
      return true;
    } else {
      toast.dismiss(toastId);
      toast.error(res.message || "Failed to update profile");
      return false;
    }
  } catch (error) {
    console.error("Update profile error:", error);
    toast.dismiss(toastId);
    toast.error("Failed to update profile");
    return false;
  }
}

export const fetchProfileByUsername = (username: string) => async (dispatch: AppDispatch): Promise<boolean> => {
  try {
    const res = await apiConnector("GET", AuthEndpoints.GET_USER_BY_USERNAME_API(username));
    console.log(res);
    console.log(username);
    

    if (res.success && res.data) {
      dispatch(setViewProfile(res.data as User));
      return true;
    } else {
      toast.error(res.message || "Failed to fetch profile");
      return false;
    }
  } catch (error) {
    console.error("Get profile by username error:", error);
    toast.error("Failed to fetch profile");
    return false;
  }
};