import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_FASTAPI_URL

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

class ChatService {
  async send_user_message(user_message: String) {
    const response = await axios.post(API_URL + 'services/llm', user_message)
    return response.data
  }

  async get_chat_history() {
    const response = await axios.get(API_URL + 'services/chathistory')
    return response.data.response
  }

  async semantic_search(query: string) {
    const response = await axios.post(API_URL + 'services/ss', query)
    return response.data.response
  }

  async predict_response_type(query: any) {
    const response = await axios.post(API_URL + 'services/ml', query)
    return response.data.response
  }
}

export const chatService = new ChatService()
