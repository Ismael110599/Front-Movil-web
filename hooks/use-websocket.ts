"use client"

import { useState, useEffect } from "react"
import { apiService } from "@/lib/api-service"
import type { AttendanceStats } from "@/types"

export function useWebSocket() {
  const [stats, setStats] = useState<AttendanceStats>({
    totalEvents: 0,
    activeEvents: 0,
    totalAttendees: 0,
    averageAttendance: 0,
    recentActivity: [],
  })
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const response = await apiService.getDashboardData()

      if (response.data) {
        setStats({
          totalEvents: response.data.totalEventos,
          activeEvents: response.data.eventosActivos,
          totalAttendees: response.data.totalAsistentes,
          averageAttendance: response.data.promedioAsistencia,
          recentActivity: response.data.actividadReciente.map((activity) => ({
            eventName: activity.nombreEvento,
            attendeeCount: activity.cantidadAsistentes,
            timestamp: activity.timestamp,
          })),
        })
        setIsConnected(true)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setIsConnected(false)
      // Mantener datos por defecto en caso de error
      setStats({
        totalEvents: 0,
        activeEvents: 0,
        totalAttendees: 0,
        averageAttendance: 0,
        recentActivity: [],
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Cargar datos iniciales
    fetchDashboardData()

    // Actualizar datos cada 30 segundos
    const interval = setInterval(fetchDashboardData, 30000)

    return () => clearInterval(interval)
  }, [])

  return { stats, isConnected, isLoading, refetch: fetchDashboardData }
}
