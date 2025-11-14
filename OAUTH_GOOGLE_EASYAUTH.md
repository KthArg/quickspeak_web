# Integración OAuth con Google (Azure EasyAuth)

## Descripción

El frontend de QuickSpeak ahora soporta autenticación OAuth con Google mediante Azure EasyAuth, integrado completamente con el microservicio de usuarios para generar tokens JWT consistentes.

## Arquitectura del Flujo OAuth

```
1. Usuario hace clic en "Login with Google"
   ↓
2. Azure EasyAuth maneja OAuth con Google
   ↓
3. Usuario autentica en Google y otorga permisos
   ↓
4. Azure redirige a /auth/callback
   ↓
5. Callback obtiene info del usuario de /.auth/me
   ↓
6. Callback envía info al microservicio (POST /api/v1/auth/oauth)
   ↓
7. Microservicio crea/actualiza usuario y genera JWT
   ↓
8. Frontend guarda JWT en localStorage
   ↓
9. Redirige al dashboard o setup de idioma
```

## Componentes Implementados

### Backend (Microservicio - Spring Boot)

#### 1. **OAuthLoginRequest.java** (DTO)
Ubicación: `src/main/java/com/yourteacher/userservice/adapter/in/web/dto/`

```java
{
  "email": "user@gmail.com",
  "firstName": "John",
  "lastName": "Doe",
  "provider": "google",
  "providerId": "1234567890"
}
```

#### 2. **OAuthLoginUseCase.java** (Puerto de entrada)
Ubicación: `src/main/java/com/yourteacher/userservice/domain/port/in/`

Define el contrato para autenticación OAuth.

#### 3. **OAuthLoginService.java** (Servicio de aplicación)
Ubicación: `src/main/java/com/yourteacher/userservice/application/service/`

Lógica de negocio:
- Busca usuario existente por email
- Si existe: actualiza información si cambió
- Si no existe: crea usuario nuevo con rol STUDENT
- Genera token JWT
- Retorna respuesta indicando si es usuario nuevo

#### 4. **AuthController.java** - Endpoint OAuth
Ubicación: `src/main/java/com/yourteacher/userservice/adapter/in/web/`

**Endpoint**: `POST /api/v1/auth/oauth`

**Request Body**:
```json
{
  "email": "user@gmail.com",
  "firstName": "John",
  "lastName": "Doe",
  "provider": "google",
  "providerId": "1234567890"
}
```

**Response** (200 o 201):
```json
{
  "token": "eyJhbGciOiJIUzM4NCJ9...",
  "userId": 1,
  "email": "user@gmail.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

- **201 Created**: Usuario nuevo creado
- **200 OK**: Usuario existente actualizado

#### 5. **SecurityConfig.java**
El endpoint `/api/v1/auth/oauth` está configurado como público (no requiere autenticación).

### Frontend (Next.js)

#### 1. **route.ts** - Endpoint EasyAuth Info
Ubicación: `src/app/api/auth/easyauth-info/route.ts`

**Endpoint**: `GET /api/auth/easyauth-info`

Consulta `/.auth/me` de Azure EasyAuth y extrae:
- Email
- Nombre completo
- Nombre de pila (givenName)
- Apellido (surname)
- Provider (google, facebook, etc.)
- Provider ID

**Response**:
```json
{
  "provider": "google",
  "providerId": "1234567890",
  "email": "user@gmail.com",
  "name": "John Doe",
  "givenName": "John",
  "surname": "Doe"
}
```

#### 2. **page.tsx** - Página de Callback OAuth
Ubicación: `src/app/auth/callback/page.tsx`

**Ruta**: `/auth/callback`

**Funcionalidad**:
1. Obtiene información del usuario de EasyAuth (`/api/auth/easyauth-info`)
2. Procesa y formatea nombre/apellido
3. Envía datos al microservicio (`POST /api/v1/auth/oauth`)
4. Guarda JWT token en localStorage
5. Redirige según tipo de usuario:
   - Usuario nuevo (201) → `/pick_native_language`
   - Usuario existente (200) → `/dashboard/speakers`

#### 3. **Enlaces de Google Actualizados**

**Login Page** (`src/app/login/page.tsx`):
```html
<a href="/.auth/login/google?post_login_redirect_uri=/auth/callback">
  <FcGoogle size={32} />
