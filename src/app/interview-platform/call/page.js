'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FiMic, FiMicOff, FiCheck } from 'react-icons/fi';

function InterviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [conversation, setConversation] = useState([]);
  const [status, setStatus] = useState('Starting interview...');
  const [countdown, setCountdown] = useState(3);
  const [callActive, setCallActive] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [callEnded, setCallEnded] = useState(false);
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('');

  const volumeInterval = useRef(null);
  const autoEndTimer = useRef(null);
  const isSpeakingRef = useRef(false);
  const hasStartedRef = useRef(false);

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    const questionsParam = searchParams.get('questions');
    const roleParam = searchParams.get('role');
    const levelParam = searchParams.get('level');

    if (questionsParam) {
      try {
        const parsed = JSON.parse(questionsParam);
        setQuestions(parsed);
        setRole(roleParam || '');
        setLevel(levelParam || '');
      } catch (e) {
        setQuestions([
          'Hi, can you tell me a little about yourself?',
          'What interests you most about this role?',
          'What are your biggest strengths?',
          'Tell me about a time you faced a challenge.'
        ]);
      }
    }
  }, [searchParams]);

  const speak = useCallback((text, onComplete) => {
    if (isSpeakingRef.current) return;
    isSpeakingRef.current = true;

    console.log('Speaking:', text);

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.lang = 'en-US';

    setStatus('Interviewer speaking...');
    utterance.onend = () => {
      isSpeakingRef.current = false;
      if (onComplete) onComplete();
      else {
        setStatus('Your turn - speak now');
        SpeechRecognition.startListening({ continuous: true });
      }
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const startInterview = useCallback(() => {
    if (questions.length > 0) {
      SpeechRecognition.stopListening(); // ✅ Ensure mic is off before first question
      resetTranscript();                 // ✅ Clear any previous text
      speak(questions[currentQIndex]);   // ✅ mic will start *after* AI finishes speaking
    }
  }, [questions, currentQIndex, speak, resetTranscript]);
  
  const endInterview = useCallback((finalConversation) => {
    setStatus('Finishing interview...');
    speak("Thank you for your time today. We'll redirect you to your results now.", () => {
      setCallEnded(true);
      setTimeout(() => {
        const qaPairs = finalConversation.map((item, i) => ({
          question: questions[i],
          answer: item.answer,
        }));

        router.push(
          `/interview-platform/result?data=${encodeURIComponent(
            JSON.stringify(qaPairs)
          )}&role=${role}&level=${level}`
        );
      }, 2000);
    });
  }, [questions, role, level, router, speak]);

  const handleSubmit = useCallback(() => {
    if (!transcript.trim()) return;

    SpeechRecognition.stopListening();
    if (autoEndTimer.current) clearTimeout(autoEndTimer.current);
    resetTranscript();

    const newEntry = {
      question: questions[currentQIndex],
      answer: transcript
    };

    const updated = [...conversation, newEntry];
    setConversation(updated);

    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex((prev) => prev + 1);
      setTimeout(() => speak(questions[currentQIndex + 1]), 800);
    } else {
      endInterview(updated);
    }
  }, [transcript, resetTranscript, questions, currentQIndex, conversation, speak, endInterview]);

  useEffect(() => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      alert('Your browser does not support speech recognition.');
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    if (questions.length > 0 && countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (questions.length > 0 && countdown === 0 && !hasStartedRef.current) {
      hasStartedRef.current = true;
      setCallActive(true);
      startInterview();
    }
  }, [countdown, questions, startInterview]);

  useEffect(() => {
    if (listening) {
      volumeInterval.current = setInterval(() => {
        setVolumeLevel((v) => Math.min(5, Math.floor(Math.random() * 3) + v));
      }, 200);
    } else {
      clearInterval(volumeInterval.current);
      setVolumeLevel(0);
    }

    return () => clearInterval(volumeInterval.current);
  }, [listening]);

  useEffect(() => {
    if (transcript.trim() && listening) {
      if (autoEndTimer.current) clearTimeout(autoEndTimer.current);
      autoEndTimer.current = setTimeout(() => handleSubmit(), 3000);
    }

    return () => {
      if (autoEndTimer.current) clearTimeout(autoEndTimer.current);
    };
  }, [transcript, listening, handleSubmit]);

  if (countdown > 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-5xl font-bold animate-pulse">{countdown}</div>
          <p className="text-gray-400 mt-4">Interview starts in {countdown} second(s)...</p>
        </div>
      </div>
    );
  }

  if (callEnded) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <FiCheck className="text-green-500 text-6xl mb-4" />
        <h1 className="text-2xl font-bold mb-2">Interview Completed</h1>
        <p className="text-gray-400">Redirecting to your results...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-white">
      <div className="w-full max-w-sm text-center mb-6">
        <div className="flex justify-center items-center mb-2">
          <div className={`w-3 h-3 rounded-full mr-2 ${callActive ? 'bg-green-500' : 'bg-gray-500'}`}></div>
          <p className="text-gray-300">{status}</p>
        </div>
        <div className="w-full bg-gray-900 h-px mb-4"></div>
      </div>

      <div className="bg-gray-900 rounded-xl shadow-xl w-full max-w-sm p-6 flex flex-col items-center border border-gray-800">
        <div className="w-full bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
          <p className="text-gray-400 text-sm font-medium mb-1">
            Question {currentQIndex + 1}/{questions.length}
          </p>
          <p className="text-white text-lg">
            {questions[currentQIndex] || 'Loading question...'}
          </p>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full border border-blue-400"
                style={{
                  width: `${80 + i * 20}px`,
                  height: `${80 + i * 20}px`,
                  opacity: volumeLevel > i ? 0.4 - i * 0.08 : 0,
                  transition: 'opacity 0.1s ease-out',
                }}
              />
            ))}
          </div>
          <button
            className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl shadow-lg transition-all duration-200 ${
              listening ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            onClick={listening ? SpeechRecognition.stopListening : SpeechRecognition.startListening}
          >
            {listening ? <FiMic className="text-3xl" /> : <FiMicOff className="text-3xl" />}
          </button>
        </div>

        <div className="w-full bg-gray-800 rounded-lg p-4 mb-6 h-32 overflow-y-auto border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Your response:</p>
          <p className="text-white">{transcript || (listening ? 'Speak now...' : 'Press mic to answer')}</p>
        </div>

        <div className="flex gap-3 w-full">
          <button
            onClick={handleSubmit}
            disabled={!transcript}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            <FiCheck /> Submit
          </button>
        </div>
      </div>

      <div className="mt-6 w-full max-w-sm">
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{
              width: `${((currentQIndex + (transcript ? 0.5 : 0)) / questions.length) * 100}%`
            }}
          ></div>
        </div>
        <p className="text-gray-400 text-sm mt-2 text-center">
          Progress: {currentQIndex + 1} of {questions.length} questions
        </p>
      </div>
    </div>
  );
}

export default function InterviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading interview...</div>}>
      <InterviewContent />
    </Suspense>
  );
}
