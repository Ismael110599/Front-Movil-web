"use client"

import { useState, useEffect } from "react"
import { apiService } from "@/lib/api-service"
import type { AttendanceStats } from "@/types"

export function useDashboardData() {
  const [stats, setStats] = useState<AttendanceStats>({
    totalEvents: 0,
    monthlyEventChange: null,
    activeEvents: 0,
    totalAttendees: 0,
    weeklyAttendanceChange: null,
    averageAttendance: 0,
    recentActivity: [],
    eventsByType: [],
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
          monthlyEventChange: response.data.cambioEventosMes ?? null,
          activeEvents: response.data.eventosActivos,
          totalAttendees: response.data.totalAsistentes,
          weeklyAttendanceChange: response.data.cambioAsistenciasSemana ?? null,
          averageAttendance: response.data.promedioAsistenciaPorcentaje,
          recentActivity:
            response.data.actividadReciente?.map((activity) => ({
              eventName: activity.nombre,
              timestamp: activity.createdAt,
            })) || [],
          eventsByType:
            response.data.eventosPorTipo?.map((t) => ({
              type: t.tipo,
              percentage: t.porcentaje,
            })) || [],
        })
        setIsConnected(true)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setIsConnected(false)
      // Mantener datos por defecto en caso de error
      setStats({
        totalEvents: 0,
        monthlyEventChange: null,
        activeEvents: 0,
        totalAttendees: 0,
        weeklyAttendanceChange: null,
        averageAttendance: 0,
        recentActivity: [],
        eventsByType: [],
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