</a>
```

**Signup Page** (`src/app/sign_up/page.tsx`):
```html
<a href="/.auth/login/google?post_login_redirect_uri=/auth/callback">
  <FcGoogle size={32} />
</a>
```

## Flujo Detallado

### En Producción (Azure Static Web Apps con EasyAuth)

1. **Usuario hace clic en botón de Google**
   - URL: `/.auth/login/google?post_login_redirect_uri=/auth/callback`

2. **Azure EasyAuth redirige a Google OAuth**
   - Usuario inicia sesión en Google
   - Google solicita permisos
   - Usuario acepta permisos

3. **Google redirige de vuelta a Azure**
   - Azure EasyAuth procesa la respuesta
   - Crea sesión de autenticación
   - Redirige a `/auth/callback`

4. **Página de Callback se ejecuta**
   ```typescript
   // Obtener info de EasyAuth
   const response = await fetch('/api/auth/easyauth-info');
   const userData = await response.json();

   // Enviar al microservicio
   const authResponse = await fetch(`${USER_SERVICE_URL}/api/v1/auth/oauth`, {
     method: 'POST',
     body: JSON.stringify({
       email: userData.email,
       firstName: userData.givenName || firstName,
       lastName: userData.surname || lastName,
       provider: userData.provider,
       providerId: userData.providerId
     })
   });

   // Guardar token
   tokenManager.saveToken(authResponse.token);

   // Redirigir
   window.location.href = authResponse.status === 201
     ? '/pick_native_language'
     : '/dashboard/speakers';
   ```

5. **Microservicio procesa la solicitud**
   - Busca usuario por email
   - Si no existe, crea usuario nuevo
   - Genera JWT token con información del usuario
   - Retorna token + datos de usuario

6. **Frontend guarda token y redirige**
   - Token JWT guardado en localStorage
   - Usuario redirigido a la página apropiada

### En Desarrollo Local

**NOTA IMPORTANTE**: Azure EasyAuth **no funciona en desarrollo local** (`http://localhost:3001`).

Para desarrollo local, debes:
1. Usar autenticación email/password
2. O configurar un servidor de desarrollo que simule EasyAuth
3. O desplegar a Azure Static Web Apps en un ambiente de staging

## Configuración de Azure EasyAuth

### Requisitos

1. **Azure Static Web App creada**
2. **EasyAuth habilitado** en el portal de Azure
3. **Google OAuth configurado** con credenciales válidas

### Pasos de Configuración

1. **Portal Azure** → Tu Static Web App → **Authentication**

2. **Add identity provider** → **Google**

3. **Configurar Google OAuth**:
   - Client ID (de Google Cloud Console)
   - Client Secret (de Google Cloud Console)
   - Scopes: `openid`, `profile`, `email`

4. **Configuración de Google Cloud Console**:
   - Crear proyecto en Google Cloud Console
   - Habilitar Google+ API
   - Crear credenciales OAuth 2.0
   - Authorized redirect URIs:
     ```
     https://tu-app.azurestaticapps.net/.auth/login/google/callback
     ```

5. **Variables de entorno en Azure**:
   ```
   NEXT_PUBLIC_USER_SERVICE_URL=https://tu-microservicio.azurewebsites.net
   ```

## Manejo de Usuarios

### Usuario Nuevo (Primera vez con Google)

```
POST /api/v1/auth/oauth → 201 Created
{
  "token": "...",
  "userId": 1,
  "email": "newuser@gmail.com",
  "firstName": "New",
  "lastName": "User"
}

→ Redirige a /pick_native_language
```

### Usuario Existente

