import axios from "axios";
import { User } from "../types/user";

const API_URL = process.env.NEXT_PUBLIC_FASTAPI_BACKEND_URL;
class AuthService {
  async register(user: User) {
    const response = await axios.post(API_URL + "users", user);
    return response.data;
  }

  async login(data: FormData) {
    const response = await axios.post(API_URL + "login/access-token", data);
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }
    return response.data;
  }

  async refreshToken() {
    const response = await axios.get(API_URL + "login/refresh-token", {
      withCredentials: true,
    });
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem("token");
  }

  getGoogleLoginUrl() {
    return API_URL + "login/google";
  }

  getFacebookLoginUrl() {
    return API_URL + "login/facebook";
  }
}

const authService = new AuthService();
export default authService;
