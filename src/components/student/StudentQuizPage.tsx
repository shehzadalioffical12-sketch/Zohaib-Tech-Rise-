import React, { useState, useEffect } from 'react';
import { useLms } from '../../context/LmsContext';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storageService';
import { Quiz, QuizAttempt, QuizQuestion } from '../../types/lms';
import {
  Clock,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  RotateCcw,
  Award
} from 'lucide-react';

export const StudentQuizPage: React.FC = () => {
  const { route, navigate, quizzes, courses } = useLms();
  const { currentUser } = useAuth();

  const quizId = route.params?.quizId || 'quiz_web_1';
  const quiz = quizzes.find((q) => q.quizId === quizId) || quizzes[0];
  const course = courses.find((c) => c.courseId === quiz?.courseId);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [secondsRemaining, setSecondsRemaining] = useState((quiz?.timeLimitMinutes || 15) * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<QuizAttempt | null>(null);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted || secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted, secondsRemaining]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `00:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId: string, option: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmitQuiz = () => {
    if (!currentUser || !quiz) return;
    const attempt = StorageService.submitQuizAttempt(quiz.quizId, currentUser.uid, selectedAnswers);
    setResult(attempt);
    setIsSubmitted(true);
  };

  if (!quiz) {
    return (
      <div className="p-12 text-center text-slate-800">
        <h3>Quiz not found.</h3>
        <button onClick={() => navigate('/student')} className="mt-4 px-4 py-2 bg-sky-600 text-white rounded">
          Back
        </button>
      </div>
    );
  }

  const currentQ: QuizQuestion = quiz.questions[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header Card matching image #3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/student')}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">
                {course?.title || 'Course Assessment'}
              </div>
              <h1 className="text-lg font-extrabold text-slate-900">{quiz.title}</h1>
            </div>
          </div>

          {/* Countdown Timer Display matching image #3 ("Time Remaining: 00:15:32") */}
          {!isSubmitted && (
            <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl self-start sm:self-auto font-mono text-sm font-bold shadow-xs">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Time Remaining:</span>
              <span className="text-amber-300">{formatTimer(secondsRemaining)}</span>
            </div>
          )}
        </div>

        {/* Quiz Taking Body */}
        {!isSubmitted ? (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            {/* Question Progress bar */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
                <span>
                  Question {currentQuestionIndex + 1} of {quiz.questions.length}
                </span>
                <span>{answeredCount} of {quiz.questions.length} answered</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-600 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question Text */}
            <div className="pt-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {currentQ.questionText}
              </h2>
              <span className="text-[11px] font-semibold text-slate-400 mt-1 block">
                Worth {currentQ.marks} marks · Single choice
              </span>
            </div>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedAnswers[currentQ.questionId] === option;
                return (
                  <label
                    key={idx}
                    onClick={() => handleSelectOption(currentQ.questionId, option)}
                    className={`flex items-center gap-3 p-4 rounded-xl border text-xs sm:text-sm font-medium cursor-pointer transition-all ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/70 text-sky-950 font-bold shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question_${currentQ.questionId}`}
                      checked={isSelected}
                      onChange={() => handleSelectOption(currentQ.questionId, option)}
                      className="w-4 h-4 text-sky-600 focus:ring-sky-500"
                    />
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>

            {/* Bottom Navigation & Submit */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex items-center gap-3">
                {currentQuestionIndex < quiz.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => Math.min(quiz.questions.length - 1, prev + 1))}
                    className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Quiz</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Result Summary & Review Screen */
          result && (
            <div className="space-y-6">
              <div
                className={`p-8 rounded-2xl border text-center space-y-4 shadow-sm ${
                  result.status === 'passed'
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50/80 border-rose-200 text-rose-950'
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                    result.status === 'passed' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                  }`}
                >
                  {result.status === 'passed' ? <CheckCircle2 className="w-9 h-9" /> : <XCircle className="w-9 h-9" />}
                </div>

                <div>
                  <span className="text-xs uppercase tracking-widest font-bold">Quiz Attempt Result</span>
                  <h2 className="text-2xl font-extrabold mt-1">
                    {result.status === 'passed' ? 'Congratulations! You Passed' : 'Needs Improvement'}
                  </h2>
                </div>

                <div className="flex items-center justify-center gap-8 py-2">
                  <div>
                    <div className="text-3xl font-extrabold">{result.percentage}%</div>
                    <div className="text-xs text-slate-500">Your Score</div>
                  </div>
                  <div className="w-px h-10 bg-slate-300"></div>
                  <div>
                    <div className="text-3xl font-extrabold">
                      {result.score} / {result.totalMarks}
                    </div>
                    <div className="text-xs text-slate-500">Marks Earned</div>
                  </div>
                </div>

                <p className="text-xs max-w-sm mx-auto leading-relaxed text-slate-600">
                  Passing threshold is {quiz.passingPercentage}%. Your attempt has been logged in your student profile.
                </p>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setSecondsRemaining((quiz.timeLimitMinutes || 15) * 60);
                      setSelectedAnswers({});
                      setCurrentQuestionIndex(0);
                    }}
                    className="px-4 py-2 bg-white border border-slate-300 text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Quiz</span>
                  </button>
                  <button
                    onClick={() => navigate('/student')}
                    className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                  >
                    Return to Dashboard
                  </button>
                </div>
              </div>

              {/* Detailed Question Answers Review */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-900 text-sm">Question Review & Explanations</h3>

                <div className="space-y-4">
                  {quiz.questions.map((q, idx) => {
                    const givenAnswer = selectedAnswers[q.questionId];
                    const isCorrect = givenAnswer === q.correctAnswer;

                    return (
                      <div key={q.questionId} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-bold text-xs text-slate-800">
                            {idx + 1}. {q.questionText}
                          </div>
                          {isCorrect ? (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Correct
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded flex items-center gap-1">
                              <XCircle className="w-3 h-3" /> Incorrect
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-600">
                          Your answer: <span className="font-semibold text-slate-800">{givenAnswer || 'No answer'}</span>
                        </div>

                        <div className="text-xs text-emerald-700">
                          Correct answer: <span className="font-bold">{String(q.correctAnswer)}</span>
                        </div>

                        {q.explanation && (
                          <div className="text-[11px] text-slate-500 bg-white p-2.5 rounded-lg border border-slate-200 mt-1">
                            <strong>Explanation:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