```
POST /api/v1/auth/oauth → 200 OK
{
  "token": "...",
  "userId": 5,
  "email": "existinguser@gmail.com",
  "firstName": "Existing",
  "lastName": "User"
}

→ Redirige a /dashboard/speakers
```

## Claims de EasyAuth

Azure EasyAuth proporciona claims del usuario en `/.auth/me`:

```json
[
  {
    "provider_name": "google",
    "user_id": "1234567890",
    "user_claims": [
      {
        "typ": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
        "val": "user@gmail.com"
      },
      {
        "typ": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
        "val": "John Doe"
      },
      {
        "typ": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname",
        "val": "John"
      },
      {
        "typ": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname",
        "val": "Doe"
      }
    ]
  }
]
```

## Seguridad

### JWT Token

- **Algoritmo**: HS384 (HMAC with SHA-384)
- **Expiración**: 24 horas
- **Almacenamiento**: localStorage (clave: `authToken`)
- **Uso**: Header `Authorization: Bearer <token>`

### Password para Usuarios OAuth

Los usuarios creados vía OAuth tienen una contraseña aleatoria generada que **no se puede usar** para login con email/password. Solo pueden autenticarse vía OAuth.

```java
// En OAuthLoginService.java
.password(UUID.randomUUID().toString()) // Password aleatorio no utilizable
```

Si un usuario OAuth quiere usar email/password, debe:
1. Ir a "Olvidé mi contraseña"
2. Configurar una nueva contraseña

## Testing

### Probar en Local (Solo email/password)

```bash
# Registro
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Probar OAuth (Solo en Producción/Azure)

1. Desplegar a Azure Static Web Apps
2. Configurar EasyAuth con Google
3. Navegar a la página de login
4. Hacer clic en "Login with Google"
5. Verificar redirección y token JWT guardado

### Simular OAuth en Local (Para Testing)

Puedes crear un endpoint mock que simule EasyAuth:

```typescript
// src/app/api/auth/mock-easyauth/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json();

  return NextResponse.json({
    provider: 'google',
    providerId: 'mock-123',
    email: body.email,
    name: body.name,
    givenName: body.givenName,
    surname: body.surname,
  });
}
```

## Troubleshooting

### Error: "Not authenticated via EasyAuth"

**Causa**: EasyAuth no está configurado o no estás en producción.

**Solución**:
- Verifica configuración de EasyAuth en Azure
- Usa email/password en desarrollo local

### Error: "Failed to get authentication information"

**Causa**: Problema con los claims de EasyAuth.

**Solución**:
- Verifica que Google OAuth esté configurado correctamente
- Revisa los scopes solicitados (`openid`, `profile`, `email`)

### Error: "Failed to create user session"

**Causa**: El microservicio no puede crear/actualizar el usuario.

**Solución**:
- Verifica que `NEXT_PUBLIC_USER_SERVICE_URL` esté configurado
- Verifica que el microservicio esté en ejecución
- Revisa logs del microservicio

### Usuario redirigido pero sin token

**Causa**: Token no se guardó en localStorage.

**Solución**:
- Abre Developer Tools → Console
- Busca errores en el callback
- Verifica que el microservicio retorne el token

## Archivos Modificados/Creados

### Microservicio

- ✅ `OAuthLoginRequest.java` (nuevo)
- ✅ `OAuthLoginUseCase.java` (nuevo)
- ✅ `OAuthLoginService.java` (nuevo)
- ✅ `AuthController.java` (modificado - agregado endpoint `/oauth`)
- ✅ `SecurityConfig.java` (modificado - endpoint público)

### Frontend

- ✅ `src/app/api/auth/easyauth-info/route.ts` (nuevo)
- ✅ `src/app/auth/callback/page.tsx` (nuevo)
- ✅ `src/app/login/page.tsx` (modificado - URL de Google)
- ✅ `src/app/sign_up/page.tsx` (modificado - URL de Google)

## Referencias

- [Azure Static Web Apps Authentication](https://learn.microsoft.com/en-us/azure/static-web-apps/authentication-authorization)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)
