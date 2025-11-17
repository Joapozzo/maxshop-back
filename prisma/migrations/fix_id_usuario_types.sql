-- Migración para cambiar los tipos de UUID a VarChar(150) para campos relacionados con id_usuario
-- Esto permite usar Firebase UIDs (strings) en lugar de UUIDs

-- Cambiar id_usuario en tabla admin
ALTER TABLE "admin" ALTER COLUMN "id_usuario" TYPE VARCHAR(150) USING "id_usuario"::text;

-- Cambiar id_usuario en tabla cliente
ALTER TABLE "cliente" ALTER COLUMN "id_usuario" TYPE VARCHAR(150) USING "id_usuario"::text;

-- Cambiar id_usuario en tabla auditoria
ALTER TABLE "auditoria" ALTER COLUMN "id_usuario" TYPE VARCHAR(150) USING "id_usuario"::text;

-- Cambiar id_usuario en tabla venta
ALTER TABLE "venta" ALTER COLUMN "id_usuario" TYPE VARCHAR(150) USING "id_usuario"::text;

-- Cambiar id_cliente en tabla venta (referencia a cliente.id_usuario)
ALTER TABLE "venta" ALTER COLUMN "id_cliente" TYPE VARCHAR(150) USING "id_cliente"::text;

-- Cambiar id_usuario en tabla usuarios (por si acaso)
ALTER TABLE "usuarios" ALTER COLUMN "id_usuario" TYPE VARCHAR(150) USING "id_usuario"::text;

