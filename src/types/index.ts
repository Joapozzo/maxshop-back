export type EstadoGeneral = 0 | 1;

export type EstadoPago = 'pendiente' | 'aprobado' | 'rechazado' | 'cancelado';

export type EstadoEnvio = 'pendiente' | 'preparando' | 'enviado' | 'en_transito' | 'entregado' | 'cancelado';

export type TipoVenta = 'presencial' | 'online' | 'telefono';

export type MetodoPago = 'efectivo' | 'tarjeta_debito' | 'tarjeta_credito' | 'transferencia' | 'mercadopago' | 'otro';

export type TipoDescuento = 'porcentaje' | 'monto_fijo';


export interface INegocio {
    id_neg: number;
    nombre?: string | null;
    direccion?: string | null;
    logo?: string | null;
    telefono?: string | null;
    cuit?: string | null;
    cond_iva?: string | null;
    email?: string | null;
    color_primario?: string | null;
    color_secundario?: string | null;
    token_pago?: string | null;
    token_envio?: string | null;
}

export interface IRoles {
    id_rol: number;
    nombre?: string | null;
    descripcion?: string | null;
}

export interface IUsuarios {
    id_usuario: string;
    nombre?: string | null;
    apellido?: string | null;
    email?: string | null;
    telefono?: number | null;
    username?: string | null;
    password?: string | null;
    id_rol?: number | null;
    estado?: EstadoGeneral | null;
    creado_en?: Date | null;
    actualizado_en?: Date | null;
    img?: string | null;
    ultimo_login?: Date | null;
    login_ip?: string | null;
    nacimiento?: Date | null;
    token?: string | null;
    token_expira?: Date | null;
    // Relaciones
    rol?: IRoles | null;
}

export interface IAdmin {
    id_admin?: string | null;
    id_usuario: string;
    // Relaciones
    usuario?: IUsuarios;
}

export interface ICliente {
    id_cliente?: string | null;
    id_usuario: string;
    direccion?: string | null;
    cod_postal?: number | null;
    ciudad?: string | null;
    provincia?: string | null;
    // Relaciones
    usuario?: IUsuarios;
}

export interface ICategoria {
    id_cat: number;
    nombre?: string | null;
    descripcion?: string | null;
    // Relaciones
    subcategorias?: ISubcategoria[];
}

export interface ISubcategoria {
    id_subcat: number;
    id_cat?: number | null;
    nombre?: string | null;
    descripcion?: string | null;
    // Relaciones
    categoria?: ICategoria | null;
    productos?: IProductos[];
}

export interface IIva {
    id_iva: number;
    nombre?: string | null;
    descripcion?: string | null;
}

export interface IMarca {
    id_marca: number;
    nombre?: string | null;
    descripcion?: string | null;
}

export interface IProductos {
    id_prod: number;
    id_subcat?: number | null;
    id_interno?: string | null;
    cod_sku?: string | null;
    nombre?: string | null;
    descripcion?: string | null;
    modelo?: string | null;
    id_marca?: number | null;
    precio_mayorista?: number | null;
    precio_minorista?: number | null;
    precio_evento?: number | null;
    precio?: number | null;
    id_iva?: number | null;
    stock?: number | null;
    stock_min?: number | null;
    stock_mayorista?: number | null;
    img_principal?: string | null;
    imagenes?: string[] | null; // JSONB
    destacado?: boolean | null;
    financiacion?: boolean | null;
    creado_en?: Date | null;
    actualizado_en?: Date | null;
    estado?: EstadoGeneral | null;
    // Relaciones
    subcategoria?: ISubcategoria | null;
    marca?: IMarca | null;
    iva?: IIva | null;
}

export interface IEventos {
    id_evento: number;
    nombre?: string | null;
    descripcion?: string | null;
    fecha_inicio?: Date | null;
    fecha_fin?: Date | null;
    tipo_descuento?: TipoDescuento | null;
    banner_img?: string | null;
    color_tema?: string | null;
    activo?: boolean | null;
    creado_en?: Date | null;
    url_publica?: string | null;
    // Relaciones
    reglas?: IReglasEvento[];
}

export interface IReglasEvento {
    id_regla: number;
    id_evento?: number | null;
    tipo_descuento?: TipoDescuento | null;
    valor_desc?: number | null;
    desc_regla?: string | null;
    condicion_extra?: any | null; // JSONB
    activo?: boolean | null;
    creado_en?: Date | null;
    // Relaciones
    evento?: IEventos | null;
    contenidos?: IReglasContenido[];
}

export interface IReglasContenido {
    id_contenido?: number | null;
    id_regla: number;
    tipo_objetivo?: string | null;
    id_objetivo?: number | null;
    // Relaciones
    regla?: IReglasEvento;
}

export interface IAuditoria {
    id_aud: number;
    id_usuario?: string | null;
    fecha?: Date | null;
    accion?: string | null;
    tabla_afectada?: string | null;
    dato_anterior?: any | null; // JSONB
    dato_despues?: any | null; // JSONB
    user_agent?: string | null;
    endpoint?: string | null;
    estado?: string | null;
    descripcion?: string | null;
    tiempo_procesamiento?: number | null;
    // Relaciones
    usuario?: IUsuarios | null;
}

