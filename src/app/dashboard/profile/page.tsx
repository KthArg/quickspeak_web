"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import { useTheme } from "@/app/contexts/ThemeContext";
import { User, UserCog, Trophy } from "lucide-react";
import { apiClient } from "@/app/lib/api"; // <- usa tu api.ts

type ProfileDTO = {
  name: string;
  avatarSeed: string;
  flagUrl: string;
};

// --- SUB-COMPONENTE: Enlace del Perfil (Ahora reactivo al tema) ---
const ProfileLink = ({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) => {
  const { theme } = useTheme();
  return (
    <button
      className={`flex items-center gap-4 group transition-colors ${
        theme === "dark" ? "text-white" : "text-black"
      }`}
    >
      <div
        className={`${
          theme === "dark"
            ? "text-gray-300 group-hover:text-cyan-400"
            : "text-gray-800 group-hover:text-purple-600"
        }`}
      >
        {icon}
      </div>
      <span
        className={`font-semibold text-2xl sm:text-3xl ${
          theme === "dark"
            ? "group-hover:text-cyan-400"
            : "group-hover:text-purple-600"
        }`}
      >
        {text}
      </span>
    </button>
  );
};

const ProfilePage: NextPage = () => {
  const { theme } = useTheme();
  const [userData, setUserData] = useState<ProfileDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiClient.get<ProfileDTO>("/profile/basic");
        setUserData(data);
      } catch (err: any) {
        setErrorMsg(err?.message ?? "Error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div
      className={`w-full min-h-screen relative font-cabin flex flex-col items-center p-6 md:p-10 transition-colors ${
        theme === "dark"
          ? "bg-gradient-to-b from-[#232323] to-[#2c006e] text-white"
          : "bg-gradient-to-b from-white to-purple-200 text-black"
      }`}
    >
      <main className="w-full max-w-md flex flex-col items-center mt-10 gap-12 sm:gap-16">
        <header className="text-center">
          <h1 className="text-5xl sm:text-6xl font-bold">Profile</h1>
        </header>

        {/* Estados de carga / error */}
        {loading && <p className="text-xl opacity-80">Cargando perfil…</p>}
        {errorMsg && !loading && (
          <p className="text-red-400 text-center">{errorMsg}</p>
        )}

        {/* Contenido cuando hay datos */}
        {!loading && !errorMsg && userData && (
          <>
            <section className="flex flex-col items-center gap-4">
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full shadow-2xl">
                <Image
                  src={userData.flagUrl}
                  alt="User's country flag"
                  fill
                  className="rounded-full object-cover"
                />
                <Image
                  src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${userData.avatarSeed}`}
                  alt="User avatar"
                  fill
                  className="rounded-full p-2"
                  unoptimized
                />
              </div>
              <h2 className="text-4xl font-bold">{userData.name}</h2>
            </section>

            <nav className="flex flex-col items-start gap-6">
              <ProfileLink icon={<User size={32} />} text="Account" />
              <ProfileLink icon={<UserCog size={32} />} text="Personal info" />
              <ProfileLink icon={<Trophy size={32} />} text="Achievements" />
            </nav>
          </>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
