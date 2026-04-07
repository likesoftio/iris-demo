import { useState, useEffect } from 'react'
import { Play, Pause } from 'lucide-react'

interface Props {
  duration: string
  score: number
}

export function WaveformBar({ duration, score }: Props) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0.28)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 1) { setPlaying(false); return 1 }
        return p + 0.004
      })
    }, 80)
    return () => clearInterval(id)
  }, [playing])

  const bars = Array.from({ length: 80 }, (_, i) => {
    const seed = Math.sin(i * 0.7) * 0.5 + Math.sin(i * 0.23) * 0.3 + Math.sin(i * 1.4) * 0.2
    return 0.15 + Math.abs(seed) * 0.85
  })

  const played = Math.floor(progress * bars.length)

  return (
    <div className="rounded-[1.5rem] bg-gradient-to-r from-[#eaf4f6] to-[#f7fbfc] p-5 ring-1 ring-[var(--line-soft)]">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setPlaying(p => !p)}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-cyan-600 text-white shadow-lg shadow-cyan-500/30 hover:-translate-y-0.5 hover:bg-cyan-700"
        >
          {playing ? <Pause className="size-4" fill="white" /> : <Play className="size-4" fill="white" />}
        </button>

        <div className="flex flex-1 items-end gap-[2px] h-10 cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            setProgress((e.clientX - rect.left) / rect.width)
          }}
        >
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-[1px] transition-colors duration-100"
              style={{
                height: `${h * 100}%`,
                backgroundColor: i < played
                  ? '#1fb7c9'
                  : 'rgba(22,50,63,0.15)',
              }}
            />
          ))}
        </div>

        <div className="text-right shrink-0">
          <p className="text-sm font-semibold text-[#0d2430]">{duration}</p>
          <p className="text-xs text-[#5b7280]">длина</p>
        </div>

        <div
          className="shrink-0 rounded-full px-3 py-1.5 text-sm font-bold ring-1"
          style={{
            backgroundColor: score >= 75 ? 'rgba(127,227,197,0.2)' : score >= 55 ? 'rgba(246,198,103,0.2)' : 'rgba(255,142,122,0.2)',
            color: score >= 75 ? '#0a5740' : score >= 55 ? '#7a4f00' : '#7a2010',
            borderColor: score >= 75 ? 'rgba(127,227,197,0.6)' : score >= 55 ? 'rgba(246,198,103,0.6)' : 'rgba(255,142,122,0.6)',
          }}
        >
          {score} / 100
        </div>
      </div>
    </div>
  )
}
