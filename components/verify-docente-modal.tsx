"use client"

import { useState, useEffect } from "react"
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

interface VerifyDocenteModalProps {
  docente: Docente | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onVerified: (id: string) => void
}

export function VerifyDocenteModal({ docente, open, onOpenChange, onVerified }: VerifyDocenteModalProps) {
  const [code, setCode] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    if (!open) {
      setCode("")
      setIsSending(false)
      setIsVerifying(false)
      setVerified(false)
    }
  }, [open])

  const handleSend = async () => {
    if (!docente) return
    setIsSending(true)
    try {
      await apiService.sendDocenteVerificationCode(docente.email)
    } catch (error) {
      console.error("Error sending verification code", error)
      alert("No se pudo enviar el código de verificación")
    } finally {
      setIsSending(false)
    }
  }

  const handleVerify = async () => {
    if (!docente || !code) return
    setIsVerifying(true)
    try {
      const response = await apiService.verifyEmail(docente.email, code)
      if (response.success) {
        setVerified(true)
        onVerified(docente.id)
      } else {
        alert(response.message || "Código incorrecto")
      }
    } catch (error) {
      console.error("Error verifying code", error)
      alert("Error al verificar el código")
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verificar correo</DialogTitle>
          <DialogDescription>
            {docente?.email}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleSend} disabled={isSending || verified}>
              {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {verified ? <Check className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
            </Button>
            <div className="flex-1">
              <Label htmlFor="code">Código de verificación</Label>
              <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} maxLength={6} />
            </div>
          </div>

          <Button onClick={handleVerify} disabled={!code || isVerifying || verified} className="w-full">
            {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verificar
          </Button>

          {verified && (
            <Alert>
              <Check className="h-4 w-4" />
              <AlertDescription>Correo verificado correctamente</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
