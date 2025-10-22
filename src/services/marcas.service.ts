// src/services/marcas.service.ts
import { prisma } from '../index';
import { IMarca, ICreateMarcaDTO, IUpdateMarcaDTO } from '../types';

export class MarcasService {
    
    async getAll(): Promise<IMarca[]> {
        const marcas = await prisma.marca.findMany({
            orderBy: {
                nombre: 'asc'
            }
        });
        return marcas as IMarca[];
    }

    async getById(id: number): Promise<IMarca | null> {
        const marca = await prisma.marca.findFirst({
            where: { id_marca: id }
        });
        return marca as IMarca | null;
    }

    async create(data: ICreateMarcaDTO): Promise<IMarca> {
        const nuevaMarca = await prisma.marca.create({
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion 
            }
        });
        return nuevaMarca as IMarca;
    }

    async update(id: number, data: IUpdateMarcaDTO): Promise<IMarca> {
        const marcaActualizada = await prisma.marca.update({
            where: { id_marca: id },
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion  
            }
        });
        return marcaActualizada as IMarca;
    }

    async delete(id: number): Promise<void> {
        // Verificar si hay productos usando esta marca
        const productosCount = await prisma.productos.count({
            where: { id_marca: id }
        });

        if (productosCount > 0) {
            throw new Error(`No se puede eliminar la marca porque tiene ${productosCount} producto(s) asociado(s)`);
        }

        await prisma.marca.delete({
            where: { id_marca: id }
        });
    }

    async exists(id: number): Promise<boolean> {
        const count = await prisma.marca.count({
            where: { id_marca: id }
        });
        return count > 0;
    }
}