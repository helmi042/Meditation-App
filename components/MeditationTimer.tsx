'use client';

import { useState, useEffect, useRef } from 'react';

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

interface MeditationSession {
  date: string;
  duration: number; // in seconds
  completed: boolean;
}

export default function MeditationTimer() {
  const [duration, setDuration] = useState(5); // minutes
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60); // seconds
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('inhale');
  const [breathCount, setBreathCount] = useState(0);
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);

  const breathTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Breathing cycle timings (in seconds)
  const breathingCycle = {
    inhale: 4,
    hold: 4,
    exhale: 6,
    rest: 2,
  };

  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('meditationSessions');
    if (savedSessions) {
      const parsed = JSON.parse(savedSessions);
      setSessions(parsed);

      // Calculate total minutes
      const total = parsed.reduce((acc: number, session: MeditationSession) => {
        return acc + (session.completed ? session.duration / 60 : 0);
      }, 0);
      setTotalMinutes(Math.floor(total));
    }
  }, []);

  // Save session to localStorage
  const saveSession = (completed: boolean) => {
    const sessionDuration = duration * 60 - timeLeft;
    const newSession: MeditationSession = {
      date: new Date().toISOString(),
      duration: sessionDuration,
      completed,
    };

    const updatedSessions = [...sessions, newSession];
    setSessions(updatedSessions);
    localStorage.setItem('meditationSessions', JSON.stringify(updatedSessions));

    if (completed) {
      setTotalMinutes(prev => prev + duration);
    } else {
      setTotalMinutes(prev => prev + Math.floor(sessionDuration / 60));
    }
  };

  // Breathing cycle logic
  useEffect(() => {
    if (isActive) {
      const currentPhaseDuration = breathingCycle[breathPhase];

      breathTimerRef.current = setTimeout(() => {
        // Move to next phase
        switch (breathPhase) {
          case 'inhale':
            setBreathPhase('hold');
            break;
          case 'hold':
            setBreathPhase('exhale');
            break;
          case 'exhale':
            setBreathPhase('rest');
            setBreathCount(prev => prev + 1);
            break;
          case 'rest':
            setBreathPhase('inhale');
            break;
        }
      }, currentPhaseDuration * 1000);
    }

    return () => {
      if (breathTimerRef.current) {
        clearTimeout(breathTimerRef.current);
      }
    };
  }, [isActive, breathPhase]);

  // Session countdown timer
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      sessionTimerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsActive(false);
            saveSession(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const startMeditation = () => {
    setIsActive(true);
    setTimeLeft(duration * 60);
    setBreathPhase('inhale');
    setBreathCount(0);
  };

  const stopMeditation = () => {
    setIsActive(false);
    saveSession(false);
    setTimeLeft(duration * 60);
    setBreathPhase('inhale');
    setBreathCount(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreathInstruction = () => {
    switch (breathPhase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'rest':
        return 'Rest';
    }
  };

  const getCircleStyle = () => {
    const duration = breathingCycle[breathPhase];
    let transform = 'scale(1)';
    let transition = '';

    switch (breathPhase) {
      case 'inhale':
        transform = 'scale(1.5)';
        transition = `transform ${duration}s ease-in-out, opacity ${duration}s ease-in-out`;
        break;
      case 'hold':
        transform = 'scale(1.5)';
        transition = 'none';
        break;
      case 'exhale':
        transform = 'scale(0.7)';
        transition = `transform ${duration}s ease-in-out, opacity ${duration}s ease-in-out`;
        break;
      case 'rest':
        transform = 'scale(0.7)';
        transition = 'none';
        break;
    }

    return {
      transform,
      transition,
      opacity: breathPhase === 'inhale' || breathPhase === 'hold' ? 1 : 0.6,
    } as React.CSSProperties;
  };

  const recentSessions = sessions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          Guided Meditation
        </h1>
        <p className="text-purple-200 text-lg">
          Find your calm with breathing exercises
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-white">{sessions.length}</div>
          <div className="text-purple-200 text-sm">Total Sessions</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-white">{totalMinutes}</div>
          <div className="text-purple-200 text-sm">Minutes Meditated</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center col-span-2 md:col-span-1">
          <div className="text-3xl font-bold text-white">{breathCount}</div>
          <div className="text-purple-200 text-sm">Breaths This Session</div>
        </div>
      </div>

      {/* Main Timer Section */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 mb-8">
        {!isActive ? (
          <div className="space-y-6">
            <div className="text-center">
              <label className="block text-white text-lg mb-3">
                Session Duration
              </label>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setDuration(Math.max(1, duration - 1))}
                  className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-2xl font-bold transition-colors"
                >
                  −
                </button>
                <div className="text-6xl font-bold text-white min-w-[120px] text-center">
                  {duration}
                </div>
                <button
                  onClick={() => setDuration(Math.min(60, duration + 1))}
                  className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-2xl font-bold transition-colors"
                >
                  +
                </button>
              </div>
              <div className="text-purple-200 mt-2">minutes</div>
            </div>

            <button
              onClick={startMeditation}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xl font-semibold rounded-xl transition-all transform hover:scale-105"
            >
              Start Meditation
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Breathing Circle */}
            <div className="flex flex-col items-center justify-center">
              <div
                className="w-48 h-48 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 shadow-2xl mb-6"
                style={getCircleStyle()}
              />
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {getBreathInstruction()}
              </div>
              <div className="text-purple-200 text-lg">
                {breathingCycle[breathPhase]} seconds
              </div>
            </div>

            {/* Time Remaining */}
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-white mb-2">
                {formatTime(timeLeft)}
              </div>
              <div className="text-purple-200">remaining</div>
            </div>

            <button
              onClick={stopMeditation}
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white text-xl font-semibold rounded-xl transition-all"
            >
              End Session
            </button>
          </div>
        )}
      </div>

      {/* Recent Sessions */}
      {sessions.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Recent Sessions</h2>
          <div className="space-y-3">
            {recentSessions.map((session, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-white/5 rounded-lg p-4"
              >
                <div>
                  <div className="text-white font-medium">
                    {new Date(session.date).toLocaleDateString()} at{' '}
                    {new Date(session.date).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <div className="text-purple-200 text-sm">
                    {Math.floor(session.duration / 60)} min {session.duration % 60} sec
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    session.completed
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-yellow-500/20 text-yellow-300'
                  }`}
                >
                  {session.completed ? 'Completed' : 'Partial'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
