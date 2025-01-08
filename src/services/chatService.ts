import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_FASTAPI_URL

class ChatService {
  async send_user_message(user_message: String, user_id: String) {
    const response = await axios.post(API_URL + 'chatbot', { user_message, user_id })
    return response.data
  }

  async get_chat_history(user_id: String) {
    const response = await axios.post(API_URL + 'chathistory', user_id)
    return response.data.response
  }

  async semantic_search(query: string) {
    const response = await axios.post(API_URL + 'semanticsearch', query)
    return response.data.response
  }

  async predict_response_type(query: any) {
    const response = await axios.post(API_URL + 'classification', query)
    return response.data.response
  }
}

export const chatService = new ChatService()
