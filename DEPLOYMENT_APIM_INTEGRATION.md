# Deployment: Integración Frontend con APIM User Service

## 📋 Resumen

Este documento describe los pasos para desplegar el frontend de QuickSpeak integrado con el microservicio de usuarios a través de Azure API Management (APIM).

## ✅ Cambios Realizados

### 1. **API Routes Actualizadas**

Se actualizaron las siguientes rutas para usar APIM en lugar de llamar directamente al backend:

- ✅ `src/app/api/auth/login/route.ts` - Login con email/password
- ✅ `src/app/api/auth/signup/route.ts` - Registro de nuevos usuarios

**Cambios clave:**
- URL base cambió de `USER_SERVICE_URL` a `APIM_URL`
- Se agregó header `Ocp-Apim-Subscription-Key` para autenticación con APIM
- Endpoints ahora usan la ruta: `/users/api/v1/auth/*`

### 2. **Variables de Entorno**

El archivo `.env.local` fue actualizado con:

```env
# URL base de Azure APIM para QuickSpeak
NEXT_PUBLIC_API_BASE_URL=https://apim-quick-speak.azure-api.net

# API Key (Subscription Key) para APIM
NEXT_PUBLIC_API_KEY=c081b2299247481f827d5b08211624f2
```

**⚠️ IMPORTANTE**: Las variables `.env.local` NO se suben a Git por seguridad.

## 🚀 Pasos para Deployment en Producción

### Paso 1: Configurar Variables de Entorno en Azure

Tu aplicación frontend está desplegada en **Azure Static Web Apps** con modo standalone. Necesitas configurar las variables de entorno en Azure:

1. **Accede al Portal de Azure**
   ```
   Portal Azure → Static Web Apps → quickspeak-frontend (o el nombre de tu app)
   ```

2. **Navega a Configuration**
   ```
   Menú lateral → Configuration → Application settings
   ```

3. **Agrega las Variables de Entorno**

   Click en **"+ Add"** y agrega cada variable:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_API_BASE_URL` | `https://apim-quick-speak.azure-api.net` |
   | `NEXT_PUBLIC_API_KEY` | `c081b2299247481f827d5b08211624f2` |

4. **Guarda los Cambios**
   - Click en **"Save"**
   - La aplicación se reiniciará automáticamente

### Paso 2: Build y Deploy del Frontend

#### Opción A: Deploy Automático (GitHub Actions)

Si tu Static Web App está conectada con GitHub:

1. **Push los cambios al repositorio**
   ```bash
   cd /c/Users/Kenneth/Documents/TEC/diseño/proyecto/quickspeak
   git push origin user_service_integration
   ```

2. **GitHub Actions hará el deploy automáticamente**
   - Verifica el progreso en: `https://github.com/tu-usuario/quickspeak/actions`
   - El workflow de Azure Static Web Apps se ejecutará automáticamente

3. **Espera a que complete** (2-5 minutos)

#### Opción B: Deploy Manual con Azure CLI

Si prefieres deploy manual:

1. **Build la aplicación con standalone**
   ```bash
   cd /c/Users/Kenneth/Documents/TEC/diseño/proyecto/quickspeak
   npm run build
   ```

2. **Verifica que se creó .next/standalone**
   ```bash
   ls .next/standalone
   ```

3. **Deploy con SWA CLI (si está instalado)**
   ```bash
   npm install -g @azure/static-web-apps-cli
   swa deploy .next/standalone --app-name quickspeak-frontend
   ```

### Paso 3: Verificar el Deployment

#### 3.1 Verificar Variables de Entorno

Una vez deployado, verifica que las variables estén configuradas:

1. Abre tu aplicación en el navegador
2. Abre DevTools (F12) → Console
3. Ejecuta:
   ```javascript
   console.log(process.env.NEXT_PUBLIC_API_BASE_URL)
   console.log(process.env.NEXT_PUBLIC_API_KEY)
   ```

**Resultado esperado:**
```
https://apim-quick-speak.azure-api.net
c081b2299247481f827d5b08211624f2
```

#### 3.2 Probar Autenticación

1. **Ir a la página de Sign Up** en tu frontend
   ```
   https://tu-app.azurestaticapps.net/sign_up
   ```

2. **Registrar un nuevo usuario**
   - First Name: Test
   - Last Name: User
   - Email: test@quickspeak.com
   - Password: Password123!

3. **Verificar respuesta exitosa**
   - Deberías ver un JWT token en la respuesta
   - Deberías ser redirigido a `/pick_native_language`

