import axios from 'axios'

export function apiHeader() {
  return axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    headers: {
      'Content-Type': 'application/json',
      // Optional: Add auth tokens if needed
      // 'Authorization': `Bearer ${your_token}`
    },
  })
}