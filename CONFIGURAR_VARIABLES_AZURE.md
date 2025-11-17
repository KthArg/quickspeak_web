# Configurar Variables de Entorno en Azure Static Web App

## Problema Solucionado

El endpoint `/api/languages/select-native` retornaba error 500 porque:
1. ❌ El mapeo de ruta no estaba configurado en `apiClient.mapEndpoint()`
2. ⚠️ Las variables de entorno podrían no estar configuradas en Azure

## ✅ Fix Aplicado

**Archivo modificado:** `src/app/lib/api.ts`

```typescript
// Agregado mapeo para /languages/select-native
if (endpoint === "/languages/select-native") {
  return "/users/api/v1/languages/select-native";
}
```

**Commit:** `3a2697d` - Fix endpoint mapping for /languages/select-native

---

## 📋 Configurar Variables de Entorno en Azure Static Web App

Para que el frontend funcione correctamente en producción, **debes configurar las siguientes variables de entorno** en Azure Portal:

### Variables Requeridas

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://apim-quick-speak.azure-api.net` | URL base de Azure APIM |
| `NEXT_PUBLIC_API_KEY` | `c081b2299247481f827d5b08211624f2` | Subscription Key de APIM |

---

## 🔧 Pasos para Configurar en Azure Portal

### Opción 1: Azure Portal (UI)

1. **Ir a Azure Portal:** https://portal.azure.com

2. **Navegar a tu Static Web App:**
   - Buscar "Static Web Apps"
   - Click en tu app: **quickspeak-web-g5f7b5c6b7bearf6**

3. **Configurar Variables de Entorno:**
   - En el menú izquierdo, click en **"Configuration"**
   - Tab **"Application settings"**
   - Click **"+ Add"**

4. **Agregar cada variable:**

   **Variable 1:**
   - Name: `NEXT_PUBLIC_API_BASE_URL`
   - Value: `https://apim-quick-speak.azure-api.net`
   - Click **"OK"**

   **Variable 2:**
   - Name: `NEXT_PUBLIC_API_KEY`
   - Value: `c081b2299247481f827d5b08211624f2`
   - Click **"OK"**

5. **Guardar cambios:**
   - Click **"Save"** en la parte superior
   - Esperar a que se apliquen los cambios

6. **Reiniciar la aplicación (opcional):**
   - En "Overview", click **"Restart"**

---

### Opción 2: Azure CLI

```bash
# Configurar variables de entorno
az staticwebapp appsettings set \
  --name quickspeak-web-g5f7b5c6b7bearf6 \
  --resource-group <tu-resource-group> \
  --setting-names \
    NEXT_PUBLIC_API_BASE_URL=https://apim-quick-speak.azure-api.net \
    NEXT_PUBLIC_API_KEY=c081b2299247481f827d5b08211624f2
```

---

### Opción 3: GitHub Actions (Secretos)

Si estás usando GitHub Actions para deployment:

1. **Ir a tu repositorio en GitHub**
2. **Settings** → **Secrets and variables** → **Actions**
3. **Agregar secretos:**
   - `NEXT_PUBLIC_API_BASE_URL`
   - `NEXT_PUBLIC_API_KEY`

4. **Actualizar workflow** (`.github/workflows/azure-static-web-apps-*.yml`):
   ```yaml
   env:
     NEXT_PUBLIC_API_BASE_URL: ${{ secrets.NEXT_PUBLIC_API_BASE_URL }}
     NEXT_PUBLIC_API_KEY: ${{ secrets.NEXT_PUBLIC_API_KEY }}
   ```

---

## ✅ Verificación

Después de configurar las variables de entorno y hacer redeploy:

### 1. Verificar que las variables están configuradas

```bash
az staticwebapp appsettings list \
  --name quickspeak-web-g5f7b5c6b7bearf6 \
  --resource-group <tu-resource-group>
```

### 2. Probar el endpoint en el navegador

1. Navegar a: https://quickspeak-web-g5f7b5c6b7bearf6.chilecentral-01.azurewebsites.net
2. Ir a la página de registro
3. Después de registrarte, ir a "Pick Native Language"
4. **Verificar que se cargue la lista de idiomas sin errores**

### 3. Verificar en DevTools

**Abrir DevTools (F12) → Network Tab:**

**Request esperado:**
```
GET https://quickspeak-web-g5f7b5c6b7bearf6.chilecentral-01.azurewebsites.net/api/languages/select-native
Status: 200 OK
```

**Headers esperados:**
```
Ocp-Apim-Subscription-Key: c081b2299247481f827d5b08211624f2
```

**Response esperado:**
```json
[
  {
    "id": 1,
    "name": "English",
    "code": "en",
    "flagUrl": "https://flagcdn.com/us.svg"
  },
  // ... más idiomas
]
```

---

## 🔍 Troubleshooting

### Error: 500 Internal Server Error
**Causa:** Variables de entorno no configuradas o mapeo incorrecto

**Solución:**
1. Verificar que las variables estén configuradas en Azure
2. Verificar que el código tenga el mapeo correcto (commit `3a2697d`)
3. Hacer redeploy del frontend

### Error: 404 Not Found
**Causa:** Endpoint no existe en APIM

**Solución:**
1. Verificar que APIM tenga el endpoint `/users/api/v1/languages/select-native`
2. Reimportar OpenAPI spec en APIM (ver `ACTUALIZAR_APIM.md` en user_service_quickspeak)

### Error: 401 Unauthorized
**Causa:** Subscription key incorrecta o faltante

**Solución:**
1. Verificar que `NEXT_PUBLIC_API_KEY` esté configurada
2. Verificar que el valor sea `c081b2299247481f827d5b08211624f2`
3. Verificar que APIM esté configurado para aceptar esta subscription key

### No se aplican los cambios
**Causa:** Azure Static Web App está cacheando la versión anterior

**Solución:**
1. En Azure Portal → Static Web App → Overview → Click **"Restart"**
2. Limpiar caché del navegador (Ctrl+Shift+Delete)
3. Esperar 2-3 minutos para que se propague el deployment

---

## 📊 Flujo Completo de la Request

```
Usuario → Frontend (Next.js)
    ↓
/api/languages/select-native (Route Handler)
    ↓
apiClient.get('/languages/select-native')
    ↓
mapEndpoint() → '/users/api/v1/languages/select-native'
    ↓
https://apim-quick-speak.azure-api.net/users/api/v1/languages/select-native
    ↓
APIM (con subscription key en header)
    ↓
Backend user-service-quickspeak.azurewebsites.net
    ↓
GET /api/v1/languages/select-native
    ↓
Retorna lista de 10 idiomas
```

---

## 📝 Archivos Modificados

| Archivo | Cambio | Commit |
|---------|--------|--------|
| `src/app/lib/api.ts` | Agregado mapeo para `/languages/select-native` | `3a2697d` |
| `src/app/api/languages/select-native/route.ts` | Agregado método GET | `ba60c19` |

---

## 🚀 Próximos Pasos

1. ✅ Configurar variables de entorno en Azure Static Web App
2. ✅ Esperar a que se complete el deployment automático (GitHub Actions)
3. ✅ Probar la funcionalidad en el navegador
4. ✅ Verificar que no haya errores en la consola del navegador

---

**Última actualización:** 2025-11-16
**Estado:** Listo para configurar en Azure
