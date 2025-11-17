// src/app/lib/auth.ts
import jwt from "jsonwebtoken";

const SECRET = process.env.NOTIFICATION_JWT_SECRET || "hola123";

export type JwtPayload = { sub: string; email?: string };

export function getAuthorizationHeader(req: Request): string | null {
  const h = req.headers.get("authorization") || req.headers.get("Authorization");
  return h && h.startsWith("Bearer ") ? h.substring(7) : null;
}

export function getUserFromJwt(token: string | null): JwtPayload | null {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, SECRET) as JwtPayload;
    if (!decoded?.sub) return null;
    return decoded;
  } catch {
    return null;
  }
}

export function resolveUserIdFromRequest(req: Request): string {
  const token = getAuthorizationHeader(req);
  const user = getUserFromJwt(token);
  if (user?.sub) return user.sub;
  return "123"; 
}
