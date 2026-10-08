"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { api } from "@/lib/api";
import { StudySummary } from "@/types";
import {
  PlusCircle,
  BookOpen,
  Trash2,
  Calendar,
  Search,
  Sparkles,
  ArrowRight,
  Layers,
  HelpCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [studies, setStudies] = useState<StudySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated) {
      fetchStudies();
    }
  }, [isAuthenticated, authLoading, router]);

  const fetchStudies = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<StudySummary[]>("/studies");
      setStudies(res.data);
    } catch (err: any) {
      setError("Não foi possível carregar os seus estudos. Tente recarregar.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Deseja realmente excluir o estudo "${title}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await api.delete(`/studies/${id}`);
      setStudies((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert("Erro ao excluir o estudo. Tente novamente.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredStudies = studies.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.topic.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (authLoading || (!isAuthenticated && loading)) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Olá, {user?.name?.split(" ")[0]}!
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Explore seu histórico de estudos ou gere novos tópicos com IA local.
            </p>
          </div>

          <Link
            href="/studies/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Criar Novo Estudo
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{studies.length}</div>
              <div className="text-xs text-slate-500 font-medium">Estudos Gerados</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">
                {new Set(studies.map((s) => s.topic.toLowerCase())).size}
              </div>
              <div className="text-xs text-slate-500 font-medium">Temas Únicos</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">Ollama</div>
              <div className="text-xs text-slate-500 font-medium">IA Local Ativa</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Meus Estudos</h2>
              <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">
                {studies.length}
              </span>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por tema ou título..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {error && (
            <div className="p-6 text-center text-sm text-red-600 flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-500 gap-3">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
              <span className="text-sm">Carregando seus estudos...</span>
            </div>
          ) : filteredStudies.length === 0 ? (
            <div className="py-16 px-4 text-center">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-1">
                {search ? "Nenhum estudo encontrado" : "Nenhum estudo criado ainda"}
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
                {search
                  ? "Tente buscar por outro termo ou limpe a caixa de pesquisa."
                  : "Comece informando qualquer tema de seu interesse para gerar um material completo com a IA local."}
              </p>
              {!search && (
                <Link
                  href="/studies/new"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-xs transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  Criar Primeiro Estudo
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredStudies.map((study) => (
                <div
                  key={study.id}
                  className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                        {study.topic}
                      </span>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        {study.difficulty}
                      </span>
                    </div>

                    <Link
                      href={`/studies/${study.id}`}
                      className="text-base font-bold text-slate-900 hover:text-purple-600 transition-colors block truncate"
                    >
                      {study.title}
                    </Link>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(study.createdAt)}
                      </span>
                      <span>&bull;</span>
                      <span>Idioma: {study.language}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/studies/${study.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-xs sm:text-sm transition-colors"
                    >
                      Estudar
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(study.id, study.title)}
                      disabled={deletingId === study.id}
                      title="Excluir estudo"
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                    >
                      {deletingId === study.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

