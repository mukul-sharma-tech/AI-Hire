'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import supabase from '@/lib/supabaseClient';
import { FiMic, FiMicOff, FiCheck, FiX, FiLoader } from 'react-icons/fi';

export default function InterviewPage() {
  const { pingId } = useParams();
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [conversation, setConversation] = useState([]);
  const [status, setStatus] = useState('Loading interview...');
  const [countdown, setCountdown] = useState(3);
  const [callActive, setCallActive] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [callEnded, setCallEnded] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const autoEndTimer = useRef(null);
  const conversationRef = useRef([]);
  const isSaving = useRef(false);
  const volumeInterval = useRef(null);

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const getFeedback = useCallback((ans) => {
    if (ans.length > 30) return 'Excellent detailed answer!';
    if (ans.length > 10) return 'Good response.';
    return 'Please elaborate more in your answers.';
  }, []);

  const assessAndSaveInterview = useCallback(async (finalConversation) => {
    try {
      setStatus('Evaluating your responses...');
      const { data: pingData } = await supabase
        .from('pings')
        .select('job_description')
        .eq('id', pingId)
        .single();

      const assessmentResponse = await fetch('/api/assess-responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription: pingData?.job_description || '',
          conversation: finalConversation,
        }),
      });

      const { feedback } = await assessmentResponse.json();

      await supabase
        .from('pings')
        .update({ status: 'completed', conversation: finalConversation, feedback })
        .eq('id', pingId);

      return feedback;
    } catch (error) {
      await supabase
        .from('pings')
        .update({ status: 'completed', conversation: finalConversation })
        .eq('id', pingId);
      return null;
    }
  }, [pingId]);

  const speak = useCallback((text, onComplete) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.lang = 'en-US';
    setStatus('Interviewer speaking...');
    utterance.onend = () => {
      if (onComplete) onComplete();
      else {
        setStatus('Your turn - speak now');
        SpeechRecognition.startListening({ continuous: true });
      }
    };
    window.speechSynthesis.speak(utterance);
  }, []);

  const endInterview = useCallback(async (finalConversation) => {
    setStatus('Finishing interview...');
    speak("Thank you for your time today. We're evaluating your responses and will get back to you soon.", async () => {
      await assessAndSaveInterview(finalConversation);
      setCallEnded(true);
      setTimeout(() => router.push('/dashboard/candidate'), 3000);
    });
  }, [assessAndSaveInterview, router, speak]);

  const startInterview = useCallback(() => {
    if (questions.length > 0) {
      speak(questions[currentQIndex]);
    }
  }, [questions, currentQIndex, speak]);

  useEffect(() => {
    const loadInterviewData = async () => {
      try {
        setIsLoadingQuestions(true);
        setStatus('Preparing your interview...');
        const { data: pingData, error: pingError } = await supabase
          .from('pings')
          .select('job_description')
          .eq('id', pingId)
          .single();

        if (pingError) {
          throw new Error('Failed to load interview data');
        }

        if (pingData?.job_description) {
          const response = await fetch('/api/generate-questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jobDescription: pingData.job_description }),
          });

          const data = await response.json();
          setQuestions(data.questions || []);
        } else {
          setQuestions([
            'Hi, can you tell me a little about yourself?',
            'What interests you most about this role?',
            'What are your biggest strengths?',
            'Tell me about a time you faced a challenge.',
            'Where do you see yourself in the next few years?',
          ]);
        }

        setStatus('Interview ready - starting soon...');
      } catch (error) {
        setQuestions([
          'Hi, can you tell me a little about yourself?',
          'What interests you most about this role?',
          'What are your biggest strengths?',
          'Tell me about a time you faced a challenge.',
          'Where do you see yourself in the next few years?',
        ]);
        setStatus('Interview ready - starting soon...');
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    loadInterviewData();
  }, [pingId]);

  useEffect(() => {
    if (!isLoadingQuestions && questions.length > 0) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setCallActive(true);
        startInterview();
      }
    }
  }, [countdown, isLoadingQuestions, questions, startInterview]);

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

  const handleAutoSubmit = useCallback(async () => {
    if (!transcript.trim() || isSaving.current || questions.length === 0) return;

    SpeechRecognition.stopListening();
    clearTimeout(autoEndTimer.current);

    const newEntry = {
      question: questions[currentQIndex],
      answer: transcript,
      feedback: getFeedback(transcript),
    };

    const updatedConversation = [...conversationRef.current, newEntry];
    conversationRef.current = updatedConversation;
    setConversation(updatedConversation);
    resetTranscript();

    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex((prev) => prev + 1);
      setTimeout(() => speak(questions[currentQIndex + 1]), 800);
    } else {
      isSaving.current = true;
      endInterview(updatedConversation);
    }
  }, [transcript, questions, currentQIndex, resetTranscript, getFeedback, speak, endInterview]);

  useEffect(() => {
    if (transcript.trim() && listening) {
      clearTimeout(autoEndTimer.current);
      autoEndTimer.current = setTimeout(handleAutoSubmit, 3000);
    }
  }, [transcript, listening, handleAutoSubmit]);

  useEffect(() => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      alert('Your browser does not support speech recognition.');
      router.push('/dashboard/candidate');
    }
  }, [router]);

  // Loading state
  if (isLoadingQuestions) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-white">
        <div className="text-center">
          <div className="w-32 h-32 mb-8 mx-auto rounded-full bg-gray-900 border-2 border-gray-700 flex items-center justify-center">
            <FiLoader className="text-5xl animate-spin" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Preparing Interview</h1>
          <p className="text-gray-400">Generating personalized questions...</p>
        </div>
      </div>
    );
  }

  if (countdown > 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-white">
        <div className="text-center">
          <div className="w-32 h-32 mb-8 mx-auto rounded-full bg-gray-900 border-2 border-gray-700 flex items-center justify-center">
            <span className="text-5xl animate-pulse">{countdown}</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Incoming Call</h1>
          <p className="text-gray-400">Interview starting in {countdown} seconds</p>
        </div>
      </div>
    );
  }

  if (callEnded) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-white">
        <div className="text-center">
          <div className="w-32 h-32 mb-8 mx-auto rounded-full bg-green-900 flex items-center justify-center">
            <FiCheck className="text-5xl" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Interview Completed</h1>
          <p className="text-gray-400">Evaluating your responses...</p>
          <p className="text-gray-500 text-sm mt-1">You&apos;ll receive feedback shortly</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-white">
      {/* Call Header */}
      <div className="w-full max-w-sm text-center mb-6">
        <div className="flex justify-center items-center mb-2">
          <div className={`w-3 h-3 rounded-full mr-2 ${callActive ? 'bg-green-500' : 'bg-gray-500'}`}></div>
          <p className="text-gray-300">{status}</p>
        </div>
        <div className="w-full bg-gray-900 h-px mb-4"></div>
      </div>

      {/* Call Container */}
      <div className="bg-gray-900 rounded-xl shadow-xl w-full max-w-sm p-6 flex flex-col items-center border border-gray-800">
        {/* Current Question */}
        <div className="w-full bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
          <p className="text-gray-400 text-sm font-medium mb-1">
            Question {currentQIndex + 1}/{questions.length}
          </p>
          <p className="text-white text-lg">
            {questions[currentQIndex] || 'Loading question...'}
          </p>
        </div>

        {/* Microphone Button */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Sound waves */}
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
            className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl shadow-lg transition-all duration-200 ${listening
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-blue-600 hover:bg-blue-700'
              }`}
            onClick={listening ? SpeechRecognition.stopListening : SpeechRecognition.startListening}
          >
            {listening ? <FiMic className="text-3xl" /> : <FiMicOff className="text-3xl" />}
          </button>
        </div>

        {/* Transcript */}
        <div className="w-full bg-gray-800 rounded-lg p-4 mb-6 h-32 overflow-y-auto border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Your response:</p>
          <p className="text-white">
            {transcript || (listening ? 'Speak now...' : 'Press mic to answer')}
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-3 w-full">
          <button
            onClick={handleAutoSubmit}
            disabled={!transcript || isSaving.current}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            <FiCheck /> Submit
          </button>
        </div>
      </div>

      {/* Conversation Log */}
      {conversation.length > 0 && (
        <div className="mt-6 w-full max-w-sm bg-gray-900 rounded-lg p-5 border border-gray-800">
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center">
            <span className="bg-blue-600 w-5 h-5 rounded-full flex items-center justify-center mr-2 text-sm">
              {conversation.length}
            </span>
            Responses
          </h2>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {conversation.map((c, i) => (
              <div key={i} className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                <p className="text-blue-400 text-sm font-medium mb-1">Q: {c.question}</p>
                <p className="text-white mb-1 text-sm">A: {c.answer}</p>
                <p className="text-green-400 text-xs">Feedback: {c.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}