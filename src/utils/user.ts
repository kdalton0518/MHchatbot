import axios from 'axios'
import { User } from '@prisma/client'

const API_URL = process.env.NEXT_PUBLIC_FASTAPI_BACKEND_URL

class UserService {
  async getProfile(): Promise<User> {
    const response = await axios.get(API_URL + 'users/me')
    return response.data
  }

  async updateProfile(profile: User): Promise<User> {
    const response = await axios.patch(API_URL + 'users/me', profile)
    return response.data
  }

  async updateUser(userId: string, profile: User): Promise<User> {
    const response = await axios.patch(API_URL + `users/${userId}`, profile)
    return response.data
  }

  async getUsers(): Promise<Array<User>> {
    const response = await axios.get(API_URL + 'users')
    return response.data
  }

  async deleteUser(userId: string) {
    const response = await axios.delete(API_URL + `users/${userId}`)
    return response.data
  }

  async deleteSelf() {
    const response = await axios.delete(API_URL + 'users/me')
    return response.data
  }
}

const userService = new UserService()
export default userService
