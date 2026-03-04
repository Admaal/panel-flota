# 🚚 NexusLogistics — Panel de Control de Flotas en Tiempo Real

> Sistema de telemetría geoespacial serverless con detección automática de desvíos de ruta.  
> Arquitectura orientada a eventos de coste cero: **Cloudflare Workers → Supabase PostGIS → React**.

![Estado](https://img.shields.io/badge/estado-producción-10b981?style=flat-square)
![Licencia](https://img.shields.io/badge/licencia-MIT-3b82f6?style=flat-square)
![Stack](https://img.shields.io/badge/stack-React%20%7C%20Supabase%20%7C%20Cloudflare-6366f1?style=flat-square)

---

## 📌 Caso de Uso y Arquitectura

Este proyecto simula el backend y frontend de una empresa de transportes. Procesa coordenadas GPS de una flota en tiempo real, detecta automáticamente desviaciones de ruta usando matemáticas espaciales, y renderiza el estado del vehículo en un panel de control corporativo.

```
┌─────────────────┐     POST /ping      ┌─────────────────────┐     INSERT     ┌────────────────────┐
│                 │ ──────────────────▶ │                     │ ─────────────▶ │                    │
│  Frontend React │                     │  Cloudflare Worker  │                │  Supabase PostGIS  │
│  (Simulador)    │                     │  (Edge · Validación │                │  (Trigger ST_Dist) │
│                 │ ◀────────────────── │   + Auth)           │                │                    │
└─────────────────┘   WebSocket RT       └─────────────────────┘                └────────────────────┘
        │                ▲                                                                │
        │                └────────────────── Realtime (WebSocket) ──────────────────────┘
        │
        ▼
   Mapa Leaflet
   + Consola de Eventos
```

### ¿Por qué esta arquitectura?

Las coordenadas GPS **no van directamente a Supabase**. Pasan antes por un Cloudflare Worker desplegado en el Edge que actúa como capa de validación y autenticación. Esto evita saturar las conexiones directas a PostgreSQL y permite escalar a miles de pings/minuto sin coste adicional.

---

## 🛠️ Stack Tecnológico

| Capa               | Tecnología                      | Rol                                   |
| ------------------ | ------------------------------- | ------------------------------------- |
| **Frontend**       | React 19 + Vite + React-Leaflet | Panel de control + simulador          |
| **Edge / Ingesta** | Cloudflare Workers (TypeScript) | Validación, CORS y autenticación      |
| **Base de datos**  | Supabase (PostgreSQL + PostGIS) | Almacenamiento geoespacial + Triggers |
| **Tiempo real**    | Supabase Realtime (WebSockets)  | Push de eventos al frontend           |
| **CSS**            | CSS puro + Google Fonts (Inter) | Sin frameworks de UI                  |

---

## 🚀 Características Principales

1. **Ingesta en el Edge** — El Worker actúa como escudo protector: valida el payload (campos requeridos + tipos), gestiona las cabeceras CORS y maneja la autenticación con `SERVICE_ROLE_KEY`, una clave que nunca sale del servidor.

2. **Motor Geoespacial Nativo (PostGIS)** — Un trigger `BEFORE INSERT` usa `ST_Distance()` para comparar automáticamente cada coordenada entrante contra la ruta de referencia almacenada como `GEOGRAPHY(LINESTRING)`. Si supera los 2 km, marca el registro como `is_deviated = true` sin ninguna lógica extra en el servidor de aplicación.

3. **Suscripción en Tiempo Real** — React no hace _polling_. Está suscrito al canal Realtime de Supabase (WebSockets). El marcador del mapa se mueve en cuanto el trigger completa el INSERT.

4. **Retry con Backoff Exponencial** — El simulador reintenta automáticamente cada ping fallido hasta 3 veces (1 s → 2 s → 4 s) antes de notificar al usuario en la consola de eventos.

5. **Error Boundary + Validación de Entorno** — Si falta alguna variable de entorno al arrancar, la app muestra una pantalla de error descriptiva con exactamente qué variable falta, en lugar de una pantalla en blanco.

---

## 📂 Estructura del Proyecto

```
panel-flota/
├── src/
│   ├── App.jsx                      # Orquestador principal (64 líneas)
│   ├── components/
│   │   ├── Sidebar.jsx              # Barra lateral corporativa
│   │   ├── ControlPanel.jsx         # Botones Iniciar / Parar / Resetear
│   │   ├── EventConsole.jsx         # Consola de logs en tiempo real
│   │   └── FleetMap.jsx             # Mapa Leaflet + banner de alerta
│   ├── hooks/
│   │   ├── useSupabaseRealtime.js   # Suscripción WebSocket a Supabase
│   │   └── useSimulation.js         # Bucle async + pings al Worker
│   ├── lib/
│   │   ├── supabase.js              # Cliente Supabase (único punto de init)
│   │   └── env.js                   # Validación de variables de entorno
│   └── constants/
│       └── mapIcons.js              # Iconos personalizados de Leaflet
│
├── worker/
│   └── index.ts                     # Cloudflare Worker (TypeScript)
│
├── supabase/
│   └── schema.sql                   # Schema PostGIS + Trigger + Realtime
│
├── .env.example                     # Plantilla de variables de entorno
└── README.md
```

---

## ⚙️ Configuración Local

### Prerrequisitos

- Node.js ≥ 18
- Una cuenta gratuita de [Supabase](https://supabase.com)
- Una cuenta gratuita de [Cloudflare Workers](https://workers.cloudflare.com)

### 1. Clonar e instalar dependencias

```bash
git clone https://github.com/Admaal/panel-flota.git
cd panel-flota
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con tus valores:

| Variable                 | Descripción                      | Dónde obtenerla                   |
| ------------------------ | -------------------------------- | --------------------------------- |
| `VITE_SUPABASE_URL`      | URL del proyecto de Supabase     | Supabase → Project Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Clave pública (anon) de Supabase | Supabase → Project Settings → API |
| `VITE_CLOUDFLARE_URL`    | URL del Worker desplegado        | Cloudflare Dashboard → Workers    |
| `VITE_TRUCK_ID`          | UUID del camión simulado         | Cualquier UUID v4 válido          |

### 3. Configurar Supabase

En el SQL Editor de tu proyecto de Supabase, ejecuta el contenido de [`supabase/schema.sql`](./supabase/schema.sql). Esto:

- Activa la extensión `postgis`
- Crea la tabla `telemetry` con los campos necesarios
- Crea la tabla `routes` para almacenar la ruta de referencia
- Instala el trigger `check_route_deviation` con `ST_Distance()`
- Habilita Realtime sobre la tabla `telemetry`

Después, inserta la ruta de referencia en la tabla `routes` con el trayecto Toledo → Peligros (en formato WKT LINESTRING).

### 4. Desplegar el Cloudflare Worker

```bash
cd worker
npx wrangler deploy
```

Asegúrate de configurar los secretos en Cloudflare:

```bash
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
```

> ⚠️ Usa la `SERVICE_ROLE_KEY` (no la `ANON_KEY`) en el Worker, ya que necesita saltarse las políticas de Row Level Security para hacer inserciones.

### 5. Levantar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) y pulsa **▶️ Iniciar Viaje** para lanzar la simulación.

---

## 🧪 Cómo funciona la simulación

El botón **Iniciar Viaje** activa un bucle asíncrono en el front que recorre 53 coordenadas reales del trayecto Toledo → Peligros (almacenadas en `src/ruta_toledo_peligros.json`). Cada 2 segundos envía un ping al Cloudflare Worker simulando un dispositivo GPS real.

El Worker valida el payload y hace un INSERT en Supabase. El trigger de PostGIS calcula la distancia a la ruta, marca el campo `is_deviated` y Supabase emite el evento por WebSocket al frontend, que mueve el marcador en el mapa instantáneamente.

---

## 📄 Licencia

MIT © [Admaal](https://github.com/Admaal)
