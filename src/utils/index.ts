import axios from 'axios'
import chatService from './chat'
import authService from './auth'
import userService from './user'

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  },
)

export { chatService, authService, userService }
