"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, User, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { apiService } from "@/services/api-service"
import type { Usuario, CreateUsuarioDto, UpdateUsuarioDto } from "@/types/models"

export function UsuariosScreen() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null)

  // Form states
  const [formData, setFormData] = useState<CreateUsuarioDto>({
    nombreUsuario: "",
    email: "",
    contraseña: "",
    telefono: "",
  })

  // Event Handler: Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsuarios()
  }, [])

  // Método asíncrono: Cargar usuarios
  const loadUsuarios = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiService.getUsuarios()
      if (response.success && response.data) {
        setUsuarios(response.data)
      } else {
        setError(response.error || "Error al cargar usuarios")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  // Event Handler: Manejar cambios en el formulario
  const handleInputChange = (field: keyof CreateUsuarioDto, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Método asíncrono: Crear usuario
  const handleCreateUsuario = async () => {
    if (!formData.nombreUsuario || !formData.email || !formData.contraseña || !formData.telefono) {
      setError("Todos los campos son requeridos")
      return
    }

    setLoading(true)
    try {
      const response = await apiService.createUsuario(formData)
      if (response.success) {
        await loadUsuarios()
        setIsCreateDialogOpen(false)
        resetForm()
      } else {
        setError(response.error || "Error al crear usuario")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  // Event Handler: Abrir diálogo de edición
  const handleEditClick = (usuario: Usuario) => {
    setEditingUsuario(usuario)
    setFormData({
      nombreUsuario: usuario.nombreUsuario,
      email: usuario.email,
      contraseña: "",
      telefono: usuario.telefono,
    })
    setIsEditDialogOpen(true)
  }

  // Método asíncrono: Actualizar usuario
  const handleUpdateUsuario = async () => {
    if (!editingUsuario) return

    const updateData: UpdateUsuarioDto = {
      nombreUsuario: formData.nombreUsuario,
      email: formData.email,
      telefono: formData.telefono,
      ...(formData.contraseña && { contraseña: formData.contraseña }),
    }

    setLoading(true)
    try {
      const response = await apiService.updateUsuario(editingUsuario.id, updateData)
      if (response.success) {
        await loadUsuarios()
        setIsEditDialogOpen(false)
        resetForm()
      } else {
        setError(response.error || "Error al actualizar usuario")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  // Método asíncrono: Eliminar usuario
  const handleDeleteUsuario = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este usuario?")) return

    setLoading(true)
    try {
      const response = await apiService.deleteUsuario(id)
      if (response.success) {
        await loadUsuarios()
      } else {
        setError(response.error || "Error al eliminar usuario")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      nombreUsuario: "",
      email: "",
      contraseña: "",
      telefono: "",
    })
    setEditingUsuario(null)
    setError(null)
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Usuarios</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus size={16} className="mr-2" />
              Nuevo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Usuario</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nombreUsuario">Nombre de Usuario</Label>
                <Input
                  id="nombreUsuario"
                  value={formData.nombreUsuario}
                  onChange={(e) => handleInputChange("nombreUsuario", e.target.value)}
                  placeholder="Ingresa el nombre de usuario"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="usuario@ejemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="contraseña">Contraseña</Label>
                <Input
                  id="contraseña"
                  type="password"
                  value={formData.contraseña}
                  onChange={(e) => handleInputChange("contraseña", e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange("telefono", e.target.value)}
                  placeholder="123-456-7890"
                />
              </div>
              <Button onClick={handleCreateUsuario} disabled={loading} className="w-full">
                {loading ? "Creando..." : "Crear Usuario"}
              </Button>
            </div>
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando...</p>
        </div>
      )}

      {/* Users List */}
      <div className="space-y-3">
        {usuarios.map((usuario) => (
          <Card key={usuario.id} className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{usuario.nombreUsuario}</h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Mail size={14} className="mr-1" />
                      {usuario.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone size={14} className="mr-1" />
                      {usuario.telefono}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(usuario)}>
                    <Edit size={14} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteUsuario(usuario.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-nombreUsuario">Nombre de Usuario</Label>
              <Input
                id="edit-nombreUsuario"
                value={formData.nombreUsuario}
                onChange={(e) => handleInputChange("nombreUsuario", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-contraseña">Nueva Contraseña (opcional)</Label>
              <Input
                id="edit-contraseña"
                type="password"
                value={formData.contraseña}
                onChange={(e) => handleInputChange("contraseña", e.target.value)}
                placeholder="Dejar vacío para mantener la actual"
              />
            </div>
            <div>
              <Label htmlFor="edit-telefono">Teléfono</Label>
              <Input
                id="edit-telefono"
                value={formData.telefono}
                onChange={(e) => handleInputChange("telefono", e.target.value)}
              />
            </div>
            <Button onClick={handleUpdateUsuario} disabled={loading} className="w-full">
              {loading ? "Actualizando..." : "Actualizar Usuario"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
