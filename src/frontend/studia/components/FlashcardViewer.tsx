"use client";

import React, { useState } from "react";
import { Flashcard } from "@/types";
import { ChevronLeft, ChevronRight, RotateCw, Sparkles, Layers } from "lucide-react";

interface Props {
  flashcards: Flashcard[];
}

export function FlashcardViewer({ flashcards }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
        <p className="text-slate-500 text-sm">Nenhum flashcard disponível para este estudo.</p>
      </div>
    );
  }

  const current = flashcards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1 < flashcards.length ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 >= 0 ? prev - 1 : flashcards.length - 1));
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between text-sm text-slate-500 font-medium">
        <div className="flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-purple-600" />
          <span>
            Flashcard {currentIndex + 1} de {flashcards.length}
          </span>
        </div>
        <div className="w-32 bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
          />
        </div>
      </div>

      <div
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            handleFlip();
          }
        }}
        className={`w-full min-h-[300px] sm:min-h-[340px] rounded-3xl p-8 sm:p-10 cursor-pointer select-none transition-all duration-300 flex flex-col justify-between border ${
          isFlipped
            ? "bg-purple-600 text-white border-purple-700 shadow-lg shadow-purple-600/10"
            : "bg-white text-slate-900 border-slate-200 shadow-sm hover:border-purple-300 hover:shadow-md"
        }`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full ${
              isFlipped
                ? "bg-purple-500/50 text-purple-100"
                : "bg-purple-50 text-purple-700"
            }`}
          >
            {isFlipped ? "Verso: Resposta" : "Frente: Pergunta / Conceito"}
          </span>

          <div
            className={`flex items-center gap-1.5 text-xs font-medium ${
              isFlipped ? "text-purple-200" : "text-slate-400"
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            Clique para virar
          </div>
        </div>

        <div className="my-auto py-6 text-center">
          <p
            className={`text-xl sm:text-2xl font-bold leading-relaxed ${
              isFlipped ? "text-white" : "text-slate-900"
            }`}
          >
            {isFlipped ? current.back : current.front}
          </p>
        </div>

        <div
          className={`text-center text-xs ${
            isFlipped ? "text-purple-200" : "text-slate-400"
          }`}
        >
          {isFlipped ? "Toque para voltar à pergunta" : "Toque para revelar a resposta"}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          onClick={handlePrev}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </button>

        <button
          onClick={handleFlip}
          className="px-6 py-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <RotateCw className="w-4 h-4" />
          Virar Cartão
        </button>

        <button
          onClick={handleNext}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-xs transition-colors"
        >
          Próximo
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

