"use client"

import { useState, useEffect } from "react"
import { apiService } from "@/lib/api-service"
import type { AttendanceStats } from "@/types"

export function useDashboardData() {
  const initialStats: AttendanceStats = {
    totalEvents: 0,
    monthlyEventChange: null,
    activeEvents: 0,
    totalAttendees: 0,
    weeklyAttendanceChange: null,
    averageAttendance: 0,
    recentActivity: [],
    eventsByType: [],
    monthlyAttendanceTrend: [],
    attendanceByDay: [],
    attendanceByHour: [],
  }
  const [stats, setStats] = useState<AttendanceStats>(initialStats)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const response = await apiService.getDashboardData()

      if (response.data) {
        const data = response.data
        setStats({
          totalEvents: data.totalEventos ?? 0,
          monthlyEventChange: data.cambioEventosMes ?? null,
          activeEvents: data.eventosActivos ?? 0,
          totalAttendees: data.totalAsistentes ?? 0,
          weeklyAttendanceChange: data.cambioAsistenciasSemana ?? null,
          averageAttendance: data.promedioAsistenciaPorcentaje ?? 0,
          recentActivity: (data.actividadReciente ?? []).map((item) => ({
            eventName: item.nombre,
            eventStart: item.fechaInicio,
            eventEnd: item.fechaFin,
            timestamp: item.createdAt,
          })),
          eventsByType: (data.eventosPorTipo ?? []).map((item) => ({
            type: item.tipo,
            percentage: item.porcentaje,
          })),
          monthlyAttendanceTrend: (data.tendenciaAsistenciaMensual ?? []).map(
            (item) => ({
              month: item.mes,
              total: item.total,
            })
          ),
          attendanceByDay: (data.asistenciaPorDia ?? []).map((item) => ({
            day: item.dia,
            total: item.total,
          })),
          attendanceByHour: (data.asistenciaPorHora ?? []).map((item) => ({
            hour: item.hora,
            total: item.total,
          })),
        })
        setIsConnected(true)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setIsConnected(false)
      // Mantener datos por defecto en caso de error
      setStats(initialStats)
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
