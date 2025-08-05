"use client"

import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "@/components/login-form"
import { DashboardHeader } from "@/components/dashboard-header"
import { AppSidebar } from "@/components/app-sidebar"
import { EnhancedDashboard } from "@/components/enhanced-dashboard"
import { DocentesManagement } from "@/components/docentes-management"
import { EventsManagement } from "@/components/events-management"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { useState } from "react"

export default function Home() {
  const { user, isLoading } = useAuth()
  const [currentView, setCurrentView] = useState("dashboard")

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <EnhancedDashboard />
      case "docentes":
        return user.role === "admin" ? <DocentesManagement /> : <EnhancedDashboard />
      case "eventos":
        return user.role === "admin" ? <EventsManagement /> : <EnhancedDashboard />
      case "reportes":
        return (
          <div className="flex-1 p-6">
            <h2 className="text-3xl font-bold tracking-tight">Reportes</h2>
            <p className="text-muted-foreground mt-2">Sección de reportes en desarrollo...</p>
          </div>
        )
      case "mis-eventos":
        return (
          <div className="flex-1 p-6">
            <h2 className="text-3xl font-bold tracking-tight">Mis Eventos</h2>
            <p className="text-muted-foreground mt-2">Vista de eventos del docente en desarrollo...</p>
          </div>
        )
      case "configuracion":
        return (
          <div className="flex-1 p-6">
            <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
            <p className="text-muted-foreground mt-2">Panel de configuración en desarrollo...</p>
          </div>
        )
      default:
        return <EnhancedDashboard />
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar currentView={currentView} onViewChange={setCurrentView} />
      <SidebarInset>
        <DashboardHeader />
        {renderContent()}
      </SidebarInset>
    </SidebarProvider>
  )
}
