"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CreateDocenteModal } from "./create-docente-modal"
import {
  Plus,
  Search,
  MoreHorizontal,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Edit,
  Eye,
  Trash2,
  Filter,
  Download,
  Users,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Docente } from "@/types"

const mockDocentes: Docente[] = [
  {
    id: "1",
    name: "Dr. María García",
    email: "maria.garcia@universidad.edu",
    createdAt: "2024-01-15",
    verified: true,
    eventsAssigned: 5,
  },
  {
    id: "2",
    name: "Prof. Carlos López",
    email: "carlos.lopez@universidad.edu",
    createdAt: "2024-01-20",
    verified: true,
    eventsAssigned: 3,
  },
  {
    id: "3",
    name: "Dra. Ana Martínez",
    email: "ana.martinez@universidad.edu",
    createdAt: "2024-01-25",
    verified: false,
    eventsAssigned: 0,
  },
  {
    id: "4",
    name: "Prof. Roberto Silva",
    email: "roberto.silva@universidad.edu",
    createdAt: "2024-01-28",
    verified: true,
    eventsAssigned: 7,
  },
  {
    id: "5",
    name: "Dra. Carmen Ruiz",
    email: "carmen.ruiz@universidad.edu",
    createdAt: "2024-02-01",
    verified: false,
    eventsAssigned: 0,
  },
]

export function DocentesManagement() {
  const [docentes, setDocentes] = useState<Docente[]>(mockDocentes)
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filteredDocentes = docentes.filter(
    (docente) =>
      docente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      docente.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateSuccess = () => {
    // Simular adición de nuevo docente
    const newDocente: Docente = {
      id: Date.now().toString(),
      name: "Nuevo Docente",
      email: "nuevo@universidad.edu",
      createdAt: new Date().toISOString().split("T")[0],
      verified: true,
      eventsAssigned: 0,
    }
    setDocentes((prev) => [...prev, newDocente])
  }

  const handleExportDocentes = () => {
    // Simular exportación
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Nombre,Email,Estado,Eventos Asignados,Fecha Creación\n" +
      filteredDocentes
        .map(
          (d) => `${d.name},${d.email},${d.verified ? "Verificado" : "Pendiente"},${d.eventsAssigned},${d.createdAt}`,
        )
        .join("\n")

    const link = document.createElement("a")
    link.href = encodeURI(csvContent)
    link.download = `docentes-${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  const verifiedCount = docentes.filter((d) => d.verified).length
  const pendingCount = docentes.filter((d) => !d.verified).length
  const totalEvents = docentes.reduce((sum, d) => sum + d.eventsAssigned, 0)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
            Gestión de Docentes
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Administra los docentes del sistema universitario
          </p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
          <Button variant="outline" onClick={handleExportDocentes} className="w-full sm:w-auto bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button onClick={() => setShowCreateModal(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Docente
          </Button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Docentes</p>
              <p className="text-2xl font-bold text-blue-900">{docentes.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Verificados</p>
              <p className="text-2xl font-bold text-green-900">{verifiedCount}</p>
            </div>
            <UserCheck className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-900">{pendingCount}</p>
            </div>
            <UserX className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Eventos Asignados</p>
              <p className="text-2xl font-bold text-purple-900">{totalEvents}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar docentes..."
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

      {/* Tabla de docentes */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Docente
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Correo
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Estado
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Eventos
                </div>
              </TableHead>
              <TableHead className="hidden md:table-cell">Fecha Creación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocentes.map((docente) => (
              <TableRow key={docente.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{docente.name}</div>
                      <div className="text-sm text-gray-500 md:hidden">{docente.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {docente.email}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={docente.verified ? "default" : "secondary"}
                    className={
                      docente.verified
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-yellow-100 text-yellow-800 border-yellow-200"
                    }
                  >
                    {docente.verified ? <UserCheck className="h-3 w-3 mr-1" /> : <UserX className="h-3 w-3 mr-1" />}
                    {docente.verified ? "Verificado" : "Pendiente"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{docente.eventsAssigned}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-gray-500">
                  {new Date(docente.createdAt).toLocaleDateString()}
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
                        Ver perfil
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="mr-2 h-4 w-4" />
                        Ver eventos
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        Enviar email
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CreateDocenteModal open={showCreateModal} onOpenChange={setShowCreateModal} onSuccess={handleCreateSuccess} />
    </div>
  )
}
