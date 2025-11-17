// app/api/auth/login/route.ts
import { apiClient } from "@/app/lib/api";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NOTIFICATION_JWT_SECRET || "hola123";
const JWT_ALG = "HS256";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data: any = await apiClient.post("/auth/login", body);
    // data puede traer { success, user, token, ... }

    // tratar de sacar el user del backend
    const backendUser =
      data?.user ||
      data?.data?.user ||
      null;

    // armar un userId 
    let userId =
      backendUser?.id ||
      backendUser?._id ||
      data?.userId ||
      data?.id ||
      body?.email ||
      "123";

    // ver si el backend YA nos dio un JWT 
    let finalToken = data?.token || data?.access_token || null;
    const isJwt =
      typeof finalToken === "string" &&
      finalToken.split(".").length === 3;

    //  si no parece JWT, lo creamos nosotros 
    if (!isJwt) {
      finalToken = jwt.sign(
        {
          sub: userId,
          email: backendUser?.email || body?.email,
          name: backendUser?.name || backendUser?.fullName || "",
        },
        JWT_SECRET,
        {
          algorithm: JWT_ALG,
          expiresIn: "2h",
        }
      );
    }

    // devolver todo como siempre + nuestro token 
    return NextResponse.json({
      ...data,
      token: finalToken,
      userId,
    });
  } catch (error: any) {
    console.error("Login API error:", error?.message || error);
    return NextResponse.json(
      { error: error.message || "Login failed" },
      { status: 500 }
    );
  }
}
