"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { apiService } from "@/lib/api-service"
import type { Docente } from "@/types"

interface CreateDocenteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (docente: Docente) => void
}

export function CreateDocenteModal({ open, onOpenChange, onSuccess }: CreateDocenteModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)
    try {
      const response = await apiService.register({
        nombre: formData.name,
        correo: formData.email,
        contrasena: formData.password,
        rol: "docente",
      })

      if (response.success) {
        const newDocente: Docente = {
          id: (response.data as any)?.id || (response.data as any)?._id || Date.now().toString(),
          name: formData.name,
          email: formData.email,
          createdAt: new Date().toISOString().split("T")[0],
          verified: false,
          eventsAssigned: 0,
        }
        onSuccess(newDocente)
        onOpenChange(false)

        // Reset form
        setFormData({ name: "", email: "", password: "" })
      } else {
        alert(response.message || "No se pudo crear el docente")
      }
    } catch (error) {
      console.error("Error creating docente:", error)
      alert("Error al crear el docente")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Docente</DialogTitle>
          <DialogDescription>Complete la información del docente.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Dr. Juan Pérez"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="juan.perez@universidad.edu"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
              placeholder="••••••••"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear Docente
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