4. **Probar Login**
   - Ir a `/login`
   - Ingresar credenciales del usuario creado
   - Verificar login exitoso

#### 3.3 Verificar en Network Tab

1. Abre DevTools → Network
2. Haz login o registro
3. Busca la request a `/api/auth/login` o `/api/auth/signup`
4. Verifica en los **Request Headers**:
   ```
   Ocp-Apim-Subscription-Key: c081b2299247481f827d5b08211624f2
   Content-Type: application/json
   ```

5. Verifica que la URL sea:
   ```
   https://apim-quick-speak.azure-api.net/users/api/v1/auth/login
   ```

## 🔧 Troubleshooting

### Error: "Missing subscription key"

**Problema**: La API Key no está configurada correctamente.

**Solución**:
1. Verifica que `NEXT_PUBLIC_API_KEY` esté en Application Settings de Azure
2. Reinicia la Static Web App
3. Limpia caché del navegador

### Error: "CORS error" o "Network error"

**Problema**: CORS no está configurado en APIM o backend.

**Solución**:
1. Verifica que el backend tenga CORS configurado (ya debería estar en `SecurityConfig.java`)
2. Verifica que APIM tenga política CORS si es necesario
3. Verifica que la URL del frontend esté permitida

### Error: 401 Unauthorized

**Problema**: La subscription key es incorrecta o expiró.

**Solución**:
1. Verifica la subscription key en APIM:
   ```
   Portal Azure → API Management → Subscriptions → quickspeak-subscription
   ```
2. Regenera la key si es necesario
3. Actualiza `NEXT_PUBLIC_API_KEY` en Azure Static Web App

### Error: 404 Not Found en endpoints

**Problema**: La ruta del endpoint es incorrecta.

**Solución**:
- Verifica que las rutas sean `/users/api/v1/auth/login` y `/users/api/v1/auth/register`
- Verifica que APIM tenga las operaciones configuradas correctamente

## 📊 Endpoints Configurados

### Autenticación

| Endpoint Frontend | Endpoint APIM | Backend Final |
|-------------------|---------------|---------------|
| `POST /api/auth/signup` | `POST /users/api/v1/auth/register` | User Service |
| `POST /api/auth/login` | `POST /users/api/v1/auth/login` | User Service |

### Headers Requeridos

| Header | Valor | Ubicación |
|--------|-------|-----------|
| `Content-Type` | `application/json` | Todos los requests |
| `Ocp-Apim-Subscription-Key` | `c081b2299247481f827d5b08211624f2` | Todos los requests a APIM |
| `Authorization` | `Bearer <token>` | Requests autenticados (automático) |

## 🎯 Próximos Pasos

### Endpoints Pendientes de Migración

Las siguientes API routes aún NO están migradas a APIM:

- `/api/languages/*` - Gestión de idiomas
- `/api/user/languages/*` - Idiomas del usuario
- `/api/profile/*` - Perfil de usuario
- `/api/chat/*` - Chat
- `/api/dictionary/*` - Diccionario
- `/api/speakers/*` - Speakers

**Nota**: Estos endpoints parecen apuntar a otros microservicios o tienen rutas diferentes. Revisar y migrar según sea necesario.

### Mejoras Sugeridas

1. **Implementar refresh token** para sesiones más largas
2. **Agregar rate limiting** en frontend para evitar spam
3. **Implementar retry logic** con exponential backoff
4. **Agregar monitoring** con Application Insights
5. **Configurar diferentes subscription keys** para dev/staging/prod

## 📚 Recursos

- **APIM Management**: https://portal.azure.com → API Management → apim-quick-speak
- **Backend Service**: https://user-service-quickspeak-dzaheeemekcpaqfg.chilecentral-01.azurewebsites.net
- **APIM Gateway**: https://apim-quick-speak.azure-api.net
- **Frontend**: https://tu-app.azurestaticapps.net

## ✅ Checklist de Deployment

- [ ] Variables de entorno configuradas en Azure Static Web App
- [ ] Código pushed al repositorio (si usas GitHub Actions)
- [ ] Build completado exitosamente
- [ ] Deployment completado
- [ ] Registro de usuario funciona
- [ ] Login funciona
- [ ] JWT token se guarda en localStorage
- [ ] Headers APIM se envían correctamente
- [ ] No hay errores en DevTools Console
- [ ] No hay errores CORS

---

🤖 Generado con Claude Code
Fecha: 2025-11-15
