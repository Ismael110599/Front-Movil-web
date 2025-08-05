import {
  API_CONFIG,
  type ApiResponse,
  type LoginResponse,
  type EventoBackend,
  type DashboardData,
} from "./api-config"
import { httpClient } from "./http-client"

export const apiService = {
  async login(correo: string, contrasena: string): Promise<LoginResponse> {
    const response = await httpClient.post<ApiResponse<LoginResponse>>(API_CONFIG.ENDPOINTS.LOGIN, {
      correo,
      contrasena,
    })

    if (response.token) {
      httpClient.setToken(response.token)
    }

    return response.data || (response as unknown as LoginResponse)
  },

  register(userData: {
    nombre: string
    correo: string
    contrasena: string
    rol: "admin" | "docente" | "estudiante"
  }): Promise<ApiResponse> {
    return httpClient.post<ApiResponse>(API_CONFIG.ENDPOINTS.REGISTER, userData)
  },

  sendDocenteVerificationCode(correo: string): Promise<ApiResponse> {
    return httpClient.post<ApiResponse>(API_CONFIG.ENDPOINTS.DOCENTE_SEND_CODE, { correo })
  },

  verifyEmail(correo: string, codigo: string): Promise<ApiResponse> {
    return httpClient.post<ApiResponse>(API_CONFIG.ENDPOINTS.VERIFY_EMAIL, { correo, codigo })
  },

  createEvent(eventData: {
    titulo: string
    ubicacion: {
      latitud: number
      longitud: number
    }
    fechaInicio: string
    rangoPermitido: number
  }): Promise<ApiResponse<EventoBackend>> {
    return httpClient.post<ApiResponse<EventoBackend>>(API_CONFIG.ENDPOINTS.CREATE_EVENT, eventData)
  },

  getEvents(): Promise<ApiResponse<EventoBackend[]>> {
    return httpClient.get<ApiResponse<EventoBackend[]>>(API_CONFIG.ENDPOINTS.LIST_EVENTS)
  },

  finalizeEvent(eventoId: string): Promise<ApiResponse> {
    return httpClient.post<ApiResponse>(`${API_CONFIG.ENDPOINTS.FINALIZE_EVENT}/${eventoId}`)
  },

  registerAttendance(data: {
    eventoId: string
    latitud: number
    longitud: number
  }): Promise<ApiResponse> {
    return httpClient.post<ApiResponse>(API_CONFIG.ENDPOINTS.REGISTER_ATTENDANCE, data)
  },

  getDashboardData(): Promise<ApiResponse<DashboardData>> {
    return httpClient.get<ApiResponse<DashboardData>>(API_CONFIG.ENDPOINTS.DASHBOARD_DATA)
  },

  createJustification(data: any): Promise<ApiResponse> {
    return httpClient.post<ApiResponse>(API_CONFIG.ENDPOINTS.CREATE_JUSTIFICATION, data)
  },

  logout(): void {
    httpClient.clearToken()
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
    }
  },

  setToken(token: string): void {
    httpClient.setToken(token)
  },
}

