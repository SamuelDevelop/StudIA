"use client";

import React, { useState } from "react";
import { QuizQuestion } from "@/types";
import { CheckCircle2, XCircle, RotateCcw, Award, HelpCircle, Info } from "lucide-react";

interface Props {
  quiz: QuizQuestion[];
}

export function QuizViewer({ quiz }: Props) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  if (!quiz || quiz.length === 0) {
    return (
      <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
        <p className="text-slate-500 text-sm">Nenhuma questão disponível para este estudo.</p>
      </div>
    );
  }

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    if (selectedAnswers[questionIndex] !== undefined) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleReset = () => {
    setSelectedAnswers({});
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = Object.entries(selectedAnswers).filter(
    ([qIdx, chosenIdx]) => quiz[Number(qIdx)].correctAnswer === chosenIdx
  ).length;

  const scorePercentage =
    quiz.length > 0 ? Math.round((correctCount / quiz.length) * 100) : 0;

  const optionLetters = ["A", "B", "C", "D", "E"];

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" />
            Seu Desempenho
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            {answeredCount === quiz.length
              ? "Questionário finalizado!"
              : `${answeredCount} de ${quiz.length} questões respondidas`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-extrabold text-slate-900">
              {correctCount} / {quiz.length}
            </div>
            <div className="text-xs font-semibold text-purple-600">
              {scorePercentage}% de acertos
            </div>
          </div>

          {answeredCount > 0 && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Refazer
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {quiz.map((item, qIdx) => {
          const userAnswer = selectedAnswers[qIdx];
          const isAnswered = userAnswer !== undefined;
          const isCorrect = isAnswered && userAnswer === item.correctAnswer;

          return (
            <div
              key={item.id || qIdx}
              className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5"
            >
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {qIdx + 1}
                </span>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {item.question}
                </h4>
              </div>

              <div className="space-y-2.5">
                {item.options.map((opt, optIdx) => {
                  const isSelected = userAnswer === optIdx;
                  const isRightOption = optIdx === item.correctAnswer;

                  let optionStyle =
                    "bg-white border-slate-200 hover:border-purple-300 hover:bg-purple-50/20 text-slate-800";

                  if (isAnswered) {
                    if (isRightOption) {
                      optionStyle =
                        "bg-emerald-50 border-emerald-400 text-emerald-900 font-medium";
                    } else if (isSelected) {
                      optionStyle =
                        "bg-red-50 border-red-300 text-red-900";
                    } else {
                      optionStyle = "bg-slate-50/50 border-slate-100 text-slate-400 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isAnswered}
                      onClick={() => handleSelect(qIdx, optIdx)}
                      className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center justify-between gap-3 ${optionStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                            isAnswered && isRightOption
                              ? "bg-emerald-600 text-white"
                              : isAnswered && isSelected
                              ? "bg-red-600 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {optionLetters[optIdx] || optIdx + 1}
                        </span>
                        <span className="leading-relaxed">{opt}</span>
                      </div>

                      {isAnswered && isRightOption && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      )}
                      {isAnswered && isSelected && !isRightOption && (
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div
                  className={`p-4 rounded-xl text-sm leading-relaxed border ${
                    isCorrect
                      ? "bg-emerald-50/60 border-emerald-200 text-emerald-950"
                      : "bg-purple-50/60 border-purple-200 text-purple-950"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <Info className="w-4 h-4 text-purple-700" />
                    <span>Explicação:</span>
                  </div>
                  <p>{item.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

