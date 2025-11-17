-- Script para limpiar los planes preparados (prepared statements) en PostgreSQL
-- Esto soluciona el error "cached plan must not change result type"
-- Ejecuta este SQL directamente en tu base de datos PostgreSQL

-- Paso 1: Cerrar todas las conexiones activas excepto la tuya
-- (Opcional, pero recomendado si puedes detener el servidor)

-- Paso 2: Limpiar todos los planes preparados (prepared statements)
DEALLOCATE ALL;

-- Paso 3: Verificar que el tipo de la columna telefono sea correcto
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'usuarios' AND column_name = 'telefono';

-- Paso 4: Si el tipo no es VARCHAR(50), ejecutar este ALTER TABLE:
-- ALTER TABLE usuarios 
-- ALTER COLUMN telefono TYPE VARCHAR(50) USING CASE 
--   WHEN telefono IS NULL THEN NULL 
--   ELSE telefono::TEXT 
-- END;

-- Paso 5: Limpiar el caché de PostgreSQL (opcional pero recomendado)
SELECT pg_stat_reset();

-- Nota: Después de ejecutar esto, reinicia el servidor backend para que
-- Prisma Client se regenere con el tipo correcto

