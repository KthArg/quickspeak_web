"use client";

import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import { useTheme } from "@/app/contexts/ThemeContext";
import { ArrowLeft, User, Lock, Save, Eye, EyeOff } from "lucide-react";
import { apiClient } from "@/app/lib/api";
import { useToast, ToastContainer } from "@/app/components/Toast";

type UserProfile = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
};

const ProfilePage: NextPage = () => {
  const { theme } = useTheme();
  const { toasts, showToast, removeToast } = useToast();

  // Estados para el perfil
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Estados para el formulario de perfil
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Estados para cambio de contraseña
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados para modo de edición
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);

  // Cargar perfil del usuario
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await apiClient.get<UserProfile>("/user");
        console.log("User profile response:", data);

        setProfile(data);
        setEmail(data.email);
        setFirstName(data.firstName);
        setLastName(data.lastName);
      } catch (e: any) {
        console.error("Error loading profile:", e);
        showToast(e?.message || "Error loading profile", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);

      // Validaciones básicas
      if (!email || !firstName || !lastName) {
        showToast("All fields are required", "error");
        return;
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
        showToast("Please enter a valid email address", "error");
        return;
      }

      // Actualizar perfil - necesitamos incluir password aunque no lo cambiemos
      // El backend requiere todos los campos
      await apiClient.put("/user", {
        email,
        firstName,
        lastName,
        password: profile?.email === email ? "unchanged_placeholder_123" : newPassword || "unchanged_placeholder_123"
      });

      // Actualizar estado local
      if (profile) {
        setProfile({ ...profile, email, firstName, lastName });
      }

      setEditingProfile(false);
      showToast("Profile updated successfully!", "success");
    } catch (e: any) {
      console.error("Error saving profile:", e);
      showToast(e?.message || "Error updating profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setSaving(true);

      // Validaciones
      if (!currentPassword || !newPassword || !confirmPassword) {
        showToast("All password fields are required", "error");
        return;
      }

      if (newPassword.length < 8) {
        showToast("New password must be at least 8 characters", "error");
        return;
      }

      if (newPassword !== confirmPassword) {
        showToast("New passwords do not match", "error");
        return;
      }

      // Actualizar contraseña
      await apiClient.put("/user", {
        email: profile?.email,
        firstName: profile?.firstName,
        lastName: profile?.lastName,
        password: newPassword
      });

      // Limpiar campos
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setEditingPassword(false);

      showToast("Password changed successfully!", "success");
    } catch (e: any) {
      console.error("Error changing password:", e);
      showToast(e?.message || "Error changing password", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelProfile = () => {
    if (profile) {
      setEmail(profile.email);
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
    }
    setEditingProfile(false);
  };

  const handleCancelPassword = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setEditingPassword(false);
  };

  if (loading) {
    return (
      <div className={`w-full min-h-screen flex items-center justify-center ${
        theme === "dark"
          ? "bg-gradient-to-b from-[#232323] to-[#2c006e]"
          : "bg-gradient-to-b from-white to-purple-200"
      }`}>
        <p className={`text-xl ${theme === "dark" ? "text-white" : "text-black"}`}>
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div
      className={`w-full min-h-screen font-cabin p-6 md:p-10 transition-colors ${
        theme === "dark"
          ? "bg-gradient-to-b from-[#232323] to-[#2c006e] text-white"
          : "bg-gradient-to-b from-white to-purple-200 text-black"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <a href="/dashboard/settings">
            <ArrowLeft
              className={`w-10 h-10 cursor-pointer ${
                theme === "dark" ? "text-white" : "text-gray-600"
              }`}
            />
          </a>
          <h1 className="text-4xl md:text-5xl font-bold">Profile Settings</h1>
        </div>

        {/* Profile Information Section */}
        <div
          className={`rounded-3xl p-6 md:p-8 mb-6 shadow-xl ${
            theme === "dark"
              ? "bg-gray-800/50 border-2 border-cyan-400/30"
              : "bg-white border-2 border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold">Profile Information</h2>
          </div>

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!editingProfile}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  editingProfile
                    ? theme === "dark"
                      ? "bg-gray-700 border-cyan-400/50 text-white focus:border-cyan-400"
                      : "bg-white border-cyan-400 text-black focus:border-cyan-500"
                    : theme === "dark"
                    ? "bg-gray-800/50 border-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
                } focus:outline-none`}
              />
            </div>

            {/* First Name */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}>
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={!editingProfile}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  editingProfile
                    ? theme === "dark"
                      ? "bg-gray-700 border-cyan-400/50 text-white focus:border-cyan-400"
                      : "bg-white border-cyan-400 text-black focus:border-cyan-500"
                    : theme === "dark"
                    ? "bg-gray-800/50 border-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
                } focus:outline-none`}
              />
            </div>

            {/* Last Name */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}>
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={!editingProfile}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  editingProfile
                    ? theme === "dark"
                      ? "bg-gray-700 border-cyan-400/50 text-white focus:border-cyan-400"
                      : "bg-white border-cyan-400 text-black focus:border-cyan-500"
                    : theme === "dark"
                    ? "bg-gray-800/50 border-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
                } focus:outline-none`}
              />
            </div>
          </div>

          {/* Profile Buttons */}
          <div className="flex gap-3 mt-6">
            {!editingProfile ? (
              <button
                onClick={() => setEditingProfile(true)}
                className={`flex-1 py-3 rounded-xl font-bold text-lg transition-colors ${
                  theme === "dark"
                    ? "bg-cyan-400 text-black hover:bg-cyan-500"
                    : "bg-cyan-500 text-white hover:bg-cyan-600"
                }`}
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className={`flex-1 py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors ${
                    theme === "dark"
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-green-600 text-white hover:bg-green-700"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Save size={20} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={handleCancelProfile}
                  disabled={saving}
                  className={`flex-1 py-3 rounded-xl font-bold text-lg border-2 transition-colors ${
                    theme === "dark"
                      ? "border-gray-500 text-gray-300 hover:bg-gray-700"
                      : "border-gray-400 text-gray-700 hover:bg-gray-100"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Password Section */}
        <div
          className={`rounded-3xl p-6 md:p-8 shadow-xl ${
            theme === "dark"
              ? "bg-gray-800/50 border-2 border-cyan-400/30"
              : "bg-white border-2 border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold">Change Password</h2>
          </div>

          {editingPassword ? (
            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}>
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all ${
                      theme === "dark"
                        ? "bg-gray-700 border-cyan-400/50 text-white focus:border-cyan-400"
                        : "bg-white border-cyan-400 text-black focus:border-cyan-500"
                    } focus:outline-none`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}>
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all ${
                      theme === "dark"
                        ? "bg-gray-700 border-cyan-400/50 text-white focus:border-cyan-400"
                        : "bg-white border-cyan-400 text-black focus:border-cyan-500"
                    } focus:outline-none`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}>
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all ${
                      theme === "dark"
                        ? "bg-gray-700 border-cyan-400/50 text-white focus:border-cyan-400"
                        : "bg-white border-cyan-400 text-black focus:border-cyan-500"
                    } focus:outline-none`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Password Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleChangePassword}
                  disabled={saving}
                  className={`flex-1 py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors ${
                    theme === "dark"
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-green-600 text-white hover:bg-green-700"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Save size={20} />
                  {saving ? "Changing..." : "Change Password"}
                </button>
                <button
                  onClick={handleCancelPassword}
                  disabled={saving}
                  className={`flex-1 py-3 rounded-xl font-bold text-lg border-2 transition-colors ${
                    theme === "dark"
                      ? "border-gray-500 text-gray-300 hover:bg-gray-700"
                      : "border-gray-400 text-gray-700 hover:bg-gray-100"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setEditingPassword(true)}
              className={`w-full py-3 rounded-xl font-bold text-lg transition-colors ${
                theme === "dark"
                  ? "bg-cyan-400 text-black hover:bg-cyan-500"
                  : "bg-cyan-500 text-white hover:bg-cyan-600"
              }`}
            >
              Change Password
            </button>
          )}
        </div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default ProfilePage;
