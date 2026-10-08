"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { api } from "@/lib/api";
import { StudyDetail } from "@/types";
import {
  Sparkles,
  ArrowLeft,
  AlertCircle,
  Loader2,
  BookOpen,
  Layers,
  HelpCircle,
  Lightbulb,
} from "lucide-react";

export default function NewStudyPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Iniciante");
  const [flashcardCount, setFlashcardCount] = useState(4);
  const [questionCount, setQuestionCount] = useState(4);
  const [language, setLanguage] = useState("Português");

  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setError(null);
    setGenerating(true);

    try {
      const res = await api.post<StudyDetail>("/studies/generate", {
        topic: topic.trim(),
        difficulty,
        flashcardCount,
        questionCount,
        language,
      });

      router.push(`/studies/${res.data.id}`);
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "Falha ao gerar o estudo com o modelo local. Verifique se o Ollama está ativo e tente novamente.";
      setError(message);
      setGenerating(false);
    }
  };

  const sampleTopics = [
    "Fotossíntese e Respiração Celular",
    "Programação Orientada a Objetos",
    "Revolução Francesa",
    "Estruturas de Dados e Algoritmos",
    "Direitos Fundamentais na Constituição",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-purple-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Dashboard
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Criar Novo Estudo
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">
                O modelo local irá estruturar conteúdo, flashcards e questionário.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Erro na geração</p>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {generating ? (
            <div className="py-12 px-4 flex flex-col items-center justify-center text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
                  <Sparkles className="w-8 h-8 animate-pulse" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-xs">
                  <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                </div>
              </div>

              <h2 className="text-lg font-bold text-slate-900 mb-2">
                Gerando material sobre &ldquo;{topic}&rdquo;...
              </h2>
              <p className="text-sm text-slate-500 max-w-md leading-relaxed">
                O modelo local está processando o tema com o Ollama, formatando as seções didáticas, elaborando os flashcards e construindo as questões. Este processo pode levar de alguns segundos a um minuto.
              </p>

              <div className="mt-8 flex items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-purple-500" />
                  Conteúdo didático
                </div>
                <div className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-500" />
                  {flashcardCount} flashcards
                </div>
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-purple-500" />
                  {questionCount} questões
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Tema do Estudo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ex: Fotossíntese, Teoria da Relatividade, Clean Code..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />

                <div className="mt-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-2">
                    <Lightbulb className="w-3.5 h-3.5 text-purple-600" />
                    Sugestões populares:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sampleTopics.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setTopic(s)}
                        className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-100 hover:text-purple-700 text-slate-600 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Nível de Dificuldade
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white"
                  >
                    <option value="Iniciante">Iniciante</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Idioma
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white"
                  >
                    <option value="Português">Português</option>
                    <option value="Inglês">Inglês</option>
                    <option value="Espanhol">Espanhol</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Quantidade de Flashcards
                  </label>
                  <select
                    value={flashcardCount}
                    onChange={(e) => setFlashcardCount(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white"
                  >
                    <option value={2}>2 flashcards (Rápido)</option>
                    <option value={4}>4 flashcards (Recomendado)</option>
                    <option value={6}>6 flashcards</option>
                    <option value={8}>8 flashcards</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Quantidade de Questões
                  </label>
                  <select
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white"
                  >
                    <option value={2}>2 questões (Rápido)</option>
                    <option value={4}>4 questões (Recomendado)</option>
                    <option value={6}>6 questões</option>
                    <option value={8}>8 questões</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <Link
                  href="/dashboard"
                  className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-sm transition-colors"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  disabled={!topic.trim()}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-xs transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Gerar Estudo com IA
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

