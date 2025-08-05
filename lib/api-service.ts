import { API_CONFIG, type ApiResponse, type LoginResponse, type EventoBackend, type DashboardData } from "./api-config"

class ApiService {
  private baseUrl: string
  private token: string | null = null

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL
    // Obtener token del localStorage si existe
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    // Agregar token de autorización si existe
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error en la petición")
      }

      return data
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }

  // Métodos de autenticación
  async login(correo: string, contrasena: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>(API_CONFIG.ENDPOINTS.LOGIN, {
      method: "POST",
      body: JSON.stringify({ correo, contrasena }),
    })

    if (response.token) {
      this.token = response.token
      localStorage.setItem("auth_token", response.token)
    }

    return response.data || (response as LoginResponse)
  }

  async register(userData: {
    nombre: string
    correo: string
    contrasena: string
    rol: "admin" | "docente" | "estudiante"
  }): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.REGISTER, {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async verifyEmail(correo: string, codigo: string): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.VERIFY_EMAIL, {
      method: "POST",
      body: JSON.stringify({ correo, codigo }),
    })
  }

  // Métodos de eventos
  async createEvent(eventData: {
    titulo: string
    ubicacion: {
      latitud: number
      longitud: number
    }
    fechaInicio: string
    rangoPermitido: number
  }): Promise<ApiResponse<EventoBackend>> {
    return this.request(API_CONFIG.ENDPOINTS.CREATE_EVENT, {
      method: "POST",
      body: JSON.stringify(eventData),
    })
  }

  async getEvents(): Promise<ApiResponse<EventoBackend[]>> {
    return this.request(API_CONFIG.ENDPOINTS.LIST_EVENTS)
  }

  async finalizeEvent(eventoId: string): Promise<ApiResponse> {
    return this.request(`${API_CONFIG.ENDPOINTS.FINALIZE_EVENT}/${eventoId}`, {
      method: "POST",
    })
  }

  // Métodos de asistencia
  async registerAttendance(data: {
    eventoId: string
    latitud: number
    longitud: number
  }): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.REGISTER_ATTENDANCE, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Métodos de dashboard
  async getDashboardData(): Promise<ApiResponse<DashboardData>> {
    return this.request(API_CONFIG.ENDPOINTS.DASHBOARD_DATA)
  }

  // Métodos de justificaciones
  async createJustification(data: any): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.CREATE_JUSTIFICATION, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Método para cerrar sesión
  logout(): void {
    this.token = null
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user")
  }

  // Método para establecer token
  setToken(token: string): void {
    this.token = token
    localStorage.setItem("auth_token", token)
  }
}

export const apiService = new ApiService()
