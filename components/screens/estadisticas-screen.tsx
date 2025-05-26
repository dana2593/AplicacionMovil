"use client"

import { useState, useEffect } from "react"
import { BarChart3, TrendingUp, ShoppingBag, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { apiService } from "@/services/api-service"
import type { EstadisticasCompras } from "@/types/models"

export function EstadisticasScreen() {
  const [estadisticas, setEstadisticas] = useState<EstadisticasCompras | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadEstadisticas()
  }, [])

  const loadEstadisticas = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiService.getEstadisticasCompras()
      if (response.success && response.data) {
        setEstadisticas(response.data)
      } else {
        setError(response.error || "Error al cargar estadísticas")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(price)
  }

  const getMonthName = (month: number) => {
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ]
    return months[month - 1]
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <BarChart3 size={24} className="text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Estadísticas</h2>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando estadísticas...</p>
        </div>
      )}

      {estadisticas && (
        <>
          {/* Resumen General */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Total Compras</p>
                    <p className="text-2xl font-bold text-blue-800">{estadisticas.totalCompras}</p>
                  </div>
                  <div className="bg-blue-200 p-2 rounded-full">
                    <ShoppingBag size={20} className="text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Total Ventas</p>
                    <p className="text-xl font-bold text-green-800">{formatPrice(estadisticas.totalVentas)}</p>
                  </div>
                  <div className="bg-green-200 p-2 rounded-full">
                    <DollarSign size={20} className="text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ventas por Mes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp size={20} />
                <span>Ventas por Mes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {estadisticas.ventasPorMes.map((venta, index) => {
                  const maxVenta = Math.max(...estadisticas.ventasPorMes.map((v) => v.totalVentas))
                  const percentage = (venta.totalVentas / maxVenta) * 100

                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">
                          {getMonthName(venta.mes)} {venta.año}
                        </span>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-green-600">{formatPrice(venta.totalVentas)}</p>
                          <p className="text-xs text-gray-500">{venta.cantidadCompras} compras</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Promedio por Compra */}
          {estadisticas.totalCompras > 0 && (
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-purple-600 font-medium">Promedio por Compra</p>
                  <p className="text-2xl font-bold text-purple-800">
                    {formatPrice(estadisticas.totalVentas / estadisticas.totalCompras)}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {!estadisticas && !loading && (
        <div className="text-center py-8">
          <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No hay datos estadísticos disponibles</p>
        </div>
      )}
    </div>
  )
}
