"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { StudyContentViewer } from "@/components/StudyContentViewer";
import { FlashcardViewer } from "@/components/FlashcardViewer";
import { QuizViewer } from "@/components/QuizViewer";
import { api } from "@/lib/api";
import { StudyDetail } from "@/types";
import {
  ArrowLeft,
  BookOpen,
  Layers,
  HelpCircle,
  Calendar,
  Trash2,
  AlertCircle,
  Loader2,
} from "lucide-react";

type TabType = "content" | "flashcards" | "quiz";

function StudyDetailContent() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [study, setStudy] = useState<StudyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("content");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated && id) {
      fetchStudy();
    }
  }, [id, isAuthenticated, authLoading, router]);

  const fetchStudy = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<StudyDetail>(`/studies/${id}`);
      setStudy(res.data);
    } catch (err: any) {
      const msg =
        err.response?.status === 403
          ? "Você não tem permissão para visualizar este estudo."
          : err.response?.status === 404
          ? "Estudo não encontrado."
          : "Erro ao carregar o estudo. Tente novamente mais tarde.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!study) return;
    if (!window.confirm(`Deseja realmente excluir o estudo "${study.title}"?`)) {
      return;
    }

    setDeleting(true);
    try {
      await api.delete(`/studies/${study.id}`);
      router.push("/dashboard");
    } catch {
      alert("Erro ao excluir o estudo.");
      setDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          <p className="text-sm text-slate-500">Carregando estudo...</p>
        </div>
      </div>
    );
  }

  if (error || !study) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-16 text-center">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Ops!</h2>
            <p className="text-sm text-slate-600 mb-6">{error}</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </Link>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? "Excluindo..." : "Excluir Estudo"}
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
              {study.topic}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
              Nível: {study.difficulty}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
              {study.language}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {study.title}
          </h1>

          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>Criado em {formatDate(study.createdAt)}</span>
          </div>
        </div>

        <div className="border-b border-slate-200 mb-8 flex gap-2 sm:gap-4">
          <button
            onClick={() => setActiveTab("content")}
            className={`flex items-center gap-2 pb-3.5 px-3 sm:px-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "content"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Conteúdo Didático
          </button>

          <button
            onClick={() => setActiveTab("flashcards")}
            className={`flex items-center gap-2 pb-3.5 px-3 sm:px-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "flashcards"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Layers className="w-4 h-4" />
            Flashcards
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === "flashcards"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {study.flashcards.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("quiz")}
            className={`flex items-center gap-2 pb-3.5 px-3 sm:px-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "quiz"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            Questionário
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === "quiz"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {study.quiz.length}
            </span>
          </button>
        </div>

        <div className="mb-12">
          {activeTab === "content" && (
            <StudyContentViewer
              content={study.content}
              title={study.title}
            />
          )}

          {activeTab === "flashcards" && (
            <FlashcardViewer flashcards={study.flashcards} />
          )}

          {activeTab === "quiz" && (
            <QuizViewer quiz={study.quiz} />
          )}
        </div>
      </main>
    </div>
  );
}

export default function StudyDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navbar />
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            <p className="text-sm text-slate-500">Carregando...</p>
          </div>
        </div>
      }
    >
      <StudyDetailContent />
    </Suspense>
  );
}