export interface IVenta {
    id_venta: number;
    id_usuario?: string | null;
    fecha?: Date | null;
    id_cliente?: string | null;
    total_sin_iva?: number | null;
    total_con_iva?: number | null;
    descuento_total?: number | null;
    total_neto?: number | null;
    metodo_pago?: MetodoPago | null;
    estado_pago?: EstadoPago | null;
    estado_envio?: EstadoEnvio | null;
    id_envio?: string | null;
    tipo_venta?: TipoVenta | null;
    observaciones?: string | null;
    factura_url?: string | null;
    creado_en?: Date | null;
    actualizado_en?: Date | null;
    // Relaciones
    usuario?: IUsuarios | null;
    cliente?: ICliente | null;
    detalles?: IVentaDetalle[];
    envio?: IEnvios | null;
}

export interface IVentaDetalle {
    id_detalle: number;
    id_venta?: number | null;
    id_prod?: number | null;
    cantidad?: number | null;
    precio_unitario?: number | null;
    descuento_aplicado?: number | null;
    sub_total?: number | null;
    evento_aplicado?: number | null;
    tipo_descuento?: TipoDescuento | null;
    // Relaciones
    venta?: IVenta | null;
    producto?: IProductos | null;
    evento?: IEventos | null;
}

export interface IEnvios {
    id_envio: string;
    id_venta?: number | null;
    empresa_envio?: string | null;
    cod_seguimiento?: string | null;
    estado_envio?: EstadoEnvio | null;
    costo_envio?: number | null;
    direccion_envio?: string | null;
    fecha_envio?: Date | null;
    fecha_entrega?: Date | null;
    observaciones?: string | null;
    // Relaciones
    venta?: IVenta | null;
}

// =======================================
// DTOs (Data Transfer Objects)
// =======================================

// Para crear usuario
export interface ICreateUsuarioDTO {
    nombre: string;
    apellido: string;
    email: string;
    username: string;
    password: string;
    id_rol?: number;
    telefono?: number;
    nacimiento?: Date;
}

// Para login
export interface ILoginDTO {
    username: string;
    password: string;
}

// Para crear producto
export interface ICreateProductoDTO {
    id_subcat: number;
    nombre: string;
    descripcion?: string;
    id_marca?: number;
    precio: number;
    precio_mayorista?: number;
    precio_minorista?: number;
    id_iva?: number;
    stock: number;
    cod_sku?: string;
    img_principal?: string;
    imagenes?: string[];
    destacado?: boolean;
}

// Para actualizar producto
export interface IUpdateProductoDTO extends Partial<ICreateProductoDTO> {
    estado?: EstadoGeneral;
}

// Para crear venta
export interface ICreateVentaDTO {
    id_cliente?: string;
    metodo_pago: MetodoPago;
    tipo_venta: TipoVenta;
    observaciones?: string;
    detalles: IVentaDetalleDTO[];
}

export interface IVentaDetalleDTO {
    id_prod: number;
    cantidad: number;
    precio_unitario: number;
    descuento_aplicado?: number;
    evento_aplicado?: number;
}

// =======================================
// RESPUESTAS API
// =======================================

export interface IApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface IPaginatedResponse<T = any> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// =======================================
// AUTENTICACIÓN
// =======================================

export interface IJWTPayload {
    id_usuario: string;
    username: string;
    id_rol: number;
    email: string;
}

export interface IAuthResponse {
    token: string;
    usuario: Omit<IUsuarios, 'password'>;
}

// =======================================
// FILTROS Y QUERIES
// =======================================

export interface IProductoFilters {
    id_subcat?: number;
    id_cat?: number;
    id_marca?: number;
    precio_min?: number;
    precio_max?: number;
    destacado?: boolean;
    busqueda?: string;
    estado?: EstadoGeneral;
    page?: number;
    limit?: number;
    order_by?: 'precio' | 'nombre' | 'creado_en';
    order?: 'asc' | 'desc';
}

export interface IVentaFilters {
    id_cliente?: string;
    fecha_desde?: Date;
    fecha_hasta?: Date;
    estado_pago?: EstadoPago;
    metodo_pago?: MetodoPago;
    page?: number;
    limit?: number;
}


// =======================================
// DTOs para Marcas
// =======================================

export interface ICreateMarcaDTO {
    nombre: string;
    descripcion?: string;
}

export interface IUpdateMarcaDTO {
    nombre?: string;
    descripcion?: string;
}

// =======================================
// DTOs para Categorías y Subcategorías
// =======================================

export interface ICreateCategoriaDTO {
    nombre: string;
    descripcion?: string;
}

export interface IUpdateCategoriaDTO {
    nombre?: string;
    descripcion?: string;
}

export interface ICreateSubcategoriaDTO {
    id_cat: number;
    nombre: string;
    descripcion?: string;
}

export interface IUpdateSubcategoriaDTO {
    id_cat?: number;
    nombre?: string;
    descripcion?: string;
}

// =======================================
// Respuesta para cargar el formulario de crear productos
// =======================================

export interface ICrearProductoContenido {
    marcas: IMarca[];
    categorias: ICategoria[];
    subcategorias: ISubcategoria[];
    ivas: IIva[];
}