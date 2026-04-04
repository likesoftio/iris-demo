import type { TranscriptSegment } from '../data/demoData'

interface TranscriptSyncPanelProps {
  segments: TranscriptSegment[]
  currentTime: number
  onSeek: (time: number) => void
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function TranscriptSyncPanel({
  segments,
  currentTime,
  onSeek,
}: TranscriptSyncPanelProps) {
  return (
    <section className="rounded-[1.75rem] bg-white/96 p-5 shadow-sm ring-1 ring-[var(--line-soft)]">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Transcript sync
      </p>
      <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[#0d2430]">
        Кликабельная расшифровка разговора
      </h3>

      <div className="mt-6 space-y-3">
        {segments.map((segment) => {
          const isActive =
            currentTime >= segment.start && currentTime <= segment.end

          return (
            <button
              key={segment.id}
              type="button"
              onClick={() => onSeek(segment.start)}
              className={`w-full rounded-[1.35rem] px-4 py-4 text-left ring-1 transition-all ${
                isActive
                  ? 'bg-cyan-500/10 ring-cyan-200 shadow-sm'
                  : 'bg-slate-50/85 ring-slate-200/80 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[#0d2430]">{segment.speaker}</p>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  {formatTime(segment.start)} – {formatTime(segment.end)}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-[#496674]">{segment.text}</p>
            </button>
          )
        })}
      </div>
    </section>
  )
}
