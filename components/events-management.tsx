"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CreateEventModal } from "./create-event-modal"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Plus,
  Search,
  MoreHorizontal,
  MapPin,
  Calendar,
  Clock,
  Users,
  Eye,
  Edit,
  Trash2,
  Download,
  Filter,
  Play,
  Pause,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  Loader2,
  RefreshCw,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEvents } from "@/hooks/use-events"

const statusColors = {
  activo: "default",
  en_proceso: "secondary",
  finalizado: "outline",
  cancelado: "destructive",
} as const

const statusIcons = {
  activo: Play,
  en_proceso: Pause,
  finalizado: CheckCircle,
  cancelado: XCircle,
}

const typeLabels = {
  seminario: "Seminario",
  clase: "Clase",
  conferencia: "Conferencia",
}

const typeIcons = {
  seminario: Users,
  clase: BarChart3,
  conferencia: Calendar,
}

export function EventsManagement() {
  const { events, isLoading, error, refetch, finalizeEvent } = useEvents()
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateSuccess = () => {
    refetch()
  }

  const handleFinalizeEvent = async (eventId: string) => {
    const result = await finalizeEvent(eventId)
    if (!result.success) {
      console.error("Error finalizing event:", result.error)
    }
  }

  const handleExportEvents = () => {
    // Simular exportación
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Nombre,Tipo,Fecha Inicio,Lugar,Estado,Asistencia\n" +
      filteredEvents
        .map(
          (e) =>
            `${e.name},${typeLabels[e.type]},${e.startDate},${e.location},${e.status},${e.attendanceCount}/${e.totalRegistered}`,
        )
        .join("\n")

    const link = document.createElement("a")
    link.href = encodeURI(csvContent)
    link.download = `eventos-${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  const activeEvents = events.filter((e) => e.status === "activo").length
  const inProgressEvents = events.filter((e) => e.status === "en_proceso").length
  const finishedEvents = events.filter((e) => e.status === "finalizado").length
  const totalAttendance = events.reduce((sum, e) => sum + e.attendanceCount, 0)

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-600">Cargando eventos...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Calendar className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
            Gestión de Eventos
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Administra los eventos académicos de la universidad
          </p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
          <Button variant="outline" onClick={refetch} className="w-full sm:w-auto bg-transparent">
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
          <Button variant="outline" onClick={handleExportEvents} className="w-full sm:w-auto bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button onClick={() => setShowCreateModal(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Evento
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Eventos Activos</p>
              <p className="text-2xl font-bold text-green-900">{activeEvents}</p>
            </div>
            <Play className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">En Proceso</p>
              <p className="text-2xl font-bold text-blue-900">{inProgressEvents}</p>
            </div>
            <Pause className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Finalizados</p>
              <p className="text-2xl font-bold text-gray-900">{finishedEvents}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-gray-500" />
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Total Asistentes</p>
              <p className="text-2xl font-bold text-purple-900">{totalAttendance}</p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar eventos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button variant="outline" className="w-full md:w-auto bg-transparent">
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </div>

      {/* Tabla de eventos */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Evento
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Tipo
                </div>
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Fecha/Hora
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Coordenadas
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Asistencia
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Estado
                </div>
              </TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No se encontraron eventos
                </TableCell>
              </TableRow>
            ) : (
              filteredEvents.map((event) => {
                const StatusIcon = statusIcons[event.status]
                const TypeIcon = typeIcons[event.type]
                const attendancePercentage =
                  event.totalRegistered > 0 ? Math.round((event.attendanceCount / event.totalRegistered) * 100) : 0

                return (
                  <TableRow key={event.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <TypeIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{event.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {event.startTime} - {event.endTime}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        <TypeIcon className="h-3 w-3" />
                        {typeLabels[event.type]}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          {new Date(event.startDate).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-sm font-mono text-xs">
                          {event.coordinates.lat.toFixed(4)}, {event.coordinates.lng.toFixed(4)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <div className="text-sm">
                          <div className="font-medium">
                            {event.attendanceCount}/{event.totalRegistered}
                          </div>
                          <div
                            className={`text-xs ${
                              attendancePercentage >= 80
                                ? "text-green-600"
                                : attendancePercentage >= 60
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }`}
                          >
                            {attendancePercentage}%
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusColors[event.status]} className="flex items-center gap-1 w-fit">
                        <StatusIcon className="h-3 w-3" />
                        {event.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="mr-2 h-4 w-4" />
                            Ver asistencia
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MapPin className="mr-2 h-4 w-4" />
                            Ver en mapa
                          </DropdownMenuItem>
                          {event.status === "activo" && (
                            <DropdownMenuItem onClick={() => handleFinalizeEvent(event.id)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Finalizar evento
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Exportar reporte
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Cancelar evento
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <CreateEventModal open={showCreateModal} onOpenChange={setShowCreateModal} onSuccess={handleCreateSuccess} />
    </div>
  )
}
