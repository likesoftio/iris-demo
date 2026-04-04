import { PauseCircle, PlayCircle, SkipForward } from 'lucide-react'

import type { PlaybackMoment, TranscriptSegment } from '../data/demoData'

interface MockAudioPlayerProps {
  duration: number
  currentTime: number
  currentSegment: TranscriptSegment | null
  playbackMoments: PlaybackMoment[]
  onSeek: (time: number) => void
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function MockAudioPlayer({
  duration,
  currentTime,
  currentSegment,
  playbackMoments,
  onSeek,
}: MockAudioPlayerProps) {
  const progress = Math.min((currentTime / duration) * 100, 100)

  return (
    <section className="rounded-[1.75rem] bg-white/96 p-5 shadow-sm ring-1 ring-[var(--line-soft)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Mock audio player
          </p>
          <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[#0d2430]">
            Синхронизация с реальным фрагментом разговора
          </h3>
        </div>

        <div className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-900">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      <div className="mt-6 rounded-[1.4rem] bg-slate-50 p-4 ring-1 ring-slate-200/80">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-cyan-600 text-white shadow-lg shadow-cyan-500/20"
          >
            <PlayCircle className="size-5" />
          </button>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-600 ring-1 ring-slate-200"
          >
            <PauseCircle className="size-5" />
          </button>
          <div className="min-w-0 flex-1">
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#1FB7C9,#6BC6FF)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-3 text-sm leading-6 text-[#496674]">
              Текущий фрагмент:{' '}
              <span className="font-semibold text-[#0d2430]">
                {currentSegment?.text ?? '—'}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {playbackMoments.map((moment) => (
            <button
              key={moment.id}
              type="button"
              onClick={() => onSeek(moment.time)}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${
                currentTime === moment.time
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200'
              }`}
            >
              <SkipForward className="size-3.5" />
              {moment.label} · {formatTime(moment.time)}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
