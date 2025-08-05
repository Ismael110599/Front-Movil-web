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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Check } from "lucide-react"
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
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSendVerification = async () => {
    if (!formData.email) return

    setIsVerifying(true)
    try {

      setShowVerification(true)
    } catch (error) {
      console.error("Error sending verification code:", error)
      alert("No se pudo enviar el código de verificación")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!verificationCode) return

    setIsLoading(true)
    try {
      const response = await apiService.verifyEmail(formData.email, verificationCode)
      if (response.success) {
        setIsVerified(true)
      } else {
        alert(response.message || "Código incorrecto")
      }
    } catch (error) {
      console.error("Error verifying code:", error)
      alert("Error al verificar el código")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isVerified) return

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
          id: response.data?.id || Date.now().toString(),
          name: formData.name,
          email: formData.email,
          createdAt: new Date().toISOString().split("T")[0],
          verified: true,
          eventsAssigned: 0,
        }
        onSuccess(newDocente)
        onOpenChange(false)

        // Reset form
        setFormData({ name: "", email: "", password: "" })
        setVerificationCode("")
        setIsVerified(false)
        setShowVerification(false)
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
          <DialogDescription>Complete la información del docente y verifique su correo electrónico.</DialogDescription>
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
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="juan.perez@universidad.edu"
                required
                disabled={isVerified}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleSendVerification}
                disabled={!formData.email || isVerifying || isVerified}
              >
                {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isVerified ? <Check className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {showVerification && !isVerified && (
            <div className="space-y-2">
              <Label htmlFor="verification">Código de verificación</Label>
              <div className="flex gap-2">
                <Input
                  id="verification"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Ingrese el código recibido"
                  maxLength={6}
                />
                <Button type="button" onClick={handleVerifyCode} disabled={!verificationCode || isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verificar
                </Button>
              </div>
            </div>
          )}

          {isVerified && (
            <Alert>
              <Check className="h-4 w-4" />
              <AlertDescription>Correo verificado correctamente</AlertDescription>
            </Alert>
          )}

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
            <Button type="submit" disabled={!isVerified || isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear Docente
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
