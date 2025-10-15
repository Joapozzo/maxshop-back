// src/controllers/categorias.controller.ts
import { Request, Response } from 'express';
import { CategoriasService } from '../services/categorias.service';
import { 
    ICreateCategoriaDTO, 
    IUpdateCategoriaDTO,
    ICreateSubcategoriaDTO,
    IUpdateSubcategoriaDTO,
    IApiResponse 
} from '../types';

const categoriasService = new CategoriasService();

export class CategoriasController {

    // ========================================
    // CONTROLADORES PARA CATEGORÍAS
    // ========================================

    async getAllCategorias(req: Request, res: Response): Promise<void> {
        try {
            console.log('🔍 Iniciando getAllCategorias...');
            const categorias = await categoriasService.getAllCategorias();
            console.log('✅ Categorías obtenidas:', categorias);
            console.log('📊 Cantidad:', categorias.length);
            
            const response: IApiResponse = {
                success: true,
                data: categorias
            };

            console.log('📤 Enviando respuesta...');
            res.json(response);
        } catch (error) {
            console.error('❌ Error en getAllCategorias:', error);
            console.error('📋 Tipo de error:', typeof error);
            console.error('📝 Mensaje:', error instanceof Error ? error.message : 'Sin mensaje');
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Error al obtener categorías'
            });
        }
    }

    async getCategoriaById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    error: 'ID inválido'
                });
                return;
            }

            const categoria = await categoriasService.getCategoriaById(id);

            if (!categoria) {
                res.status(404).json({
                    success: false,
                    error: 'Categoría no encontrada'
                });
                return;
            }

            const response: IApiResponse = {
                success: true,
                data: categoria
            };

            res.json(response);
        } catch (error) {
            console.error('Error en getCategoriaById:', error);
            res.status(500).json({
                success: false,
                error: 'Error al obtener categoría'
            });
        }
    }

    async createCategoria(req: Request, res: Response): Promise<void> {
        try {
            const data: ICreateCategoriaDTO = req.body;

            // Validaciones básicas
            if (!data.nombre || data.nombre.trim() === '') {
                res.status(400).json({
                    success: false,
                    error: 'El nombre es requerido'
                });
                return;
            }

            const nuevaCategoria = await categoriasService.createCategoria(data);

            const response: IApiResponse = {
                success: true,
                data: nuevaCategoria,
                message: 'Categoría creada exitosamente'
            };

            res.status(201).json(response);
        } catch (error) {
            console.error('Error en createCategoria:', error);
            res.status(500).json({
                success: false,
                error: 'Error al crear categoría'
            });
        }
    }

    async updateCategoria(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const data: IUpdateCategoriaDTO = req.body;

            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    error: 'ID inválido'
                });
                return;
            }

            // Verificar si existe
            const existe = await categoriasService.categoriaExists(id);
            if (!existe) {
                res.status(404).json({
                    success: false,
                    error: 'Categoría no encontrada'
                });
                return;
            }

            const categoriaActualizada = await categoriasService.updateCategoria(id, data);

            const response: IApiResponse = {
                success: true,
                data: categoriaActualizada,
                message: 'Categoría actualizada exitosamente'
            };

            res.json(response);
        } catch (error) {
            console.error('Error en updateCategoria:', error);
            res.status(500).json({
                success: false,
                error: 'Error al actualizar categoría'
            });
        }
    }

    async deleteCategoria(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    error: 'ID inválido'
                });
                return;
            }

            // Verificar si existe
            const existe = await categoriasService.categoriaExists(id);
            if (!existe) {
                res.status(404).json({
                    success: false,
                    error: 'Categoría no encontrada'
                });
                return;
            }

            await categoriasService.deleteCategoria(id);

            const response: IApiResponse = {
                success: true,
                message: 'Categoría eliminada exitosamente'
            };

            res.json(response);
        } catch (error) {
            console.error('Error en deleteCategoria:', error);
            
            // Si el error es por subcategorías asociadas, enviar mensaje específico
            if (error instanceof Error && error.message.includes('subcategoría(s) asociada(s)')) {
                res.status(400).json({
                    success: false,
                    error: error.message
                });
                return;
            }

            res.status(500).json({
                success: false,
                error: 'Error al eliminar categoría'
            });
        }
    }

    // ========================================
    // CONTROLADORES PARA SUBCATEGORÍAS
    // ========================================

    async getAllSubcategorias(req: Request, res: Response): Promise<void> {
        try {
            // Permitir filtrar por categoría si se proporciona
            const id_cat = req.query.id_cat ? parseInt(req.query.id_cat as string) : undefined;
            
            const subcategorias = await categoriasService.getAllSubcategorias(id_cat);
            
            const response: IApiResponse = {
                success: true,
                data: subcategorias
            };

            res.json(response);
        } catch (error) {
            console.error('Error en getAllSubcategorias:', error);
            res.status(500).json({
                success: false,
                error: 'Error al obtener subcategorías'
            });
        }
    }

    async getSubcategoriaById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    error: 'ID inválido'
                });
                return;
            }

            const subcategoria = await categoriasService.getSubcategoriaById(id);

            if (!subcategoria) {
                res.status(404).json({
                    success: false,
                    error: 'Subcategoría no encontrada'
                });
                return;
            }

            const response: IApiResponse = {
                success: true,
                data: subcategoria
            };

            res.json(response);
        } catch (error) {
            console.error('Error en getSubcategoriaById:', error);
            res.status(500).json({
                success: false,
                error: 'Error al obtener subcategoría'
            });
        }
    }

    async createSubcategoria(req: Request, res: Response): Promise<void> {
        try {
            const data: ICreateSubcategoriaDTO = req.body;

            // Validaciones básicas
            if (!data.nombre || data.nombre.trim() === '') {
                res.status(400).json({
                    success: false,
                    error: 'El nombre es requerido'
                });
                return;
            }

            if (!data.id_cat) {
                res.status(400).json({
                    success: false,
                    error: 'La categoría es requerida'
                });
                return;
            }

            const nuevaSubcategoria = await categoriasService.createSubcategoria(data);

            const response: IApiResponse = {
                success: true,
                data: nuevaSubcategoria,
                message: 'Subcategoría creada exitosamente'
            };

            res.status(201).json(response);
        } catch (error) {
            console.error('Error en createSubcategoria:', error);
            
            // Si el error es por categoría inexistente
            if (error instanceof Error && error.message.includes('categoría especificada no existe')) {
                res.status(400).json({
                    success: false,
                    error: error.message
                });
                return;
            }

            res.status(500).json({
                success: false,
                error: 'Error al crear subcategoría'
            });
        }
    }

    async updateSubcategoria(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const data: IUpdateSubcategoriaDTO = req.body;

            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    error: 'ID inválido'
                });
                return;
            }

            // Verificar si existe
            const existe = await categoriasService.subcategoriaExists(id);
            if (!existe) {
                res.status(404).json({
                    success: false,
                    error: 'Subcategoría no encontrada'
                });
                return;
            }

            const subcategoriaActualizada = await categoriasService.updateSubcategoria(id, data);

            const response: IApiResponse = {
                success: true,
                data: subcategoriaActualizada,
                message: 'Subcategoría actualizada exitosamente'
            };

            res.json(response);
        } catch (error) {
            console.error('Error en updateSubcategoria:', error);
            
            // Si el error es por categoría inexistente
            if (error instanceof Error && error.message.includes('categoría especificada no existe')) {
                res.status(400).json({
                    success: false,
                    error: error.message
                });
                return;
            }

            res.status(500).json({
                success: false,
                error: 'Error al actualizar subcategoría'
            });
        }
    }

    async deleteSubcategoria(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    error: 'ID inválido'
                });
                return;
            }

            // Verificar si existe
            const existe = await categoriasService.subcategoriaExists(id);
            if (!existe) {
                res.status(404).json({
                    success: false,
                    error: 'Subcategoría no encontrada'
                });
                return;
            }

            await categoriasService.deleteSubcategoria(id);

            const response: IApiResponse = {
                success: true,
                message: 'Subcategoría eliminada exitosamente'
            };

            res.json(response);
        } catch (error) {
            console.error('Error en deleteSubcategoria:', error);
            
            // Si el error es por productos asociados, enviar mensaje específico
            if (error instanceof Error && error.message.includes('producto(s) asociado(s)')) {
                res.status(400).json({
                    success: false,
                    error: error.message
                });
                return;
            }

            res.status(500).json({
                success: false,
                error: 'Error al eliminar subcategoría'
            });
        }
    }
}