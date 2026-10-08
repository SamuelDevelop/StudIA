"use client";

import React from "react";
import { StudyContent } from "@/types";
import { BookOpen, CheckCircle, Flag, Info } from "lucide-react";

interface Props {
  content: StudyContent;
  title: string;
}

export function StudyContentViewer({ content, title }: Props) {
  return (
    <div className="space-y-8">
      <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-6 sm:p-7">
        <div className="flex items-center gap-2 text-purple-700 font-bold text-sm mb-3">
          <Info className="w-4 h-4" />
          <span>Introdução ao Tema</span>
        </div>
        <p className="text-slate-800 text-base leading-relaxed">
          {content.introduction}
        </p>
      </div>

      <div className="space-y-6">
        {content.sections.map((section, idx) => (
          <div
            key={section.id || idx}
            className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center">
                {idx + 1}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                {section.title}
              </h3>
            </div>
            <div className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {section.body}
            </div>
          </div>
        ))}
      </div>

      {content.keyPoints && content.keyPoints.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg mb-4">
            <CheckCircle className="w-5 h-5 text-purple-600" />
            <span>Pontos Importantes para Memorização</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {content.keyPoints.map((point, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 text-slate-800 text-sm leading-relaxed flex items-start gap-3"
              >
                <span className="w-2 h-2 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {content.conclusion && (
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-xs">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-sm mb-3">
            <Flag className="w-4 h-4" />
            <span>Conclusão</span>
          </div>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            {content.conclusion}
          </p>
        </div>
      )}
    </div>
  );
}

