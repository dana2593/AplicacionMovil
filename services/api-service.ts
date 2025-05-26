import type {
  Usuario,
  CreateUsuarioDto,
  UpdateUsuarioDto,
  Producto,
  CreateProductoDto,
  UpdateProductoDto,
  Compra,
  CreateCompraDto,
  EstadisticasCompras,
  ApiResponse,
} from "@/types/models"

// Configuración base de la API
const API_BASE_URL = "http://localhost:5027/api" // URL del backend ASP.NET Core

class ApiService {
  private async fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        let errorText = "Error desconocido"
        try {
          const errorData = await response.text()
          if (errorData) {
            const parsedError = JSON.parse(errorData)
            errorText = parsedError.message || errorText
          }
        } catch {
          errorText = `Error ${response.status}: ${response.statusText}`
        }

        return {
          success: false,
          error: errorText,
        }
      }

      // Handle empty responses (like 204 No Content)
      if (response.status === 204 || response.headers.get("content-length") === "0") {
        return {
          success: true,
          data: undefined as T,
        }
      }

      // Try to parse JSON only if there's content
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json()
        return {
          success: true,
          data,
        }
      }

      // For non-JSON responses, return success without data
      return {
        success: true,
        data: undefined as T,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error de conexión",
      }
    }
  }

  // ===== USUARIOS API =====
  async getUsuarios(): Promise<ApiResponse<Usuario[]>> {
    return this.fetchApi<Usuario[]>("/UsuariosApi")
  }

  async getUsuario(id: number): Promise<ApiResponse<Usuario>> {
    return this.fetchApi<Usuario>(`/UsuariosApi/${id}`)
  }

  async createUsuario(usuario: CreateUsuarioDto): Promise<ApiResponse<Usuario>> {
    return this.fetchApi<Usuario>("/UsuariosApi", {
      method: "POST",
      body: JSON.stringify(usuario),
    })
  }

  async updateUsuario(id: number, usuario: UpdateUsuarioDto): Promise<ApiResponse<void>> {
    return this.fetchApi<void>(`/UsuariosApi/${id}`, {
      method: "PUT",
      body: JSON.stringify(usuario),
    })
  }

  async deleteUsuario(id: number): Promise<ApiResponse<void>> {
    return this.fetchApi<void>(`/UsuariosApi/${id}`, {
      method: "DELETE",
    })
  }

  // ===== PRODUCTOS API =====
  async getProductos(): Promise<ApiResponse<Producto[]>> {
    return this.fetchApi<Producto[]>("/ProductosApi")
  }

  async getProducto(id: number): Promise<ApiResponse<Producto>> {
    return this.fetchApi<Producto>(`/ProductosApi/${id}`)
  }

  async getProductosByUsuario(usuarioId: number): Promise<ApiResponse<Producto[]>> {
    return this.fetchApi<Producto[]>(`/ProductosApi/usuario/${usuarioId}`)
  }

  async createProducto(producto: CreateProductoDto): Promise<ApiResponse<Producto>> {
    return this.fetchApi<Producto>("/ProductosApi", {
      method: "POST",
      body: JSON.stringify(producto),
    })
  }

  async updateProducto(id: number, producto: UpdateProductoDto): Promise<ApiResponse<void>> {
    return this.fetchApi<void>(`/ProductosApi/${id}`, {
      method: "PUT",
      body: JSON.stringify(producto),
    })
  }

  async deleteProducto(id: number): Promise<ApiResponse<void>> {
    return this.fetchApi<void>(`/ProductosApi/${id}`, {
      method: "DELETE",
    })
  }

  // ===== COMPRAS API =====
  async getCompras(): Promise<ApiResponse<Compra[]>> {
    return this.fetchApi<Compra[]>("/ComprasApi")
  }

  async getComprasByUsuario(usuarioId: number): Promise<ApiResponse<Compra[]>> {
    return this.fetchApi<Compra[]>(`/ComprasApi/usuario/${usuarioId}`)
  }

  async createCompra(compra: CreateCompraDto): Promise<ApiResponse<Compra>> {
    return this.fetchApi<Compra>("/ComprasApi", {
      method: "POST",
      body: JSON.stringify(compra),
    })
  }

  async getEstadisticasCompras(): Promise<ApiResponse<EstadisticasCompras>> {
    return this.fetchApi<EstadisticasCompras>("/ComprasApi/estadisticas")
  }
}

export const apiService = new ApiService()
