"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { apiService } from "@/lib/api-service"
import type { User } from "@/types"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Verificar si hay usuario guardado y token válido
    const savedUser = localStorage.getItem("user")
    const token = localStorage.getItem("auth_token")

    if (savedUser && token) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
        apiService.setToken(token)
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("user")
        localStorage.removeItem("auth_token")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await apiService.login(email, password)

      if (response.token && response.usuario) {
        const userData: User = {
          id: response.usuario.id,
          name: response.usuario.nombre,
          email: response.usuario.correo,
          role: response.usuario.rol === "admin" ? "admin" : "docente",
          avatar: `/placeholder.svg?height=40&width=40&text=${response.usuario.nombre.charAt(0).toUpperCase()}`,
        }

        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        setIsLoading(false)
        return true
      }

      setError("Respuesta inválida del servidor")
      setIsLoading(false)
      return false
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "Error al iniciar sesión")
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    apiService.logout()
    setUser(null)
    setError(null)
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
