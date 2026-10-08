export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface StudySection {
  id?: string;
  title: string;
  body: string;
}

export interface StudyContent {
  introduction: string;
  sections: StudySection[];
  keyPoints: string[];
  conclusion: string;
}

export interface Flashcard {
  id?: string;
  front: string;
  back: string;
}

export interface QuizQuestion {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface StudySummary {
  id: string;
  title: string;
  topic: string;
  difficulty: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudyDetail {
  id: string;
  title: string;
  topic: string;
  difficulty: string;
  language: string;
  content: StudyContent;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface GenerateStudyPayload {
  topic: string;
  difficulty: string;
  flashcardCount: number;
  questionCount: number;
  language: string;
}

