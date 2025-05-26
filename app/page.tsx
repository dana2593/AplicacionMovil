"use client"

import { useState } from "react"
import { TabNavigation } from "@/components/tab-navigation"
import { UsuariosScreen } from "@/components/screens/usuarios-screen"
import { ProductosScreen } from "@/components/screens/productos-screen"
import { ComprasScreen } from "@/components/screens/compras-screen"
import { EstadisticasScreen } from "@/components/screens/estadisticas-screen"

export default function MobileApp() {
  const [activeTab, setActiveTab] = useState("usuarios")

  const renderScreen = () => {
    switch (activeTab) {
      case "usuarios":
        return <UsuariosScreen />
      case "productos":
        return <ProductosScreen />
      case "compras":
        return <ComprasScreen />
      case "estadisticas":
        return <EstadisticasScreen />
      default:
        return <UsuariosScreen />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile App Container */}
      <div className="max-w-md mx-auto bg-white shadow-xl min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <h1 className="text-xl font-bold text-center">Sistema de Gestión</h1>
        </div>

        {/* Content */}
        <div className="flex-1 pb-20">{renderScreen()}</div>

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  )
}
