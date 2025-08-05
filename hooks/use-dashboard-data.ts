"use client"

import { useState, useEffect } from "react"
import { apiService } from "@/lib/api-service"
import type { AttendanceStats } from "@/types"

export function useDashboardData() {
  const [stats, setStats] = useState<AttendanceStats>({
    totalEvents: 0,

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
        })
        setIsConnected(true)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setIsConnected(false)
      // Mantener datos por defecto en caso de error
      setStats({
        totalEvents: 0,

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
