-- CreateTable
CREATE TABLE "negocio" (
    "id_neg" SERIAL NOT NULL,
    "nombre" VARCHAR(255),
    "direccion" VARCHAR(255),
    "logo" VARCHAR(255),
    "telefono" VARCHAR(50),
    "cuit" VARCHAR(50),
    "cond_iva" VARCHAR(100),
    "email" VARCHAR(255),
    "color_primario" VARCHAR(20),
    "color_secundario" VARCHAR(20),
    "token_pago" VARCHAR(255),
    "token_envio" VARCHAR(255),

    CONSTRAINT "negocio_pkey" PRIMARY KEY ("id_neg")
);

-- CreateTable
CREATE TABLE "roles" (
    "id_rol" SERIAL NOT NULL,
    "nombre" VARCHAR(100),
    "descripcion" VARCHAR(255),

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" VARCHAR(150) NOT NULL,
    "nombre" VARCHAR(100),
    "apellido" VARCHAR(100),
    "email" VARCHAR(255),
    "telefono" VARCHAR(50),
    "username" VARCHAR(100),
    "password" VARCHAR(255),
    "id_rol" INTEGER,
    "estado" INTEGER,
    "creado_en" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "img" VARCHAR(255),
    "ultimo_login" TIMESTAMP(6),
    "login_ip" VARCHAR(50),
    "nacimiento" DATE,
    "token" UUID,
    "token_expira" TIMESTAMP(6),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "admin" (
    "id_admin" UUID DEFAULT gen_random_uuid(),
    "id_usuario" VARCHAR(150) NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "cliente" (
    "id_cliente" UUID DEFAULT gen_random_uuid(),
    "id_usuario" VARCHAR(150) NOT NULL,
    "direccion" VARCHAR(255),
    "cod_postal" INTEGER,
    "ciudad" VARCHAR(100),
    "provincia" VARCHAR(100),

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "eventos" (
    "id_evento" SERIAL NOT NULL,
    "nombre" VARCHAR(255),
    "descripcion" TEXT,
    "fecha_inicio" TIMESTAMP(6),
    "fecha_fin" TIMESTAMP(6),
    "tipo_descuento" VARCHAR(50),
    "banner_img" VARCHAR(255),
    "color_tema" VARCHAR(20),
    "activo" BOOLEAN DEFAULT true,
    "creado_en" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "url_publica" VARCHAR(255),

    CONSTRAINT "eventos_pkey" PRIMARY KEY ("id_evento")
);

-- CreateTable
CREATE TABLE "auditoria" (
    "id_aud" SERIAL NOT NULL,
    "id_usuario" VARCHAR(150),
    "fecha" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "accion" VARCHAR(100),
    "tabla_afectada" VARCHAR(100),
    "dato_anterior" JSONB,
    "dato_despues" JSONB,
    "user_agent" VARCHAR(255),
    "endpoint" VARCHAR(255),
    "estado" VARCHAR(50),
    "descripcion" VARCHAR(255),
    "tiempo_procesamiento" INTEGER,

    CONSTRAINT "auditoria_pkey" PRIMARY KEY ("id_aud")
);

-- CreateTable
CREATE TABLE "venta" (
    "id_venta" SERIAL NOT NULL,
    "id_usuario" VARCHAR(150),
    "fecha" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "id_cliente" VARCHAR(150),
    "total_sin_iva" DECIMAL(10,2),
    "total_con_iva" DECIMAL(10,2),
    "descuento_total" DECIMAL(10,2),
    "total_neto" DECIMAL(10,2),
    "metodo_pago" VARCHAR(50),
    "estado_pago" VARCHAR(50),
    "estado_envio" VARCHAR(50),
    "id_envio" UUID,
    "tipo_venta" VARCHAR(50),
    "observaciones" TEXT,
    "factura_url" VARCHAR(255),
    "creado_en" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "venta_pkey" PRIMARY KEY ("id_venta")
);

-- CreateTable
CREATE TABLE "envios" (
    "id_envio" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_venta" INTEGER,
    "empresa_envio" VARCHAR(100),
    "cod_seguimiento" VARCHAR(100),
    "estado_envio" VARCHAR(50),
    "costo_envio" DECIMAL(10,2),
    "direccion_envio" VARCHAR(255),
    "fecha_envio" TIMESTAMP(6),
    "fecha_entrega" TIMESTAMP(6),
    "observaciones" TEXT,

    CONSTRAINT "envios_pkey" PRIMARY KEY ("id_envio")
);

-- CreateTable
CREATE TABLE "reglas-contenido" (
    "id_contenido" INTEGER,
    "id_regla" SERIAL NOT NULL,
    "tipo_objetivo" VARCHAR(50),
    "id_objetivo" INTEGER,

    CONSTRAINT "Reglas-Contenido_pkey" PRIMARY KEY ("id_regla")
);

-- CreateTable
CREATE TABLE "reglas-evento" (
    "id_regla" SERIAL NOT NULL,
    "id_evento" INTEGER,
    "tipo_desc" VARCHAR(50),
    "valor_desc" DECIMAL(10,2),
    "desc_regla" VARCHAR(255),
    "condicion_extra" JSONB,
    "activo" BOOLEAN DEFAULT true,
    "creado_en" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reglas-Evento_pkey" PRIMARY KEY ("id_regla")
);

-- CreateTable
CREATE TABLE "venta-detalle" (
    "id_detalle" SERIAL NOT NULL,
    "id_venta" INTEGER,
    "id_prod" INTEGER,
    "cantidad" INTEGER,
    "precio_unitario" DECIMAL(10,2),
    "descuento_aplicado" DECIMAL(10,2),
    "sub_total" DECIMAL(10,2),
    "evento_aplicado" INTEGER,
    "tipo_descuento" VARCHAR(50),

    CONSTRAINT "Venta-detalle_pkey" PRIMARY KEY ("id_detalle")
);

-- CreateTable
CREATE TABLE "categoria" (
    "id_cat" SERIAL NOT NULL,
    "codi_categoria" VARCHAR(4) NOT NULL,
    "nombre" VARCHAR(100),
    "descripcion" VARCHAR(255),
    "activo" BOOLEAN DEFAULT true,
    "creado_en" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("id_cat")
);

-- CreateTable
CREATE TABLE "iva" (
    "id_iva" SERIAL NOT NULL,
    "codi_impuesto" VARCHAR(2) NOT NULL,
    "nombre" VARCHAR(100),
    "porcentaje" DECIMAL(8,4),
    "descripcion" VARCHAR(255),
    "activo" BOOLEAN DEFAULT true,
    "creado_en" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "iva_pkey" PRIMARY KEY ("id_iva")
);

-- CreateTable
CREATE TABLE "marca" (
    "id_marca" SERIAL NOT NULL,
    "codi_marca" VARCHAR(3) NOT NULL,
    "nombre" VARCHAR(100),
    "descripcion" VARCHAR(255),
    "activo" BOOLEAN DEFAULT true,
    "creado_en" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "marca_pkey" PRIMARY KEY ("id_marca")
);

-- CreateTable
CREATE TABLE "grupo" (
    "id_grupo" SERIAL NOT NULL,
    "codi_grupo" VARCHAR(4) NOT NULL,
    "nombre" VARCHAR(100),
    "descripcion" VARCHAR(255),
    "activo" BOOLEAN DEFAULT true,
    "creado_en" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grupo_pkey" PRIMARY KEY ("id_grupo")
);

-- CreateTable
CREATE TABLE "productos" (
    "id_prod" SERIAL NOT NULL,
    "codi_arti" VARCHAR(10) NOT NULL,
    "nombre" VARCHAR(255),
    "descripcion" TEXT,
    "codi_categoria" VARCHAR(4),
    "codi_marca" VARCHAR(3),
    "codi_grupo" VARCHAR(4),
    "codi_impuesto" VARCHAR(2),
    "precio" DECIMAL(19,6),
    "precio_sin_iva" DECIMAL(19,6),
    "iva_monto" DECIMAL(19,6),
    "unidad_medida" VARCHAR(3),
    "unidades_por_producto" DECIMAL(5,0),
    "codi_barras" VARCHAR(22),
    "stock" DECIMAL(12,2),
    "img_principal" VARCHAR(120),
    "activo" VARCHAR(1),
    "estado" INTEGER DEFAULT 1,
    "id_interno" VARCHAR(100),
    "cod_sku" VARCHAR(100),
    "modelo" VARCHAR(100),
    "precio_mayorista" DECIMAL(10,2),
    "precio_minorista" DECIMAL(10,2),
    "precio_evento" DECIMAL(10,2),
    "stock_min" INTEGER,
    "stock_mayorista" INTEGER,
    "imagenes" JSONB,
    "destacado" BOOLEAN DEFAULT false,
    "financiacion" BOOLEAN DEFAULT false,
    "creado_en" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id_prod")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_id_usuario_key" ON "usuarios"("id_usuario");

-- CreateIndex
CREATE INDEX "idx_usuarios_email" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "idx_usuarios_username" ON "usuarios"("username");

-- CreateIndex
CREATE INDEX "idx_usuarios_id_usuario" ON "usuarios"("id_usuario");

-- CreateIndex
CREATE INDEX "idx_auditoria_fecha" ON "auditoria"("fecha");

-- CreateIndex
CREATE INDEX "idx_auditoria_usuario" ON "auditoria"("id_usuario");

-- CreateIndex
CREATE INDEX "idx_venta_cliente" ON "venta"("id_cliente");

-- CreateIndex
CREATE INDEX "idx_venta_fecha" ON "venta"("fecha");

-- CreateIndex
CREATE UNIQUE INDEX "categoria_codi_categoria_key" ON "categoria"("codi_categoria");

-- CreateIndex
CREATE INDEX "idx_categoria_codigo" ON "categoria"("codi_categoria");

-- CreateIndex
CREATE UNIQUE INDEX "iva_codi_impuesto_key" ON "iva"("codi_impuesto");

-- CreateIndex
CREATE INDEX "idx_iva_codigo" ON "iva"("codi_impuesto");

-- CreateIndex
CREATE UNIQUE INDEX "marca_codi_marca_key" ON "marca"("codi_marca");

-- CreateIndex
CREATE INDEX "idx_marca_codigo" ON "marca"("codi_marca");

-- CreateIndex
CREATE UNIQUE INDEX "grupo_codi_grupo_key" ON "grupo"("codi_grupo");

-- CreateIndex
CREATE INDEX "idx_grupo_codigo" ON "grupo"("codi_grupo");

-- CreateIndex
CREATE UNIQUE INDEX "productos_codi_arti_key" ON "productos"("codi_arti");

-- CreateIndex
CREATE INDEX "idx_productos_codi_arti" ON "productos"("codi_arti");

-- CreateIndex
CREATE INDEX "idx_productos_codi_barras" ON "productos"("codi_barras");

-- CreateIndex
CREATE INDEX "idx_productos_categoria" ON "productos"("codi_categoria");

-- CreateIndex
CREATE INDEX "idx_productos_marca" ON "productos"("codi_marca");

-- CreateIndex
CREATE INDEX "idx_productos_grupo" ON "productos"("codi_grupo");

-- CreateIndex
CREATE INDEX "idx_productos_iva" ON "productos"("codi_impuesto");

-- CreateIndex
CREATE INDEX "idx_productos_nombre" ON "productos"("nombre");

-- CreateIndex
CREATE INDEX "idx_productos_activo" ON "productos"("activo");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "roles"("id_rol") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "admin" ADD CONSTRAINT "admin_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cliente" ADD CONSTRAINT "cliente_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auditoria" ADD CONSTRAINT "auditoria_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "venta" ADD CONSTRAINT "venta_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "cliente"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "venta" ADD CONSTRAINT "venta_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "envios" ADD CONSTRAINT "envios_id_venta_fkey" FOREIGN KEY ("id_venta") REFERENCES "venta"("id_venta") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reglas-contenido" ADD CONSTRAINT "Reglas-Contenido_id_regla_fkey" FOREIGN KEY ("id_regla") REFERENCES "reglas-evento"("id_regla") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reglas-evento" ADD CONSTRAINT "Reglas-Evento_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "eventos"("id_evento") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "venta-detalle" ADD CONSTRAINT "Venta-detalle_evento_aplicado_fkey" FOREIGN KEY ("evento_aplicado") REFERENCES "eventos"("id_evento") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "venta-detalle" ADD CONSTRAINT "Venta-detalle_id_prod_fkey" FOREIGN KEY ("id_prod") REFERENCES "productos"("id_prod") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "venta-detalle" ADD CONSTRAINT "Venta-detalle_id_venta_fkey" FOREIGN KEY ("id_venta") REFERENCES "venta"("id_venta") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_codi_categoria_fkey" FOREIGN KEY ("codi_categoria") REFERENCES "categoria"("codi_categoria") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_codi_marca_fkey" FOREIGN KEY ("codi_marca") REFERENCES "marca"("codi_marca") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_codi_grupo_fkey" FOREIGN KEY ("codi_grupo") REFERENCES "grupo"("codi_grupo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_codi_impuesto_fkey" FOREIGN KEY ("codi_impuesto") REFERENCES "iva"("codi_impuesto") ON DELETE SET NULL ON UPDATE CASCADE;
