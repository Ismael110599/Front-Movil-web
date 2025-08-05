"use client"

import { useState, useEffect } from "react"
import { apiService } from "@/lib/api-service"
import type { EventoBackend } from "@/lib/api-config"
import type { Event } from "@/types"

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const transformBackendEvent = (backendEvent: EventoBackend): Event => {
    return {
      id: backendEvent._id,
      name: backendEvent.titulo,
      type: "conferencia", // Por defecto, ya que el backend no especifica tipo
      startDate: new Date(backendEvent.fechaInicio).toISOString().split("T")[0],
      endDate: new Date(backendEvent.fechaInicio).toISOString().split("T")[0],
      duration: 1,
      startTime: new Date(backendEvent.fechaInicio).toTimeString().slice(0, 5),
      endTime: new Date(new Date(backendEvent.fechaInicio).getTime() + 2 * 60 * 60 * 1000).toTimeString().slice(0, 5),
      location: `Lat: ${backendEvent.ubicacion.latitud}, Lng: ${backendEvent.ubicacion.longitud}`,
      description: `Evento: ${backendEvent.titulo}`,
      coordinates: {
        lat: backendEvent.ubicacion.latitud,
        lng: backendEvent.ubicacion.longitud,
      },
      policies: {
        exitTolerance: 15,
        mandatory: true,
      },
      status: backendEvent.estado || "activo",
      attendanceCount: backendEvent.asistentes || 0,
      totalRegistered: backendEvent.totalRegistrados || 0,
    }
  }

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiService.getEvents()

      if (response.data) {
        const transformedEvents = response.data.map(transformBackendEvent)
        setEvents(transformedEvents)
      }
    } catch (error: any) {
      console.error("Error fetching events:", error)
      setError(error.message || "Error al cargar eventos")
    } finally {
      setIsLoading(false)
    }
  }

  const createEvent = async (eventData: {
    titulo: string
    ubicacion: { latitud: number; longitud: number }
    fechaInicio: string
    rangoPermitido: number
  }) => {
    try {
      const response = await apiService.createEvent(eventData)
      if (response.data) {
        const newEvent = transformBackendEvent(response.data)
        setEvents((prev) => [...prev, newEvent])
        return { success: true, data: newEvent }
      }
      return { success: false, error: "No se pudo crear el evento" }
    } catch (error: any) {
      console.error("Error creating event:", error)
      return { success: false, error: error.message || "Error al crear evento" }
    }
  }

  const finalizeEvent = async (eventId: string) => {
    try {
      await apiService.finalizeEvent(eventId)
      setEvents((prev) =>
        prev.map((event) => (event.id === eventId ? { ...event, status: "finalizado" as const } : event)),
      )
      return { success: true }
    } catch (error: any) {
      console.error("Error finalizing event:", error)
      return { success: false, error: error.message || "Error al finalizar evento" }
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  return {
    events,
    isLoading,
    error,
    refetch: fetchEvents,
    createEvent,
    finalizeEvent,
  }
}
