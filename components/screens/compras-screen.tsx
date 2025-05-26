"use client"

import { useState, useEffect } from "react"
import { Plus, ShoppingCart, Calendar, User, Package, Tag, ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { apiService } from "@/services/api-service"
import type { Compra, Producto, Usuario, CreateCompraDto } from "@/types/models"

export function ComprasScreen() {
  const [compras, setCompras] = useState<Compra[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [categorias, setCategorias] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Estados para el flujo de compra
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedCategoria, setSelectedCategoria] = useState<string>("")
  const [selectedUsuario, setSelectedUsuario] = useState<number>(0)
  const [productosCategoria, setProductosCategoria] = useState<Producto[]>([])
  const [step, setStep] = useState<"categoria" | "usuario" | "producto">("categoria")

  useEffect(() => {
    loadCompras()
    loadProductos()
    loadUsuarios()
  }, [])

  useEffect(() => {
    if (productos.length > 0) {
      // Extraer categorías únicas de los productos disponibles
      const categoriasUnicas = [
        ...new Set(
          productos
            .filter((p) => p.disponibilidad)
            .map((p) => p.categoria)
            .filter((c) => c && c.trim() !== ""),
        ),
      ].sort()
      setCategorias(categoriasUnicas)
    }
  }, [productos])

  const loadCompras = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiService.getCompras()
      if (response.success && response.data) {
        setCompras(response.data)
      } else {
        setError(response.error || "Error al cargar compras")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const loadProductos = async () => {
    try {
      const response = await apiService.getProductos()
      if (response.success && response.data) {
        setProductos(response.data)
      }
    } catch (err) {
      console.error("Error al cargar productos:", err)
    }
  }

  const loadUsuarios = async () => {
    try {
      const response = await apiService.getUsuarios()
      if (response.success && response.data) {
        setUsuarios(response.data)
      }
    } catch (err) {
      console.error("Error al cargar usuarios:", err)
    }
  }

  const handleCategoriaSelect = (categoria: string) => {
    setSelectedCategoria(categoria)
    setStep("usuario")
  }

  const handleUsuarioSelect = (usuarioId: string) => {
    setSelectedUsuario(Number.parseInt(usuarioId))
    // Filtrar productos por categoría seleccionada y que estén disponibles
    const productosFiltrados = productos.filter((p) => p.categoria === selectedCategoria && p.disponibilidad)
    setProductosCategoria(productosFiltrados)
    setStep("producto")
  }

  const handleCreateCompra = async (productoId: number) => {
    if (!selectedUsuario || !productoId) {
      setError("Debe seleccionar un usuario y un producto")
      return
    }

    const createCompraDto: CreateCompraDto = {
      usuarioId: selectedUsuario,
      productoId: productoId,
    }

    setLoading(true)
    try {
      const response = await apiService.createCompra(createCompraDto)
      if (response.success) {
        await loadCompras()
        setIsCreateDialogOpen(false)
        resetForm()
      } else {
        setError(response.error || "Error al crear compra")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedCategoria("")
    setSelectedUsuario(0)
    setProductosCategoria([])
    setStep("categoria")
    setError(null)
  }

  const goBack = () => {
    if (step === "usuario") {
      setStep("categoria")
      setSelectedCategoria("")
    } else if (step === "producto") {
      setStep("usuario")
      setSelectedUsuario(0)
      setProductosCategoria([])
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-CO")
  }

  const totalVentas = compras.reduce((sum, compra) => sum + compra.precioProducto, 0)

  const CompraForm = () => (
    <div className="space-y-4">
      {step === "categoria" && (
        <div>
          <Label>Selecciona una Categoría</Label>
          <div className="grid grid-cols-1 gap-2 mt-2 max-h-60 overflow-y-auto">
            {categorias.map((categoria) => (
              <Button
                key={categoria}
                variant="outline"
                className="justify-start h-auto p-3"
                onClick={() => handleCategoriaSelect(categoria)}
              >
                <Tag size={16} className="mr-2" />
                <div className="text-left">
                  <div className="font-medium">{categoria}</div>
                  <div className="text-xs text-gray-500">
                    {productos.filter((p) => p.categoria === categoria && p.disponibilidad).length} productos
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {step === "usuario" && (
        <div>
          <div className="flex items-center mb-4">
            <Button variant="ghost" size="sm" onClick={goBack}>
              <ArrowLeft size={16} className="mr-1" />
              Volver
            </Button>
            <Badge variant="outline" className="ml-2">
              {selectedCategoria}
            </Badge>
          </div>
          <Label>Selecciona un Usuario</Label>
          <Select onValueChange={handleUsuarioSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un usuario" />
            </SelectTrigger>
            <SelectContent>
              {usuarios.map((usuario) => (
                <SelectItem key={usuario.id} value={usuario.id.toString()}>
                  <div className="flex items-center">
                    <User size={16} className="mr-2" />
                    {usuario.nombreUsuario}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {step === "producto" && (
        <div>
          <div className="flex items-center mb-4">
            <Button variant="ghost" size="sm" onClick={goBack}>
              <ArrowLeft size={16} className="mr-1" />
              Volver
            </Button>
            <div className="flex items-center ml-2 space-x-2">
              <Badge variant="outline">{selectedCategoria}</Badge>
              <Badge variant="outline">{usuarios.find((u) => u.id === selectedUsuario)?.nombreUsuario}</Badge>
            </div>
          </div>
          <Label>Selecciona un Producto</Label>
          <div className="grid grid-cols-1 gap-2 mt-2 max-h-60 overflow-y-auto">
            {productosCategoria.map((producto) => (
              <Button
                key={producto.id}
                variant="outline"
                className="justify-start h-auto p-3"
                onClick={() => handleCreateCompra(producto.id)}
                disabled={loading}
              >
                <Package size={16} className="mr-2" />
                <div className="text-left flex-1">
                  <div className="font-medium">{producto.nombreProducto}</div>
                  <div className="text-sm text-gray-600">{producto.descripcion}</div>
                  <div className="text-sm font-semibold text-green-600">{formatPrice(producto.precio)}</div>
                </div>
              </Button>
            ))}
          </div>
          {productosCategoria.length === 0 && (
            <div className="text-center py-4 text-gray-500">No hay productos disponibles en esta categoría</div>
          )}
        </div>
      )}
    </div>
  )

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Compras</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus size={16} className="mr-2" />
              Nueva Compra
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Realizar Compra</DialogTitle>
            </DialogHeader>
            <CompraForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Resumen */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total en Ventas</p>
              <p className="text-2xl font-bold text-green-600">{formatPrice(totalVentas)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Compras</p>
              <p className="text-2xl font-bold text-purple-600">{compras.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando compras...</p>
        </div>
      )}

      <div className="space-y-3">
        {compras.map((compra) => (
          <Card key={compra.id} className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 p-2 rounded-full flex-shrink-0">
                  <ShoppingCart size={20} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{compra.nombreProducto}</h3>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <User size={14} className="mr-1" />
                          {compra.nombreUsuario}
                        </div>
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {formatDate(compra.fechaCompra)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{formatPrice(compra.precioProducto)}</p>
                      <Badge variant="outline" className="text-xs">
                        ID: {compra.id}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {compras.length === 0 && !loading && (
        <div className="text-center py-8">
          <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No hay compras registradas</p>
        </div>
      )}
    </div>
  )
}
