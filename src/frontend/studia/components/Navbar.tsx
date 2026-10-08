"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { BookOpen, PlusCircle, LogOut, User as UserIcon } from "lucide-react";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-purple-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-sm">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Stud<span className="text-purple-600">IA</span>
          </span>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-4">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-slate-600 hover:text-purple-600 px-3 py-2 rounded-lg transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/studies/new"
                className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-xs transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Novo Estudo</span>
              </Link>
              <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />
              <div className="flex items-center gap-2 text-slate-700 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100 text-xs sm:text-sm font-medium">
                <UserIcon className="w-3.5 h-3.5 text-purple-600" />
                <span className="max-w-[120px] truncate">{user?.name}</span>
              </div>
              <button
                onClick={logout}
                title="Sair"
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-slate-700 hover:text-purple-600 px-3 py-2 rounded-lg transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-xs transition-colors"
              >
                Criar Conta
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

