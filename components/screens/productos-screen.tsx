"use client"

import { useState, useEffect, useMemo } from "react"
import { Plus, Edit, Trash2, Package, DollarSign, Tag, Calendar, User, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { apiService } from "@/services/api-service"
import type { Producto, CreateProductoDto, UpdateProductoDto, Usuario } from "@/types/models"

// Componente de formulario para crear - FUERA del componente principal
function CreateProductForm({
  formData,
  onInputChange,
  usuarios,
  onSubmit,
  loading,
}: {
  formData: CreateProductoDto
  onInputChange: (field: keyof CreateProductoDto, value: string | number | boolean) => void
  usuarios: Usuario[]
  onSubmit: () => void
  loading: boolean
}) {
  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      <div>
        <Label htmlFor="create-usuarioId">Usuario</Label>
        <Select
          value={formData.usuarioId > 0 ? formData.usuarioId.toString() : ""}
          onValueChange={(value) => onInputChange("usuarioId", Number.parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un usuario" />
          </SelectTrigger>
          <SelectContent>
            {usuarios.map((usuario) => (
              <SelectItem key={usuario.id} value={usuario.id.toString()}>
                {usuario.nombreUsuario}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="create-nombreProducto">Nombre del Producto</Label>
        <Input
          id="create-nombreProducto"
          value={formData.nombreProducto}
          onChange={(e) => onInputChange("nombreProducto", e.target.value)}
          placeholder="Ingresa el nombre del producto"
        />
      </div>

      <div>
        <Label htmlFor="create-descripcion">Descripción</Label>
        <Textarea
          id="create-descripcion"
          value={formData.descripcion}
          onChange={(e) => onInputChange("descripcion", e.target.value)}
          placeholder="Describe el producto"
          rows={3}
          className="resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="create-precio">Precio</Label>
          <Input
            id="create-precio"
            type="number"
            min="0"
            step="0.01"
            value={formData.precio > 0 ? formData.precio.toString() : ""}
            onChange={(e) => {
              const value = e.target.value
              onInputChange("precio", value === "" ? 0 : Number.parseFloat(value))
            }}
            placeholder="0.00"
          />
        </div>

        <div>
          <Label htmlFor="create-categoria">Categoría</Label>
          <Input
            id="create-categoria"
            value={formData.categoria}
            onChange={(e) => onInputChange("categoria", e.target.value)}
            placeholder="Ej: Comida rápida"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="create-tipoProducto">Tipo de Producto</Label>
        <Input
          id="create-tipoProducto"
          value={formData.tipoProducto}
          onChange={(e) => onInputChange("tipoProducto", e.target.value)}
          placeholder="Ej: Físico, Digital"
        />
      </div>

      <div>
        <Label htmlFor="create-imagenUrl">URL de la Imagen</Label>
        <Input
          id="create-imagenUrl"
          type="url"
          value={formData.imagenUrl}
          onChange={(e) => onInputChange("imagenUrl", e.target.value)}
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="create-disponibilidad"
          checked={formData.disponibilidad}
          onCheckedChange={(checked) => onInputChange("disponibilidad", checked as boolean)}
        />
        <Label htmlFor="create-disponibilidad">Producto disponible</Label>
      </div>

      <Button onClick={onSubmit} disabled={loading} className="w-full">
        {loading ? "Creando..." : "Crear Producto"}
      </Button>
    </div>
  )
}

// Componente de formulario para editar - FUERA del componente principal
function EditProductForm({
  formData,
  onInputChange,
  usuarios,
  onSubmit,
  loading,
}: {
  formData: CreateProductoDto
  onInputChange: (field: keyof CreateProductoDto, value: string | number | boolean) => void
  usuarios: Usuario[]
  onSubmit: () => void
  loading: boolean
}) {
  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      <div>
        <Label htmlFor="edit-usuarioId">Usuario</Label>
        <Select
          value={formData.usuarioId > 0 ? formData.usuarioId.toString() : ""}
          onValueChange={(value) => onInputChange("usuarioId", Number.parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un usuario" />
          </SelectTrigger>
          <SelectContent>
            {usuarios.map((usuario) => (
              <SelectItem key={usuario.id} value={usuario.id.toString()}>
                {usuario.nombreUsuario}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="edit-nombreProducto">Nombre del Producto</Label>
        <Input
          id="edit-nombreProducto"
          value={formData.nombreProducto}
          onChange={(e) => onInputChange("nombreProducto", e.target.value)}
          placeholder="Ingresa el nombre del producto"
        />
      </div>

      <div>
        <Label htmlFor="edit-descripcion">Descripción</Label>
        <Textarea
          id="edit-descripcion"
          value={formData.descripcion}
          onChange={(e) => onInputChange("descripcion", e.target.value)}
          placeholder="Describe el producto"
          rows={3}
          className="resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-precio">Precio</Label>
          <Input
            id="edit-precio"
            type="number"
            min="0"
            step="0.01"
            value={formData.precio > 0 ? formData.precio.toString() : ""}
            onChange={(e) => {
              const value = e.target.value
              onInputChange("precio", value === "" ? 0 : Number.parseFloat(value))
            }}
            placeholder="0.00"
          />
        </div>

        <div>
          <Label htmlFor="edit-categoria">Categoría</Label>
          <Input
            id="edit-categoria"
            value={formData.categoria}
            onChange={(e) => onInputChange("categoria", e.target.value)}
            placeholder="Ej: Comida rápida"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="edit-tipoProducto">Tipo de Producto</Label>
        <Input
          id="edit-tipoProducto"
          value={formData.tipoProducto}
          onChange={(e) => onInputChange("tipoProducto", e.target.value)}
          placeholder="Ej: Físico, Digital"
        />
      </div>

      <div>
        <Label htmlFor="edit-imagenUrl">URL de la Imagen</Label>
        <Input
          id="edit-imagenUrl"
          type="url"
          value={formData.imagenUrl}
          onChange={(e) => onInputChange("imagenUrl", e.target.value)}
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="edit-disponibilidad"
          checked={formData.disponibilidad}
          onCheckedChange={(checked) => onInputChange("disponibilidad", checked as boolean)}
        />
        <Label htmlFor="edit-disponibilidad">Producto disponible</Label>
      </div>

      <Button onClick={onSubmit} disabled={loading} className="w-full">
        {loading ? "Actualizando..." : "Actualizar Producto"}
      </Button>
    </div>
  )
}

export function ProductosScreen() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null)

  // Estados de formulario estables
  const [createFormData, setCreateFormData] = useState<CreateProductoDto>({
    usuarioId: 0,
    nombreProducto: "",
    descripcion: "",
    precio: 0,
    tipoProducto: "",
    categoria: "",
    imagenUrl: "",
    disponibilidad: true,
  })

  const [editFormData, setEditFormData] = useState<CreateProductoDto>({
    usuarioId: 0,
    nombreProducto: "",
    descripcion: "",
    precio: 0,
    tipoProducto: "",
    categoria: "",
    imagenUrl: "",
    disponibilidad: true,
  })

  // Handlers estables con useMemo
  const handleCreateInputChange = useMemo(
    () => (field: keyof CreateProductoDto, value: string | number | boolean) => {
      setCreateFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    },
    [],
  )

  const handleEditInputChange = useMemo(
    () => (field: keyof CreateProductoDto, value: string | number | boolean) => {
      setEditFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    },
    [],
  )

  useEffect(() => {
    loadProductos()
    loadUsuarios()
  }, [])

  const loadProductos = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiService.getProductos()
      if (response.success && response.data) {
        setProductos(response.data)
      } else {
        setError(response.error || "Error al cargar productos")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
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

  const handleCreateProducto = async () => {
    if (
      !createFormData.nombreProducto ||
      !createFormData.descripcion ||
      createFormData.precio <= 0 ||
      !createFormData.usuarioId
    ) {
      setError("Todos los campos son requeridos y el precio debe ser mayor a 0")
      return
    }

    setLoading(true)
    try {
      const response = await apiService.createProducto(createFormData)
      if (response.success) {
        await loadProductos()
        setIsCreateDialogOpen(false)
        resetCreateForm()
      } else {
        setError(response.error || "Error al crear producto")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (producto: Producto) => {
    setEditingProducto(producto)
    setEditFormData({
      usuarioId: producto.usuarioId,
      nombreProducto: producto.nombreProducto,
      descripcion: producto.descripcion,
      precio: producto.precio,
      tipoProducto: producto.tipoProducto,
      categoria: producto.categoria,
      imagenUrl: producto.imagenUrl,
      disponibilidad: producto.disponibilidad,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateProducto = async () => {
    if (!editingProducto) return

    const updateData: UpdateProductoDto = {
      usuarioId: editFormData.usuarioId,
      nombreProducto: editFormData.nombreProducto,
      descripcion: editFormData.descripcion,
      precio: editFormData.precio,
      tipoProducto: editFormData.tipoProducto,
      categoria: editFormData.categoria,
      imagenUrl: editFormData.imagenUrl,
      disponibilidad: editFormData.disponibilidad,
    }

    setLoading(true)
    try {
      const response = await apiService.updateProducto(editingProducto.id, updateData)
      if (response.success) {
        await loadProductos()
        setIsEditDialogOpen(false)
        resetEditForm()
      } else {
        setError(response.error || "Error al actualizar producto")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProducto = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este producto?")) return

    setLoading(true)
    try {
      const response = await apiService.deleteProducto(id)
      if (response.success) {
        await loadProductos()
      } else {
        setError(response.error || "Error al eliminar producto")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const resetCreateForm = () => {
    setCreateFormData({
      usuarioId: 0,
      nombreProducto: "",
      descripcion: "",
      precio: 0,
      tipoProducto: "",
      categoria: "",
      imagenUrl: "",
      disponibilidad: true,
    })
    setError(null)
  }

  const resetEditForm = () => {
    setEditFormData({
      usuarioId: 0,
      nombreProducto: "",
      descripcion: "",
      precio: 0,
      tipoProducto: "",
      categoria: "",
      imagenUrl: "",
      disponibilidad: true,
    })
    setEditingProducto(null)
    setError(null)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO")
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Productos</h2>
        <Dialog
          open={isCreateDialogOpen}
          onOpenChange={(open) => {
            setIsCreateDialogOpen(open)
            if (!open) resetCreateForm()
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus size={16} className="mr-2" />
              Nuevo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Producto</DialogTitle>
            </DialogHeader>
            <CreateProductForm
              formData={createFormData}
              onInputChange={handleCreateInputChange}
              usuarios={usuarios}
              onSubmit={handleCreateProducto}
              loading={loading}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando productos...</p>
        </div>
      )}

      {/* Products List */}
      <div className="space-y-3">
        {productos.map((producto) => (
          <Card key={producto.id} className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                  <Package size={20} className="text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 truncate">{producto.nombreProducto}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{producto.descripcion}</p>

                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <DollarSign size={14} className="mr-1" />
                          {formatPrice(producto.precio)}
                        </div>
                        <div className="flex items-center">
                          <Tag size={14} className="mr-1" />
                          {producto.categoria}
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <div className="flex items-center">
                          <User size={14} className="mr-1" />
                          {producto.nombreUsuario}
                        </div>
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {formatDate(producto.fechaPublicacion)}
                        </div>
                      </div>

                      {producto.imagenUrl && (
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <ImageIcon size={14} className="mr-1" />
                          <span className="truncate">Imagen disponible</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <Badge
                        variant={producto.disponibilidad ? "default" : "secondary"}
                        className={producto.disponibilidad ? "bg-green-500" : "bg-gray-500"}
                      >
                        {producto.disponibilidad ? "Disponible" : "No disponible"}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {producto.tipoProducto}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button variant="outline" size="sm" onClick={() => handleEditClick(producto)}>
                          <Edit size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProducto(producto.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open)
          if (!open) resetEditForm()
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
          </DialogHeader>
          <EditProductForm
            formData={editFormData}
            onInputChange={handleEditInputChange}
            usuarios={usuarios}
            onSubmit={handleUpdateProducto}
            loading={loading}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
