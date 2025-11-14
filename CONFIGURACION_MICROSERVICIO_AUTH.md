# Configuración del Microservicio de Autenticación

## Descripción

El frontend de QuickSpeak ahora está integrado con el microservicio de autenticación de usuarios (`user_service_quickspeak`) para manejar:
- Registro con email/password
- Login con email/password
- **Login con Google OAuth (Azure EasyAuth)** ✨

## Arquitectura

```
Frontend (Next.js) → API Routes → Microservicio de Usuarios (Spring Boot)
                                  ↓
                                  JWT Token
```

### Flujo de Autenticación

1. **Registro de Usuario**:
   - Frontend: `POST /sign_up` (página)
   - API Route: `POST /api/auth/signup`
   - Microservicio: `POST /api/v1/auth/register`
   - Respuesta: `{ token, userId, email, firstName, lastName }`

2. **Login de Usuario**:
   - Frontend: `POST /login` (página)
   - API Route: `POST /api/auth/login`
   - Microservicio: `POST /api/v1/auth/login`
   - Respuesta: `{ token, userId, email, firstName, lastName }`

3. **Almacenamiento de Token**:
   - El JWT token se guarda automáticamente en `localStorage` con la clave `authToken`
   - El token se incluye automáticamente en todas las peticiones subsecuentes mediante el header `Authorization: Bearer <token>`

## Configuración de Variables de Entorno

### Archivo `.env.local`

```env
# URL base de la API principal (Azure APIM)
NEXT_PUBLIC_API_BASE_URL=https://apiprojectmanagement.azure-api.net

# API Key para Azure APIM
NEXT_PUBLIC_API_KEY=d8d4809f338343028dbf6ed8536b2194

# URL del microservicio de usuarios
# Para desarrollo local: http://localhost:8082
# Para producción: https://your-user-service-url.azurewebsites.net
NEXT_PUBLIC_USER_SERVICE_URL=http://localhost:8082
```

### Desarrollo Local

Para trabajar en desarrollo local:

1. Asegúrate de que el microservicio esté corriendo en `http://localhost:8082`
2. En `.env.local`, configura:
   ```env
   NEXT_PUBLIC_USER_SERVICE_URL=http://localhost:8082
   ```

### Producción

Para desplegar en producción:

1. Despliega el microservicio a Azure (o tu servidor de producción)
2. Obtén la URL de producción (ejemplo: `https://user-service-quickspeak.azurewebsites.net`)
3. En `.env.local` (o en las variables de entorno de Azure Static Web Apps), configura:
   ```env
   NEXT_PUBLIC_USER_SERVICE_URL=https://user-service-quickspeak.azurewebsites.net
   ```

**IMPORTANTE**: En Azure Static Web Apps, configura esta variable en:
- Portal Azure → Static Web Apps → Configuration → Application settings
- Agrega: `NEXT_PUBLIC_USER_SERVICE_URL=https://tu-url-produccion`

## Archivos Modificados

### Frontend

1. **`.env.local`**: Agregada variable `NEXT_PUBLIC_USER_SERVICE_URL`
2. **`src/app/api/auth/login/route.ts`**: Modificado para llamar al microservicio
3. **`src/app/api/auth/signup/route.ts`**: Modificado para llamar al microservicio
4. **`.env.example`**: Creado con documentación de variables

### Microservicio

No se requieren cambios en el microservicio. Los endpoints ya están implementados:
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

## Pruebas

### Probar Registro

```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"John","lastName":"Doe"}'
```

**Respuesta esperada (201)**:
```json
{
  "ok": true,
  "token": "eyJhbGciOiJIUzM4NCJ9...",
  "userId": 1,
  "email": "test@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "user": { "id": 1, "email": "test@example.com" },
  "next": "/pick_native_language"
}
```

### Probar Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Respuesta esperada (200)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzM4NCJ9...",
  "user": {
    "email": "test@example.com",
    "name": "John Doe"
  },
  "expiresIn": 86400
}
```

## Verificación

Para verificar que el token JWT está funcionando:

1. Registra o haz login desde el frontend
2. El token se guarda automáticamente en `localStorage`
3. Abre las Developer Tools del navegador
4. Consola → `localStorage.getItem('authToken')` - deberías ver el token JWT
5. Las peticiones subsecuentes incluirán el header `Authorization: Bearer <token>`

## Solución de Problemas

### Error: "Network error. Please try again."

- Verifica que el microservicio esté corriendo en el puerto 8082
- Verifica que `NEXT_PUBLIC_USER_SERVICE_URL` apunte a la URL correcta
- Verifica los logs del microservicio para ver si hay errores

### Error: CORS

Si encuentras errores de CORS, verifica que el microservicio tenga configurado correctamente:
- En `SecurityConfig.java`, el CORS debe permitir `http://localhost:3000` y `http://localhost:3001`

### Error: "Authentication failed"

- Verifica que el email y password sean correctos
- Revisa los logs del microservicio para más detalles
- Verifica que el usuario esté activo (`status: ACTIVE`)

## Autenticación OAuth con Google

Para información detallada sobre la integración de Google OAuth con Azure EasyAuth, consulta:

📄 **[OAUTH_GOOGLE_EASYAUTH.md](./OAUTH_GOOGLE_EASYAUTH.md)**

### Resumen OAuth

1. Usuario hace clic en "Login with Google"
2. Azure EasyAuth maneja OAuth con Google
3. Usuario es redirigido a `/auth/callback`
4. Callback obtiene información del usuario y la envía al microservicio
5. Microservicio crea/actualiza usuario y genera JWT
6. Token se guarda en localStorage
7. Usuario es redirigido al dashboard

**Endpoints OAuth**:
- Frontend Callback: `GET /auth/callback`
- EasyAuth Info: `GET /api/auth/easyauth-info`
- Microservicio OAuth: `POST /api/v1/auth/oauth`

**NOTA**: OAuth con Google solo funciona en producción (Azure Static Web Apps con EasyAuth configurado), no en desarrollo local.

## Información Adicional

- **JWT Expiration**: 24 horas (86400 segundos)
- **Algoritmo JWT**: HS384 (HMAC with SHA-384)
- **Base de datos**: H2 en memoria (desarrollo) / PostgreSQL (producción)
- **Puerto Frontend**: 3001 (desarrollo)
- **Puerto Microservicio**: 8082
- **Métodos de Autenticación**: Email/Password, Google OAuth (Azure EasyAuth)
