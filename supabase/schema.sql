-- panel-flota — Supabase / PostgreSQL Schema

-- PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Rutas de referencia (LINESTRING geográfica)
CREATE TABLE public.routes (
    id    TEXT PRIMARY KEY,
    name  TEXT,
    path  GEOGRAPHY(LINESTRING, 4326) NOT NULL
);

-- Telemetría GPS (un INSERT por cada ping del Worker)
CREATE TABLE public.telemetry (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    truck_id    TEXT        NOT NULL,
    lat         DOUBLE PRECISION NOT NULL,
    lon         DOUBLE PRECISION NOT NULL,
    is_deviated BOOLEAN     NOT NULL DEFAULT FALSE,
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_telemetry_truck_id ON public.telemetry (truck_id);

-- Trigger: calcula si el camión se ha desviado de la ruta (>2000m)
CREATE OR REPLACE FUNCTION public.check_route_deviation()
RETURNS TRIGGER AS $$
DECLARE
    truck_point GEOGRAPHY;
    route_path  GEOGRAPHY;
    deviation_m DOUBLE PRECISION;
BEGIN
    truck_point := ST_SetSRID(ST_Point(NEW.lon, NEW.lat), 4326)::GEOGRAPHY;

    SELECT path INTO route_path
    FROM public.routes
    WHERE id = 'toledo-peligros';

    IF route_path IS NULL THEN
        RETURN NEW;
    END IF;

    deviation_m := ST_Distance(truck_point, route_path);
    NEW.is_deviated := deviation_m > 2000;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_deviation
    BEFORE INSERT ON public.telemetry
    FOR EACH ROW
    EXECUTE FUNCTION public.check_route_deviation();

-- Activar Realtime para el frontend
ALTER PUBLICATION supabase_realtime ADD TABLE public.telemetry;