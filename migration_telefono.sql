-- Migración para cambiar telefono de INTEGER a VARCHAR(50)
-- Ejecutar este SQL directamente en la base de datos PostgreSQL

-- Paso 1: Convertir los valores numéricos existentes a string (si hay datos)
-- Esto es seguro porque todos los números se pueden convertir a string
ALTER TABLE usuarios 
ALTER COLUMN telefono TYPE VARCHAR(50) USING CASE 
  WHEN telefono IS NULL THEN NULL 
  ELSE telefono::TEXT 
END;

-- Paso 2: Verificar que el cambio se aplicó correctamente
-- SELECT column_name, data_type, character_maximum_length 
-- FROM information_schema.columns 
-- WHERE table_name = 'usuarios' AND column_name = 'telefono';

