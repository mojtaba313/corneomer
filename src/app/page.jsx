"use client";

import { useState, useRef, useEffect } from "react";
import {
  PlayIcon,
  PauseIcon,
  PlusIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";

export default function TimersPage() {
  const [timers, setTimers] = useState([]);
  const [globalHidden, setGlobalHidden] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const sounds = useRef({});

  useEffect(() => {
    // Initialize sounds with error handling
    try {
      // sounds.current.alarm = new Audio('/alarm.wav')
      // sounds.current.click = new Audio('/click.wav')
    } catch (error) {
      console.error("Error loading sounds:", error);
    }

    // Spacebar event listener
    const handleSpacebar = (e) => {
      if (e.code === "Space") {
        const runningTimer = timers.find((timer) => timer.isRunning);
        if (runningTimer) {
          addLap(runningTimer.id);
        }
      }
    };

    window.addEventListener("keydown", handleSpacebar);
    return () => window.removeEventListener("keydown", handleSpacebar);
  }, [timers]);

  const formatTime = (time, hidden) => {
    if (hidden) return "••••••";
    const ms = Math.floor((time % 1000) / 10);
    const seconds = Math.floor(time / 1000) % 60;
    const minutes = Math.floor(time / 60000) % 60;
    const hours = Math.floor(time / 3600000);
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
  };

  const createTimer = (type = "stopwatch") => {
    const initialTime =
      type === "countdown"
        ? prompt("Enter initial time in minutes:") * 60000
        : 0;
    if (type === "countdown" && !initialTime) return;

    const newTimer = {
      id: Date.now(),
      time: initialTime || 0,
      isRunning: false,
      laps: [],
      type,
      hidden: false,
      countdownStart: type === "countdown" ? initialTime : null,
    };
    setTimers([...timers, newTimer]);
  };

  const toggleTimer = (id) => {
    setTimers(
      timers.map((timer) => {
        if (timer.id === id) {
          if (
            !timer.isRunning &&
            timer.type === "countdown" &&
            timer.time <= 0
          ) {
            return {
              ...timer,
              time: timer.countdownStart,
              isRunning: !timer.isRunning,
            };
          }
          return { ...timer, isRunning: !timer.isRunning };
        }
        return timer;
      })
    );
    playSound("click");
  };

  const resetTimer = (id) => {
    setTimers(
      timers.map((timer) =>
        timer.id === id
          ? {
              ...timer,
              time: timer.type === "countdown" ? timer.countdownStart : 0,
              laps: [],
              isRunning: false,
            }
          : timer
      )
    );
  };

  const addLap = (id) => {
    setTimers(
      timers.map((timer) =>
        timer.id === id
          ? { ...timer, laps: [...timer.laps, timer.time] }
          : timer
      )
    );
    playSound("click");
  };

  const deleteTimer = (id) => {
    setTimers(timers.filter((timer) => timer.id !== id));
  };

  const toggleHidden = (id) => {
    setTimers(
      timers.map((timer) =>
        timer.id === id ? { ...timer, hidden: !timer.hidden } : timer
      )
    );
  };

  const playSound = (sound) => {
    if (sounds.current[sound]) {
      sounds.current[sound].play().catch((error) => {
        console.error("Error playing sound:", error);
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(
        timers.map((timer) => {
          if (!timer.isRunning) return timer;

          let newTime = timer.time + (timer.type === "stopwatch" ? 10 : -10);

          if (timer.type === "countdown" && newTime <= 0) {
            newTime = 0;
            playSound("alarm");
            return { ...timer, time: newTime, isRunning: false };
          }

          return { ...timer, time: newTime };
        })
      );
    }, 10);

    return () => clearInterval(interval);
  }, [timers]);

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      } p-8`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Timers</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
            <button
              onClick={() => setGlobalHidden(!globalHidden)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20"
            >
              {globalHidden ? (
                <EyeSlashIcon className="w-6 h-6" />
              ) : (
                <EyeIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {timers.map((timer) => (
            <div
              key={timer.id}
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg p-6 shadow-sm`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="font-mono text-3xl font-semibold">
                  {formatTime(timer.time, globalHidden || timer.hidden)}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleHidden(timer.id)}
                    className="p-2 rounded-lg hover:bg-white/10"
                  >
                    {timer.hidden ? (
                      <EyeSlashIcon className="w-6 h-6" />
                    ) : (
                      <EyeIcon className="w-6 h-6" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteTimer(timer.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <TrashIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleTimer(timer.id)}
                  className={`flex items-center gap-2 px-4 py-2 ${
                    timer.isRunning ? "bg-yellow-500" : "bg-green-500"
                  } text-white rounded-lg hover:opacity-90`}
                >
                  {timer.isRunning ? (
                    <>
                      <PauseIcon className="w-5 h-5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <PlayIcon className="w-5 h-5" />
                      Start
                    </>
                  )}
                </button>

                {timer.type === "stopwatch" && (
                  <button
                    onClick={() => addLap(timer.id)}
                    className="px-4 py-2 bg-gray-500/10 rounded-lg hover:bg-gray-500/20"
                  >
                    Lap
                  </button>
                )}

                <button
                  onClick={() => resetTimer(timer.id)}
                  className="px-4 py-2 bg-gray-500/10 rounded-lg hover:bg-gray-500/20"
                >
                  Reset
                </button>
              </div>

              {timer.laps.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="text-sm text-gray-400">Laps:</div>
                  {timer.laps.map((lap, index) => (
                    <div key={index} className="flex justify-between">
                      <span>Lap {index + 1}</span>
                      <div className="flex gap-2">
                        <span>
                          {index
                            ? formatTime(
                                lap - timer.laps[index - 1],
                                globalHidden || timer.hidden
                              )
                            : null}
                        </span>
                        <span>
                          {formatTime(lap, globalHidden || timer.hidden)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => createTimer("stopwatch")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <PlusIcon className="w-5 h-5" />
            Add Stopwatch
          </button>

          <button
            onClick={() => createTimer("countdown")}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            <PlusIcon className="w-5 h-5" />
            Add Countdown
          </button>
        </div>
      </div>
    </div>
  );
}
