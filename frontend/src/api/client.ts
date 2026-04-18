import axios from 'axios'
import type {
  AnalyzeRequest,
  AnalyzeResponse,
  PlatformAnalytics,
  RevenueStats,
  QueryRecord,
  PaymentRecord,
  SessionStats,
} from '@types/index'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data)
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message)
    } else {
      // Something else happened
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

// API Methods
export const api = {
  // Health check
  health: () => apiClient.get('/health'),

  // Analyze asset
  analyze: (data: AnalyzeRequest) =>
    apiClient.post<AnalyzeResponse>('/analyze', data),

  // Get analytics
  getAnalytics: () => apiClient.get<PlatformAnalytics>('/analytics'),

  // Get revenue stats
  getRevenue: () => apiClient.get<RevenueStats>('/revenue'),

  // Get fraud status
  getFraud: () => apiClient.get('/fraud'),

  // Get session stats
  getSessionStats: (userWallet: string) =>
    apiClient.get<SessionStats>(`/session/${userWallet}/stats`),

  // Get query history
  getQueryHistory: (userWallet: string, limit = 10) =>
    apiClient.get<QueryRecord[]>(`/session/${userWallet}/history`, {
      params: { limit },
    }),

  // Get payment history
  getPaymentHistory: (userWallet: string, limit = 10) =>
    apiClient.get<PaymentRecord[]>(`/session/${userWallet}/payments`, {
      params: { limit },
    }),

  // Get circuit breaker status
  getCircuitBreaker: () => apiClient.get('/circuit-breaker'),

  // Get cache stats
  getCacheStats: () => apiClient.get('/cache/stats'),

  // Check if user is allowed
  checkUserAllowed: (userWallet: string) =>
    apiClient.post('/fraud/check', { userWallet }),
}

export default api
