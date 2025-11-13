import { IProductos } from "./product.type";

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