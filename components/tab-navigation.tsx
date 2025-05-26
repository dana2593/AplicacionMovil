"use client"

import { Users, Package, ShoppingCart, BarChart3 } from "lucide-react"

interface TabNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: "usuarios", label: "Usuarios", icon: Users },
    { id: "productos", label: "Productos", icon: Package },
    { id: "compras", label: "Compras", icon: ShoppingCart },
    { id: "estadisticas", label: "Stats", icon: BarChart3 },
  ]

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200">
      <div className="flex justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive ? "text-blue-600 bg-blue-50" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
