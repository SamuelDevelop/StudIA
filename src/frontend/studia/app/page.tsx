"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { BookOpen, Layers, CheckCircle2, Cpu, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        <section className="relative overflow-hidden py-20 sm:py-28 bg-gradient-to-b from-purple-50/60 via-white to-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              100% Local com Ollama &bull; Gratuito &bull; Privado
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Acelere seu aprendizado com{" "}
              <span className="text-purple-600 bg-clip-text">
                Inteligência Artificial Local
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Crie materiais de estudo sob medida a partir de qualquer tema. Gere automaticamente conteúdo didático organizado, flashcards para memorização ativa e questionários avaliativos.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={isAuthenticated ? "/dashboard" : "/register"}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-base shadow-sm hover:shadow-md transition-all"
              >
                {isAuthenticated ? "Ir para o Dashboard" : "Criar Conta Gratuita"}
                <ArrowRight className="w-5 h-5" />
              </Link>
              {!isAuthenticated && (
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-300 hover:border-purple-300 hover:bg-purple-50/40 text-slate-700 font-semibold text-base transition-all"
                >
                  Já tenho conta
                </Link>
              )}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Tudo o que você precisa em um único estudo
            </h2>
            <p className="mt-3 text-slate-600 text-base max-w-xl mx-auto">
              Cada tema pesquisado é estruturado em três dimensões pedagógicas complementares.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-purple-200 hover:shadow-sm transition-all flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-5">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                1. Conteúdo Didático
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Textos estruturados com introdução, tópicos fundamentais, exemplos claros, pontos-chave de memorização e conclusão sintética.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-purple-200 hover:shadow-sm transition-all flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-5">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                2. Flashcards Interativos
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Cartões de repetição espaçada com conceito na frente e resposta objetiva no verso para testar sua lembrança ativa.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-purple-200 hover:shadow-sm transition-all flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-5">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                3. Questionário Avaliativo
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Questões de múltipla escolha com alternativas plausíveis, gabarito imediato e explicação aprofundada da resposta correta.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-purple-50/50 border-t border-purple-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 text-purple-700 font-semibold text-sm mb-4">
              <Cpu className="w-5 h-5" />
              Arquitetura Independente
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Executado no seu próprio hardware
            </h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Com o Ollama rodando localmente, seus dados nunca saem da sua máquina para APIs de terceiros. Sem mensalidades, sem limites de requisições de empresas externas.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                Privacidade Absoluta
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                Persistência Segura em PostgreSQL
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                Autenticação JWT Robusta
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          StudIA &bull; Plataforma de Estudos com Inteligência Artificial Local
        </div>
      </footer>
    </div>
  );
}
