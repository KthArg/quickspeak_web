"use client";

import type { NextPage } from "next";
import Image from "next/image";
import { useTheme } from "@/app/contexts/ThemeContext";
import { User, UserCog, Trophy } from "lucide-react";
import { useUser } from "@/hooks/useUser";

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
  const { profile, loading, error } = useUser();

  if (loading) {
    return (
      <div
        className={`w-full min-h-screen relative font-cabin flex items-center justify-center transition-colors
          ${
            theme === "dark"
              ? "bg-gradient-to-b from-[#232323] to-[#2c006e] text-white"
              : "bg-gradient-to-b from-white to-purple-200 text-black"
          }`}
      >
        <div className="text-xl">Loading profile...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div
        className={`w-full min-h-screen relative font-cabin flex items-center justify-center transition-colors
          ${
            theme === "dark"
              ? "bg-gradient-to-b from-[#232323] to-[#2c006e] text-white"
              : "bg-gradient-to-b from-white to-purple-200 text-black"
          }`}
      >
        <div className="text-xl text-red-500">
          Error: {error || "Failed to load profile"}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full min-h-screen relative font-cabin flex flex-col items-center p-6 md:p-10 transition-colors
        ${
          theme === "dark"
            ? "bg-gradient-to-b from-[#232323] to-[#2c006e] text-white"
            : "bg-gradient-to-b from-white to-purple-200 text-black"
        }`}
    >
      <main className="w-full max-w-md flex flex-col items-center mt-10 gap-12 sm:gap-16">
        <header className="text-center">
          <h1 className="text-5xl sm:text-6xl font-bold">Profile</h1>
        </header>

        <section className="flex flex-col items-center gap-4">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full shadow-2xl">
            <Image
              src={profile.avatar}
              alt="User avatar"
              layout="fill"
              className="rounded-full object-cover"
              unoptimized={true}
            />
          </div>
          <h2 className="text-4xl font-bold">{profile.name}</h2>
          <div className="text-center">
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Native: {profile.nativeLanguage}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Learning: {profile.learningLanguages.join(", ")}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Level: {profile.level}
            </p>
          </div>
        </section>

        <nav className="flex flex-col items-start gap-6">
          <ProfileLink icon={<User size={32} />} text="Account" />
          <ProfileLink icon={<UserCog size={32} />} text="Personal info" />
          <ProfileLink icon={<Trophy size={32} />} text="Achievements" />
        </nav>

        {profile.stats && (
          <section className="w-full bg-white/10 rounded-2xl p-6 mt-6">
            <h3 className="text-2xl font-bold mb-4 text-center">Statistics</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-cyan-400">
                  {profile.stats.totalWords}
                </div>
                <div className="text-sm">Words</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-400">
                  {profile.stats.totalChats}
                </div>
                <div className="text-sm">Chats</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-400">
                  {profile.stats.streakDays}
                </div>
                <div className="text-sm">Streak Days</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-400">
                  {profile.stats.hoursLearned}
                </div>
                <div className="text-sm">Hours</div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
