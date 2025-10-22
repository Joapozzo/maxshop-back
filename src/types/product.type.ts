import { EstadoGeneral, IIva, IMarca } from ".";
import { ICategoria, ISubcategoria } from "./categoria.type";

export interface IProductos {
    id_prod: number;
    id_cat?: number | null;
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

export interface ICrearProductoContenido {
    marcas: IMarca[];
    categorias: ICategoria[];
    subcategorias: ISubcategoria[];
    ivas: IIva[];
}

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

// Para crear producto
export interface ICreateProductoDTO {
    id_cat: number;
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