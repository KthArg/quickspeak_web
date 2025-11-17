# QuickSpeak - Frontend

**Plataforma web de aprendizaje de idiomas** - Interfaz de usuario moderna construida con Next.js 14, React y TypeScript.

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Características Principales](#características-principales)
- [Stack Tecnológico](#stack-tecnológico)
- [Requisitos Previos](#requisitos-previos)
- [Configuración y Setup](#configuración-y-setup)
- [Variables de Entorno](#variables-de-entorno)
- [Ejecución Local](#ejecución-local)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Arquitectura de la Aplicación](#arquitectura-de-la-aplicación)
- [Autenticación y Protección de Rutas](#autenticación-y-protección-de-rutas)
- [Integración con Backend](#integración-con-backend)
- [Rutas y Navegación](#rutas-y-navegación)
- [Componentes Principales](#componentes-principales)
- [Estilos y Temas](#estilos-y-temas)
- [Despliegue](#despliegue)
- [Solución de Problemas](#solución-de-problemas)

---

## Descripción General

QuickSpeak es una plataforma interactiva de aprendizaje de idiomas que conecta estudiantes con profesores nativos a través de conversaciones en tiempo real. La aplicación permite a los usuarios seleccionar idiomas para aprender, encontrar hablantes nativos y practicar sus habilidades lingüísticas.

### ¿Qué hace esta aplicación?

- **Onboarding intuitivo**: Los usuarios seleccionan su idioma nativo y los idiomas que desean aprender
- **Búsqueda de hablantes**: Encuentra hablantes nativos del idioma que estás aprendiendo
- **Gestión de perfil**: Administra información personal, idiomas y preferencias
- **Autenticación múltiple**: Login con email/password o OAuth (Google)
- **Interfaz responsiva**: Diseño moderno que funciona en desktop, tablet y móvil

---

## Características Principales

### Onboarding
- Selección de idioma nativo con interfaz visual intuitiva
- Selección múltiple de idiomas para aprender
- Guardado automático de preferencias de usuario

### Dashboard
- **Speakers**: Encuentra y conecta con hablantes nativos
- **Biblioteca**: Accede a recursos de aprendizaje
- **Perfil**: Gestiona tu información personal, idiomas y configuración

### Autenticación
- **Local**: Registro y login con email y contraseña
- **OAuth**: Login con Google a través de Azure EasyAuth
- **Protección de rutas**: Acceso automático basado en estado de autenticación
- **Gestión diferenciada**: Usuarios OAuth no pueden cambiar email/password localmente

### Gestión de Idiomas
- Agregar/eliminar idiomas en aprendizaje
- Visualización de progreso por idioma
- Priorización de idiomas

### Perfil de Usuario
- Actualización de nombre, apellido y email (solo usuarios locales)
- Cambio de contraseña seguro (solo usuarios locales)
- Avatar generado automáticamente con DiceBear
- Indicadores visuales para usuarios OAuth

---

## Stack Tecnológico

### Core
- **Next.js 14**: Framework React con App Router
- **React 18**: Biblioteca de interfaz de usuario
- **TypeScript**: Tipado estático para JavaScript

### Estilos
- **Tailwind CSS**: Framework de utilidades CSS
- **Geist Font**: Tipografía optimizada de Vercel

### Estado y Contexto
- **React Context API**: Gestión de estado de autenticación
- **useState/useEffect**: Hooks de React para estado local

### HTTP y API
- **Fetch API**: Comunicación con backend
- **Custom API Wrapper**: Abstracción para llamadas a Azure APIM

### Autenticación
- **JWT**: Tokens de autenticación
- **Azure EasyAuth**: OAuth integration (Google, Microsoft, Facebook)
- **Token Manager**: Gestión de tokens en localStorage

### Infraestructura
- **Azure Static Web Apps**: Hosting y deployment
- **GitHub Actions**: CI/CD automático

---

## Requisitos Previos

Asegúrate de tener instalado:

- **Node.js 18+**: [Descargar Node.js](https://nodejs.org/)
- **npm, yarn, pnpm o bun**: Gestor de paquetes
- **Git**: [Descargar Git](https://git-scm.com/downloads)

### Verificar instalaciones

```bash
node -v    # Debe mostrar v18.x o superior
npm -v     # Debe mostrar 9.x o superior
git --version
```

---

## Configuración y Setup

### 1. Clonar el repositorio

```bash
git clone https://github.com/your-username/quickspeak.git
cd quickspeak
```

### 2. Instalar dependencias

```bash
npm install
# o
yarn install
# o
pnpm install
# o
bun install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus valores:

```env
# URL base de Azure APIM
NEXT_PUBLIC_API_BASE_URL=https://apim-quick-speak.azure-api.net

# API Key de Azure APIM
NEXT_PUBLIC_API_KEY=your-subscription-key-here

# URL del servicio de usuarios
# Para desarrollo local:
NEXT_PUBLIC_USER_SERVICE_URL=http://localhost:8081
# Para producción:
# NEXT_PUBLIC_USER_SERVICE_URL=https://your-user-service.azurewebsites.net
```

### 4. Ejecutar en modo desarrollo

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```

La aplicación estará disponible en: `http://localhost:3000`

---

## Variables de Entorno

### Variables Requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | URL base de Azure APIM | `https://apim-quick-speak.azure-api.net` |
| `NEXT_PUBLIC_API_KEY` | Subscription key de APIM | `c081b2299247481f827d5b08211624f2` |
| `NEXT_PUBLIC_USER_SERVICE_URL` | URL del microservicio de usuarios | `http://localhost:8081` (local)<br>`https://user-service.azurewebsites.net` (prod) |

### Configuración por Ambiente

**Desarrollo Local** (`.env.local`):
```env
NEXT_PUBLIC_API_BASE_URL=https://apim-quick-speak.azure-api.net
NEXT_PUBLIC_API_KEY=your-dev-key
NEXT_PUBLIC_USER_SERVICE_URL=http://localhost:8081
```

**Producción** (Azure Static Web Apps):
Configurar en Azure Portal o con Azure CLI:

```bash
az staticwebapp appsettings set \
  --name quickspeak \
  --setting-names \
    NEXT_PUBLIC_API_BASE_URL="https://apim-quick-speak.azure-api.net" \
    NEXT_PUBLIC_API_KEY="your-prod-key" \
    NEXT_PUBLIC_USER_SERVICE_URL="https://user-service.azurewebsites.net"
```

---

## Ejecución Local

### Modo Desarrollo

```bash
npm run dev
```

Características:
- Hot reload automático
- Fast refresh de React
- Mensajes de error detallados
- Disponible en: `http://localhost:3000`

### Modo Producción

```bash
# Compilar para producción
npm run build

# Ejecutar versión de producción
npm start
```

### Linting

```bash
# Verificar código
npm run lint

# Auto-fix problemas
npm run lint --fix
```

---

## Estructura del Proyecto

```
quickspeak/
├── src/
│   └── app/                                # App Router (Next.js 14)
│       ├── layout.tsx                      # Layout raíz con providers
│       ├── page.tsx                        # Landing page (/)
│       │
│       ├── api/                            # API Routes
│       │   └── languages/
│       │       └── select-native/
│       │           └── route.ts            # Endpoint idiomas nativos
│       │
│       ├── auth/                           # Autenticación OAuth
│       │   └── callback/
│       │       └── page.tsx                # Callback de Azure EasyAuth
│       │
│       ├── components/                     # Componentes compartidos
│       │   ├── ProtectedRoute.tsx          # HOC para proteger rutas
│       │   └── ThemeProvider.tsx           # Provider de tema
│       │
│       ├── contexts/                       # Context Providers
│       │   └── AuthContext.tsx             # Contexto de autenticación
│       │
│       ├── dashboard/                      # Dashboard protegido
│       │   ├── layout.tsx                  # Layout con sidebar
│       │   ├── speakers/                   # Buscar hablantes
│       │   │   └── page.tsx
│       │   ├── library/                    # Biblioteca de recursos
│       │   │   └── page.tsx
│       │   └── profile/                    # Perfil de usuario
│       │       └── page.tsx                # Gestión de perfil
│       │
│       ├── lib/                            # Utilidades y helpers
│       │   ├── api.ts                      # Cliente API para backend
│       │   └── tokenManager.ts             # Gestión de JWT tokens
│       │
│       ├── login/                          # Login page
│       │   └── page.tsx
│       │
│       ├── sign_up/                        # Registro
│       │   └── page.tsx
│       │
│       ├── pick_native_language/           # Onboarding: idioma nativo
│       │   └── page.tsx
│       │
│       └── pick_starting_languages/        # Onboarding: idiomas a aprender
│           └── page.tsx
│
├── public/                                 # Archivos estáticos
│   ├── fonts/                              # Fuentes personalizadas
│   └── images/                             # Imágenes y assets
│
├── .env.example                            # Ejemplo de variables de entorno
├── .env.local                              # Variables de entorno (no en git)
├── next.config.mjs                         # Configuración de Next.js
├── tailwind.config.ts                      # Configuración de Tailwind
├── tsconfig.json                           # Configuración de TypeScript
└── package.json                            # Dependencias y scripts
```

---

## Arquitectura de la Aplicación

### App Router (Next.js 14)

QuickSpeak usa el nuevo App Router de Next.js 14, que proporciona:
- Layouts anidados
- Server Components por defecto
- Streaming y Suspense
- Mejor performance

### Flujo de Navegación

```
Landing Page (/)
    │
    ├─> Sign Up (/sign_up)
    │       │
    │       ↓
    │   Pick Native Language (/pick_native_language)
    │       │
    │       ↓
    │   Pick Starting Languages (/pick_starting_languages)
    │       │
    │       ↓
    │   Dashboard (/dashboard/speakers)
    │
    └─> Login (/login)
            │
            ↓
        Dashboard (/dashboard/speakers)
            ├─> Speakers (/dashboard/speakers)
            ├─> Library (/dashboard/library)
            └─> Profile (/dashboard/profile)
```

### Capas de la Aplicación

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│         (Pages, Components)             │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│        State Management Layer           │
│      (Context API, Local State)         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         API/Service Layer               │
│      (lib/api.ts, tokenManager.ts)      │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│            Backend APIs                 │
│    (Azure APIM, User Service, etc.)     │
└─────────────────────────────────────────┘
```

---

## Autenticación y Protección de Rutas

### AuthContext

El `AuthContext` proporciona autenticación global:

```typescript
const { isAuthenticated, login, logout, isLoading } = useAuth();
```

#### Características:
- **Auto-check**: Verifica token en cada navegación
- **Auto-redirect**: Redirige según estado de autenticación
- **Token management**: Guarda/elimina tokens automáticamente

### Rutas Públicas

Accesibles sin autenticación:
- `/` - Landing page
- `/login` - Login
- `/sign_up` - Registro
- `/auth/callback` - OAuth callback

### Rutas de Onboarding

Accesibles sin autenticación (para proceso de registro):
- `/pick_native_language` - Seleccionar idioma nativo
- `/pick_starting_languages` - Seleccionar idiomas a aprender

### Rutas Protegidas

Requieren autenticación (todas bajo `/dashboard`):
- `/dashboard/speakers` - Buscar hablantes
- `/dashboard/library` - Biblioteca
- `/dashboard/profile` - Perfil

### Implementación de Protección

**Global (AuthProvider)** - `src/app/contexts/AuthContext.tsx`:
```typescript
useEffect(() => {
  const hasToken = tokenManager.hasToken();
  setIsAuthenticated(hasToken);

  if (!hasToken && !isPublicRoute && !isOnboardingRoute) {
    router.push("/login");
  }
  if (hasToken && (pathname === "/login" || pathname === "/sign_up")) {
    router.push("/dashboard/speakers");
  }
}, [pathname]);
```

**Component-level (ProtectedRoute)** - `src/app/components/ProtectedRoute.tsx`:
```typescript
<ProtectedRoute>
  <YourProtectedContent />
</ProtectedRoute>
```

---

## Integración con Backend

### API Client

**Ubicación**: `src/app/lib/api.ts`

El cliente API maneja:
- Mapeo de endpoints frontend → backend
- Headers de autenticación (JWT, APIM subscription key)
- Manejo de errores
- Transformación de respuestas

#### Uso básico:

```typescript
import { fetchFromAPI } from "@/app/lib/api";

// GET request
const users = await fetchFromAPI("/users", {
  method: "GET"
});

// POST request con body
const newUser = await fetchFromAPI("/users", {
  method: "POST",
  body: { email, password, firstName, lastName }
});

// PATCH con autenticación
const updatedUser = await fetchFromAPI("/user/profile", {
  method: "PATCH",
  body: { firstName, lastName }
});
```

#### Mapeo de Endpoints:

| Frontend | Backend (APIM) |
|----------|----------------|
| `/users` | `/users/api/v1/users` |
| `/auth/login` | `/users/api/v1/auth/login` |
| `/user/profile` | `/users/api/v1/users/{userId}/profile` |
| `/user/password` | `/users/api/v1/users/{userId}/password` |
| `/user/email` | `/users/api/v1/users/{userId}/email` |
| `/languages/select-native` | `/users/api/v1/languages/select-native` |
| `/user/languages/native` | `/users/api/v1/users/{userId}/languages/native` |
| `/user/languages/learning` | `/users/api/v1/users/{userId}/languages/learning` |

### Token Manager

**Ubicación**: `src/app/lib/tokenManager.ts`

Gestiona JWT tokens en localStorage:

```typescript
import tokenManager from "@/app/lib/tokenManager";

// Guardar token después de login
tokenManager.saveToken(jwtToken, userId);

// Verificar si hay token
const hasToken = tokenManager.hasToken();

// Obtener token
const token = tokenManager.getToken();

// Obtener userId
const userId = tokenManager.getUserId();

// Eliminar token (logout)
tokenManager.removeToken();
```

---

## Rutas y Navegación

### Landing Page (`/`)

- Descripción de la plataforma
- Links a Sign Up y Login

### Registro (`/sign_up`)

1. Usuario ingresa: email, password, firstName, lastName
2. Se crea cuenta en backend
3. Auto-login con token JWT
4. Redirect a `/pick_native_language`

### Onboarding

**1. Pick Native Language** (`/pick_native_language`)
- Muestra lista de idiomas disponibles
- Usuario selecciona idioma nativo
- Guarda en backend
- Redirect a `/pick_starting_languages`

**2. Pick Starting Languages** (`/pick_starting_languages`)
- Muestra idiomas (excluyendo el nativo)
- Usuario selecciona idiomas a aprender
- Guarda cada uno en backend
- Redirect a `/dashboard/speakers`

### Dashboard (`/dashboard/*`)

**Speakers** (`/dashboard/speakers`)
- Buscar hablantes nativos
- Filtrar por idioma
- Conectar con usuarios

**Library** (`/dashboard/library`)
- Recursos de aprendizaje
- Materiales por idioma

**Profile** (`/dashboard/profile`)
- Información personal: firstName, lastName, email
- Cambio de contraseña (solo usuarios locales)
- Gestión de idiomas en aprendizaje
- Información de cuenta

### Login (`/login`)

1. Usuario ingresa email y password
2. Backend valida y retorna JWT
3. Frontend guarda token
4. Redirect a `/dashboard/speakers`

---

## Componentes Principales

### AuthProvider

**Ubicación**: `src/app/contexts/AuthContext.tsx`

Proporciona:
- `isAuthenticated`: Estado de autenticación
- `isLoading`: Estado de carga
- `login(token, userId)`: Función de login
- `logout()`: Función de logout

### ProtectedRoute

**Ubicación**: `src/app/components/ProtectedRoute.tsx`

HOC que protege componentes individuales:

```tsx
<ProtectedRoute redirectTo="/login">
  <YourComponent />
</ProtectedRoute>
```

### ThemeProvider

**Ubicación**: `src/app/components/ThemeProvider.tsx`

Gestiona tema claro/oscuro (si está implementado)

### Layout (Dashboard)

**Ubicación**: `src/app/dashboard/layout.tsx`

Proporciona:
- Sidebar de navegación
- Header con información de usuario
- Logout button
- Navegación entre secciones del dashboard

---

## Estilos y Temas

### Tailwind CSS

QuickSpeak usa Tailwind CSS para estilos utilitarios.

**Configuración**: `tailwind.config.ts`

#### Clases comunes:

```tsx
// Buttons
<button className="bg-orange-400 hover:bg-orange-500 text-white rounded-full px-6 py-3">

// Cards
<div className="bg-zinc-900 rounded-3xl p-8 shadow-xl border-2 border-zinc-800">

// Inputs
<input className="w-full bg-zinc-800 border-2 border-zinc-700 rounded-2xl px-6 py-4">
```

### Colores del Proyecto

- **Primary**: Orange (`orange-400`, `orange-500`)
- **Background**: Zinc dark (`zinc-900`, `zinc-950`)
- **Text**: White/Zinc (`white`, `zinc-300`)
- **Borders**: Zinc (`zinc-700`, `zinc-800`)

### Fuentes

- **Geist Sans**: Fuente principal
- **Geist Mono**: Fuente monoespaciada

---

## Despliegue

### Despliegue en Azure Static Web Apps

El proyecto está configurado para desplegar automáticamente con GitHub Actions.

#### Despliegue automático

Cada push a `main` despliega automáticamente:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

#### Prevenir despliegue

Para hacer commit sin desplegar:

```bash
git commit -m "[skip ci] Your message"
git push origin main
```

### Despliegue manual

```bash
# 1. Compilar para producción
npm run build

# 2. Deploy con Azure CLI
az staticwebapp create \
  --name quickspeak \
  --resource-group your-resource-group \
  --source ./ \
  --location "East US 2" \
  --branch main
```

### Configurar variables en Azure

```bash
az staticwebapp appsettings set \
  --name quickspeak \
  --setting-names \
    NEXT_PUBLIC_API_BASE_URL="https://apim-quick-speak.azure-api.net" \
    NEXT_PUBLIC_API_KEY="your-key"
```

### Verificar despliegue

1. Ve al Azure Portal
2. Busca tu Static Web App
3. Copia la URL de producción
4. Verifica que la app funciona correctamente

---

## Solución de Problemas

### Error: "Module not found"

```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error: Variables de entorno no definidas

Verifica:
1. Tienes archivo `.env.local` en la raíz
2. Las variables comienzan con `NEXT_PUBLIC_`
3. Reiniciaste el servidor después de cambiar variables

```bash
# Detener servidor (Ctrl+C)
# Reiniciar
npm run dev
```

### Error: API requests fallan con CORS

Para desarrollo local, asegúrate de que el backend permite `http://localhost:3000`:

**Backend (Spring Boot)** - `SecurityConfig.java`:
```java
.cors(cors -> cors.configurationSource(request -> {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("http://localhost:3000"));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE"));
    return config;
}))
```

### Error: "Token expired" o "Unauthorized"

El JWT expiró. Haz logout y login nuevamente:

```typescript
tokenManager.removeToken();
window.location.href = "/login";
```

### Layout breaks después de hot reload

Recarga la página completamente (`Ctrl+R` o `Cmd+R`)

### Build falla en producción

```bash
# Verificar que build funciona localmente
npm run build

# Si falla, verifica:
# 1. No hay imports de módulos inexistentes
# 2. No hay variables sin NEXT_PUBLIC_ usadas en client components
# 3. TypeScript no tiene errores
npm run lint
```

### Azure Static Web App no actualiza

1. Verifica que el deployment terminó en GitHub Actions
2. Limpia cache del navegador
3. Espera unos minutos (puede tardar en propagarse)

---

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Ejecuta el servidor de desarrollo |
| `npm run build` | Compila la aplicación para producción |
| `npm start` | Ejecuta la aplicación compilada |
| `npm run lint` | Verifica el código con ESLint |

---

## Contribuciones

Este proyecto es parte de la plataforma QuickSpeak. Para contribuir:

1. Crea una rama desde `main`
2. Implementa tus cambios
3. Verifica que build funciona: `npm run build`
4. Verifica linting: `npm run lint`
5. Crea un Pull Request

---

## Recursos Adicionales

### Next.js
- [Documentación de Next.js](https://nextjs.org/docs)
- [App Router](https://nextjs.org/docs/app)
- [API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

### React
- [Documentación de React](https://react.dev/)
- [Hooks](https://react.dev/reference/react)
- [Context API](https://react.dev/reference/react/useContext)

### Tailwind CSS
- [Documentación de Tailwind](https://tailwindcss.com/docs)
- [Componentes](https://tailwindui.com/)

### TypeScript
- [Documentación de TypeScript](https://www.typescriptlang.org/docs/)
- [React + TypeScript](https://react-typescript-cheatsheet.netlify.app/)

---

## Licencia

Este proyecto es privado y pertenece a QuickSpeak.

---

## Contacto

Para preguntas o soporte:
- Email: kenneth@quickspeak.com
- GitHub: [@your-username](https://github.com/your-username)

---

**Última actualización**: Enero 2025
