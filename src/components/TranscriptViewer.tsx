import type { TranscriptLine } from '../data/demoData'

function fmt(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

interface Props {
  lines: TranscriptLine[]
}

export function TranscriptViewer({ lines }: Props) {
  return (
    <div className="space-y-3">
      {lines.map((line, i) => {
        const isOp = line.speaker === 'operator'
        return (
          <div key={i} className={`flex gap-3 ${isOp ? '' : 'flex-row-reverse'}`}>
            <div className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold mt-0.5 ${isOp ? 'bg-cyan-100 text-cyan-800' : 'bg-slate-100 text-slate-600'}`}>
              {isOp ? 'ОП' : 'КЛ'}
            </div>
            <div className={`flex-1 ${isOp ? '' : 'flex flex-col items-end'}`}>
              <div className={`inline-block max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-6 ${isOp ? 'bg-cyan-50 ring-1 ring-cyan-100 text-[#16323f]' : 'bg-white ring-1 ring-[var(--line-soft)] text-[#16323f]'}`}>
                {line.text}
              </div>
              <p className="mt-1 text-[11px] text-[#5b7280]">{fmt(line.startSec)}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
