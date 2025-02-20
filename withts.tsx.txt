'use client'

import { useState, useRef, useEffect } from 'react'
import { PlayIcon, PauseIcon, PlusIcon, EyeIcon, EyeSlashIcon, TrashIcon, ClockIcon } from '@heroicons/react/24/solid'

interface Timer {
  id: number
  time: number
  isRunning: boolean
  laps: number[]
  type: 'stopwatch' | 'countdown'
  countdownStart?: number
}

export default function TimersPage() {
  const [timers, setTimers] = useState<Timer[]>([])
  const [hiddenTime, setHiddenTime] = useState(false)
  const [nextId, setNextId] = useState(1)
  const sounds = useRef<{ [key: string]: HTMLAudioElement }>({})

  useEffect(() => {
    // Initialize sounds
    sounds.current.alarm = new Audio('/alarm.wav')
    sounds.current.click = new Audio('/click.wav')
  }, [])

  const formatTime = (time: number) => {
    if (hiddenTime) return '••••••'
    const ms = Math.floor(time % 1000 / 10)
    const seconds = Math.floor(time / 1000) % 60
    const minutes = Math.floor(time / 60000) % 60
    const hours = Math.floor(time / 3600000)
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
  }

  const createTimer = (type: 'stopwatch' | 'countdown' = 'stopwatch') => {
    const newTimer: Timer = {
      id: nextId,
      time: 0,
      isRunning: false,
      laps: [],
      type,
      countdownStart: type === 'countdown' ? 300000 : undefined // 5 minutes default
    }
    setTimers([...timers, newTimer])
    setNextId(nextId + 1)
  }

  const toggleTimer = (id: number) => {
    setTimers(timers.map(timer => {
      if (timer.id === id) {
        if (!timer.isRunning && timer.type === 'countdown' && timer.time <= 0) {
          return { ...timer, time: timer.countdownStart || 0, isRunning: !timer.isRunning }
        }
        return { ...timer, isRunning: !timer.isRunning }
      }
      return timer
    }))
    sounds.current.click.play()
  }

  const resetTimer = (id: number) => {
    setTimers(timers.map(timer => 
      timer.id === id 
        ? { ...timer, time: 0, laps: [], isRunning: false } 
        : timer
    ))
  }

  const addLap = (id: number) => {
    setTimers(timers.map(timer => 
      timer.id === id 
        ? { ...timer, laps: [...timer.laps, timer.time] } 
        : timer
    ))
    sounds.current.click.play()
  }

  const deleteTimer = (id: number) => {
    setTimers(timers.filter(timer => timer.id !== id))
  }

  // Interval management
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(timers.map(timer => {
        if (!timer.isRunning) return timer
        
        let newTime = timer.time + (timer.type === 'stopwatch' ? 10 : -10)
        
        if (timer.type === 'countdown' && newTime <= 0) {
          newTime = 0
          sounds.current.alarm.play()
          return { ...timer, time: newTime, isRunning: false }
        }
        
        return { ...timer, time: newTime }
      })
    }, 10)

    return () => clearInterval(interval)
  }, [timers])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Timers</h1>
          <button
            onClick={() => setHiddenTime(!hiddenTime)}
            className="p-2 rounded-lg bg-white shadow-sm hover:bg-gray-50"
          >
            {hiddenTime ? (
              <EyeSlashIcon className="w-6 h-6 text-gray-600" />
            ) : (
              <EyeIcon className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        <div className="space-y-4">
          {timers.map(timer => (
            <div key={timer.id} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="font-mono text-3xl font-semibold text-gray-800">
                  {formatTime(timer.time)}
                </div>
                <button
                  onClick={() => deleteTimer(timer.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <TrashIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleTimer(timer.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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

                {timer.type === 'stopwatch' && (
                  <button
                    onClick={() => addLap(timer.id)}
                    className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Lap
                  </button>
                )}

                <button
                  onClick={() => resetTimer(timer.id)}
                  className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Reset
                </button>
              </div>

              {timer.laps.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="text-sm text-gray-500">Laps:</div>
                  {timer.laps.map((lap, index) => (
                    <div key={index} className="flex justify-between text-gray-600">
                      <span>Lap {index + 1}</span>
                      <span>{formatTime(lap)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => createTimer('stopwatch')}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <PlusIcon className="w-5 h-5" />
            Add Stopwatch
          </button>
          
          <button
            onClick={() => createTimer('countdown')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            <PlusIcon className="w-5 h-5" />
            Add Countdown
          </button>
        </div>
      </div>
    </div>
  )
}