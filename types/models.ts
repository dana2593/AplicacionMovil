// Modelos/Interfaces para las entidades del sistema

export interface Usuario {
  id: number
  nombreUsuario: string
  email: string
  telefono: string
}

export interface CreateUsuarioDto {
  nombreUsuario: string
  email: string
  contraseña: string
  telefono: string
}

export interface UpdateUsuarioDto {
  nombreUsuario: string
  email: string
  contraseña?: string
  telefono: string
}

export interface Producto {
  id: number
  usuarioId: number
  nombreUsuario: string
  nombreProducto: string
  descripcion: string
  precio: number
  tipoProducto: string
  categoria: string
  imagenUrl: string
  fechaPublicacion: string
  disponibilidad: boolean
}

export interface CreateProductoDto {
  usuarioId: number
  nombreProducto: string
  descripcion: string
  precio: number
  tipoProducto: string
  categoria: string
  imagenUrl: string
  disponibilidad: boolean
}

export interface UpdateProductoDto {
  usuarioId: number
  nombreProducto: string
  descripcion: string
  precio: number
  tipoProducto: string
  categoria: string
  imagenUrl: string
  disponibilidad: boolean
}

export interface Compra {
  id: number
  usuarioId: number
  nombreUsuario: string
  productoId: number
  nombreProducto: string
  precioProducto: number
  fechaCompra: string
}

export interface CreateCompraDto {
  usuarioId: number
  productoId: number
}

export interface EstadisticasCompras {
  totalCompras: number
  totalVentas: number
  ventasPorMes: VentaMensual[]
}

export interface VentaMensual {
  año: number
  mes: number
  totalVentas: number
  cantidadCompras: number
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  success: boolean
}
