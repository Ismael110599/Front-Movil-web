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
  monthlyEventChange: number | null
  activeEvents: number
  totalAttendees: number
  weeklyAttendanceChange: number | null
  averageAttendance: number
  recentActivity: {
    eventName: string
    eventStart: string
    eventEnd: string
    timestamp: string
  }[]
  eventsByType: {
    type: string | null
    percentage: number
  }[]
  monthlyAttendanceTrend: {
    month: string
    total: number
  }[]
  attendanceByDay: {
    day: string
    total: number
  }[]
  attendanceByHour: {
    hour: number
    total: number
  }[]

}
