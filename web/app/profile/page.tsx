"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { useAuth } from "../context/auth-context";

interface ProfileData {
  id: number;
  full_name?: string | null;
  email: string;
  role?: string | null;
  created_at?: string;
  updated_at?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { authRequest, isAuthenticated, isLoading } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    async function fetchProfile() {
      if (!isAuthenticated) {
        setIsFetching(false);
        return;
      }

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
        const response = await authRequest<ProfileData>({
          url: `${baseUrl}/api/v1/users/profile`,
          method: "GET"
        });

        setProfile(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          router.replace("/login");
          return;
        }
        setError("Não foi possível carregar seu perfil.");
      } finally {
        setIsFetching(false);
      }
    }

    if (!isLoading) {
      fetchProfile();
    }
  }, [authRequest, isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <main className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-serif text-gray-800">Meu perfil</h1>
            <p className="text-gray-600 mt-2">
              Veja suas informações pessoais e mantenha seus dados atualizados.
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-8">
            {isFetching ? (
              <div className="text-gray-600">Carregando perfil...</div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : profile ? (
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-500">Nome completo</p>
                  <p className="text-lg font-medium text-gray-800">
                    {profile.full_name || "Não informado"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">E-mail</p>
                  <p className="text-lg font-medium text-gray-800">{profile.email}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Perfil</p>
                    <p className="text-lg font-medium text-gray-800">
                      {profile.role || "user"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cadastro</p>
                    <p className="text-lg font-medium text-gray-800">
                      {profile.created_at
                        ? new Date(profile.created_at).toLocaleDateString("pt-BR")
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-600">Nenhum dado encontrado.</div>
            )}
          </div>
        </div>
      </main>      <Footer />    </div>
  );
}
