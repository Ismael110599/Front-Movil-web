"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import { useEvents } from "@/hooks/use-events"

interface CreateEventModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateEventModal({ open, onOpenChange, onSuccess }: CreateEventModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { createEvent } = useEvents()

  const [formData, setFormData] = useState({
    titulo: "",
    fechaInicio: "",
    horaInicio: "",
    latitud: "",
    longitud: "",
    rangoPermitido: "100",
    descripcion: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Combinar fecha y hora
      const fechaCompleta = new Date(`${formData.fechaInicio}T${formData.horaInicio}:00.000Z`)

      const eventData = {
        titulo: formData.titulo,
        ubicacion: {
          latitud: Number.parseFloat(formData.latitud),
          longitud: Number.parseFloat(formData.longitud),
        },
        fechaInicio: fechaCompleta.toISOString(),
        rangoPermitido: Number.parseInt(formData.rangoPermitido),
      }

      const result = await createEvent(eventData)

      if (result.success) {
        onSuccess()
        onOpenChange(false)
        // Reset form
        setFormData({
          titulo: "",
          fechaInicio: "",
          horaInicio: "",
          latitud: "",
          longitud: "",
          rangoPermitido: "100",
          descripcion: "",
        })
      } else {
        setError(result.error || "Error al crear el evento")
      }
    } catch (error: any) {
      setError(error.message || "Error inesperado")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Evento</DialogTitle>
          <DialogDescription>Complete la información del evento académico.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título del evento *</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData((prev) => ({ ...prev, titulo: e.target.value }))}
              placeholder="Conferencia de IA"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fechaInicio">Fecha *</Label>
              <Input
                id="fechaInicio"
                type="date"
                value={formData.fechaInicio}
                onChange={(e) => setFormData((prev) => ({ ...prev, fechaInicio: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="horaInicio">Hora *</Label>
              <Input
                id="horaInicio"
                type="time"
                value={formData.horaInicio}
                onChange={(e) => setFormData((prev) => ({ ...prev, horaInicio: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitud">Latitud *</Label>
              <Input
                id="latitud"
                type="number"
                step="any"
                value={formData.latitud}
                onChange={(e) => setFormData((prev) => ({ ...prev, latitud: e.target.value }))}
                placeholder="-2.170998"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitud">Longitud *</Label>
              <Input
                id="longitud"
                type="number"
                step="any"
                value={formData.longitud}
                onChange={(e) => setFormData((prev) => ({ ...prev, longitud: e.target.value }))}
                placeholder="-79.922359"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rangoPermitido">Rango permitido (metros)</Label>
            <Input
              id="rangoPermitido"
              type="number"
              value={formData.rangoPermitido}
              onChange={(e) => setFormData((prev) => ({ ...prev, rangoPermitido: e.target.value }))}
              placeholder="100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData((prev) => ({ ...prev, descripcion: e.target.value }))}
              placeholder="Descripción del evento..."
              rows={3}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear Evento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
