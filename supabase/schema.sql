-- ============================================================
--  panel-flota — Supabase / PostgreSQL Schema
--  Ejecuta esto en el SQL Editor de Supabase para configurar el proyecto.
-- ============================================================


-- 1. Extensión PostGIS (cálculos espaciales en la base de datos)
CREATE EXTENSION IF NOT EXISTS postgis;


-- 2. Tabla de rutas de referencia
--    Almacena el trayecto canónico como una LINESTRING geográfica.
--    ST_Distance la usará para medir la desviación de cada camión.
--    Nota: poblar con /supabase/seed.sql después de ejecutar este script.
CREATE TABLE public.routes (
    id    TEXT PRIMARY KEY,  -- e.g. 'toledo-peligros'
    name  TEXT,
    path  GEOGRAPHY(LINESTRING, 4326) NOT NULL
);


-- 3. Tabla principal de telemetría
--    Recibe un INSERT por cada ping GPS del Cloudflare Worker.
--    El trigger (paso 4) rellena `is_deviated` automáticamente.
CREATE TABLE public.telemetry (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    truck_id    TEXT        NOT NULL,
    lat         DOUBLE PRECISION NOT NULL,
    lon         DOUBLE PRECISION NOT NULL,
    is_deviated BOOLEAN     NOT NULL DEFAULT FALSE,
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para acelerar consultas históricas por vehículo
CREATE INDEX idx_telemetry_truck_id ON public.telemetry (truck_id);


-- 4. Función del Trigger: calcula si el camión se ha desviado de la ruta
--    Se ejecuta BEFORE INSERT para poder escribir NEW.is_deviated antes de
--    que el registro llegue a la tabla (sin necesidad de un UPDATE posterior).
CREATE OR REPLACE FUNCTION public.check_route_deviation()
RETURNS TRIGGER AS $$
DECLARE
    truck_point GEOGRAPHY;
    route_path  GEOGRAPHY;
    deviation_m DOUBLE PRECISION;
BEGIN
    -- Construir el punto geográfico desde lat/lon planos
    truck_point := ST_SetSRID(ST_Point(NEW.lon, NEW.lat), 4326)::GEOGRAPHY;

    -- Obtener la ruta de referencia para este trayecto
    SELECT path INTO route_path
    FROM public.routes
    WHERE id = 'toledo-peligros';

    -- Si la ruta aún no está cargada, insertar sin marcar como desviado
    IF route_path IS NULL THEN
        RETURN NEW;
    END IF;

    -- ST_Distance sobre GEOGRAPHY devuelve metros
    deviation_m := ST_Distance(truck_point, route_path);

    -- Umbral: 2000 m (coherente con el log del frontend ">2000m")
    NEW.is_deviated := deviation_m > 2000;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- 5. Trigger: dispara la función antes de cada INSERT en telemetría
CREATE TRIGGER trigger_check_deviation
    BEFORE INSERT ON public.telemetry
    FOR EACH ROW
    EXECUTE FUNCTION public.check_route_deviation();


-- 6. Activar Realtime para que el frontend reciba los cambios en tiempo real
ALTER PUBLICATION supabase_realtime ADD TABLE public.telemetry;