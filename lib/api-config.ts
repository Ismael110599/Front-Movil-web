// Configuración de la API
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:80",
  ENDPOINTS: {
    // Usuarios
    REGISTER: "/api/usuarios/registrar",
    LOGIN: "/api/usuarios/login",
    VERIFY_EMAIL: "/api/usuarios/verificar-correo",
    DOCENTE_SEND_CODE: "/api/usuarios/enviar-codigo",

    // Docentes
    LIST_DOCENTES: "/api/usuarios/docentes",

    // Eventos
    CREATE_EVENT: "/api/eventos/crear",
    LIST_EVENTS: "/api/eventos/listar",
    FINALIZE_EVENT: "/api/eventos/finalizar",

    // Asistencia
    REGISTER_ATTENDANCE: "/api/asistencia/registrar",

    // Dashboard
    DASHBOARD_DATA: "/api/dashboard/overview",

    // Justificaciones
    CREATE_JUSTIFICATION: "/api/justificaciones/crear",
  },
}

// Tipos de respuesta de la API
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  token?: string
}

export interface LoginResponse {
  token: string
  usuario: {
    id: string
    nombre: string
    correo: string
    rol: "admin" | "docente" | "estudiante"
  }
}

export interface EventoBackend {
  _id: string
  titulo: string
  ubicacion: {
    latitud: number
    longitud: number
  }
  fechaInicio: string
  rangoPermitido: number
  estado?: "activo" | "finalizado" | "cancelado"
  asistentes?: number
  totalRegistrados?: number
}

export interface DashboardData {
  totalEventos: number
  cambioEventosMes: number | null
  eventosActivos: number
  totalAsistentes: number
  cambioAsistenciasSemana: number | null
  promedioAsistenciaPorcentaje: number
  eventosPorTipo: {
    tipo: string
    porcentaje: number
  }[]
  tendenciaAsistenciaMensual: {
    mes: string
    total: number
  }[]
  asistenciaPorDia: {
    dia: string
    total: number
  }[]
  asistenciaPorHora: {
    hora: number
    total: number
  }[]
  actividadReciente: {
    nombre: string
    fechaInicio: string
    fechaFin: string
    createdAt: string
  }[]
}
