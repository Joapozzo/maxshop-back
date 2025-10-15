// src/services/categorias.service.ts
import { prisma } from '../index';
import { 
    ICategoria, 
    ISubcategoria,
    ICreateCategoriaDTO, 
    IUpdateCategoriaDTO,
    ICreateSubcategoriaDTO,
    IUpdateSubcategoriaDTO
} from '../types';

export class CategoriasService {
    
    // ========================================
    // MÉTODOS PARA CATEGORÍAS
    // ========================================
    
    async getAllCategorias(): Promise<ICategoria[]> {
        const categorias = await prisma.categoria.findMany({
            orderBy: {
                nombre: 'asc'
            }
        });
        return categorias as ICategoria[];
    }

    async getCategoriaById(id: number): Promise<ICategoria | null> {
        const categoria = await prisma.categoria.findFirst({
            where: { id_cat: id }
        });
        return categoria as ICategoria | null;
    }

    async createCategoria(data: ICreateCategoriaDTO): Promise<ICategoria> {
        const nuevaCategoria = await prisma.categoria.create({
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion
            }
        });
        return nuevaCategoria as ICategoria;
    }

    async updateCategoria(id: number, data: IUpdateCategoriaDTO): Promise<ICategoria> {
        const categoriaActualizada = await prisma.categoria.update({
            where: { id_cat: id },
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion
            }
        });
        return categoriaActualizada as ICategoria;
    }

    async deleteCategoria(id: number): Promise<void> {
        const subcategoriasCount = await prisma.subcategoria.count({
            where: { id_cat: id }
        });

        if (subcategoriasCount > 0) {
            throw new Error(`No se puede eliminar la categoría porque tiene ${subcategoriasCount} subcategoría(s) asociada(s)`);
        }

        await prisma.categoria.delete({
            where: { id_cat: id }
        });
    }

    async categoriaExists(id: number): Promise<boolean> {
        const count = await prisma.categoria.count({
            where: { id_cat: id }
        });
        return count > 0;
    }

    // ========================================
    // MÉTODOS PARA SUBCATEGORÍAS
    // ========================================
    
    async getAllSubcategorias(id_cat?: number): Promise<ISubcategoria[]> {
        const whereClause: any = {};
        
        if (id_cat) {
            whereClause.id_cat = id_cat;
        }

        const subcategorias = await prisma.subcategoria.findMany({
            where: whereClause,
            include: {
                categoria: true
            },
            orderBy: {
                nombre: 'asc'
            }
        });
        return subcategorias as ISubcategoria[];
    }

    async getSubcategoriaById(id: number): Promise<ISubcategoria | null> {
        const subcategoria = await prisma.subcategoria.findFirst({
            where: { id_subcat: id },
            include: {
                categoria: true
            }
        });
        return subcategoria as ISubcategoria | null;
    }

    async createSubcategoria(data: ICreateSubcategoriaDTO): Promise<ISubcategoria> {
        const categoriaExists = await this.categoriaExists(data.id_cat);

        if (!categoriaExists) {
            throw new Error('La categoría especificada no existe');
        }

        const nuevaSubcategoria = await prisma.subcategoria.create({
            data: {
                id_cat: data.id_cat,
                nombre: data.nombre,
                descripcion: data.descripcion
            },
            include: {
                categoria: true
            }
        });
        return nuevaSubcategoria as ISubcategoria;
    }

    async updateSubcategoria(id: number, data: IUpdateSubcategoriaDTO): Promise<ISubcategoria> {
        if (data.id_cat) {
            const categoriaExists = await this.categoriaExists(data.id_cat);

            if (!categoriaExists) {
                throw new Error('La categoría especificada no existe');
            }
        }

        const subcategoriaActualizada = await prisma.subcategoria.update({
            where: { id_subcat: id },
            data: {
                id_cat: data.id_cat,
                nombre: data.nombre,
                descripcion: data.descripcion
            },
            include: {
                categoria: true
            }
        });
        return subcategoriaActualizada as ISubcategoria;
    }

    async deleteSubcategoria(id: number): Promise<void> {
        const productosCount = await prisma.productos.count({
            where: { id_subcat: id }
        });

        if (productosCount > 0) {
            throw new Error(`No se puede eliminar la subcategoría porque tiene ${productosCount} producto(s) asociado(s)`);
        }

        await prisma.subcategoria.delete({
            where: { id_subcat: id }
        });
    }

    async subcategoriaExists(id: number): Promise<boolean> {
        const count = await prisma.subcategoria.count({
            where: { id_subcat: id }
        });
        return count > 0;
    }
}