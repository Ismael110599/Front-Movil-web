export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "docente"
  avatar?: string
}

export interface Docente {
  id: string
  name: string
  email: string
  createdAt: string
  verified: boolean
  eventsAssigned: number
}

export interface Event {
  id: string
  name: string
  type: "seminario" | "clase" | "conferencia"
  startDate: string
  endDate: string
  duration: number
  startTime: string
  endTime: string
  location: string
  description: string
  coordinates: {
    lat: number
    lng: number
  }
  policies: {
    exitTolerance: number // minutos
    mandatory: boolean
  }
  status: "activo" | "finalizado" | "cancelado" | "en_proceso"
  attendanceCount: number
  totalRegistered: number
}

export interface AttendanceStats {
  totalEvents: number
  activeEvents: number
  totalAttendees: number
  averageAttendance: number
  recentActivity: {
    eventName: string
    attendeeCount: number
    timestamp: string
  }[]
}
