import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, CircleAlert, Quote, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

import { BeforeAfterCoachingCard } from '../components/BeforeAfterCoachingCard'
import { MockAudioPlayer } from '../components/MockAudioPlayer'
import { TranscriptSyncPanel } from '../components/TranscriptSyncPanel'
import { demoData, findCallRecordById } from '../data/demoData'

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function CallDetailPage() {
  const { callId } = useParams()
  const record = findCallRecordById(callId ?? '10034')
  const riskyCalls = demoData.callListItems.filter((call) => call.riskLevel === 'high')
  const currentRiskIndex = riskyCalls.findIndex((call) => call.id === record?.id)
  const nextRiskCall =
    currentRiskIndex >= 0 ? riskyCalls[(currentRiskIndex + 1) % riskyCalls.length] : null
  const [currentTime, setCurrentTime] = useState(
    record?.playbackMoments[0]?.time ?? record?.transcriptSegments[0]?.start ?? 0,
  )
  const currentSegment = useMemo(
    () =>
      record?.transcriptSegments.find(
        (segment) => currentTime >= segment.start && currentTime <= segment.end,
      ) ?? record?.transcriptSegments[0] ?? null,
    [currentTime, record],
  )

  if (!record) {
    return (
      <section className="space-y-6">
        <Link
          to="/calls"
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200"
        >
          <ArrowLeft className="size-4" />
          Назад к списку
        </Link>

        <div className="rounded-[2rem] bg-white p-8 shadow-[var(--shadow-soft)] ring-1 ring-[var(--line-soft)]">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-700">
            Missing record
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#0d2430]">
            Звонок не найден
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#496674]">
            В демо доступны только подготовленные кейсы. Вернитесь к списку рисков
            и откройте один из сохраненных примеров.
          </p>
        </div>
      </section>
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/calls"
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200"
        >
          <ArrowLeft className="size-4" />
          Назад к списку
        </Link>
        <div className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-900">
          {record.statusLabel} · Score {record.score}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Оператор
          </span>
          <span className="font-semibold text-[#0d2430]">{record.operatorName}</span>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Канал
          </span>
          <span className="font-semibold text-[#0d2430]">{record.channel}</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.95fr]">
        <motion.article
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.04 }}
          className="rounded-[2rem] bg-white p-8 shadow-[var(--shadow-soft)] ring-1 ring-[var(--line-soft)]"
        >
          <p className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-rose-800">
            <CircleAlert className="size-3.5" />
            Call detail
          </p>
          <h1 className="mt-4 text-4xl leading-tight font-semibold tracking-[-0.04em] text-[#0d2430]">
            Звонок {record.id}
          </h1>
          <p className="mt-3 text-sm font-medium text-[#58727f]">
            {record.patientName} · {record.intent} · {record.date}
          </p>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#466372]">
            {record.summary}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {record.breakdown.map((item) => (
              <div
                key={item.label}
                className={`rounded-[1.4rem] p-4 ring-1 ${
                  item.status === 'done'
                    ? 'bg-emerald-400/12 ring-emerald-200'
                    : item.status === 'partial'
                      ? 'bg-amber-300/16 ring-amber-200'
                      : 'bg-rose-400/12 ring-rose-200'
                }`}
              >
                <p className="text-sm font-semibold text-[#0d2430]">{item.label}</p>
                <p className="mt-3 text-sm leading-6 text-[#496674]">{item.note}</p>
              </div>
            ))}
          </div>
        </motion.article>

        <motion.aside
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.08 }}
          className="rounded-[2rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(234,244,246,0.92))] p-6 shadow-[var(--shadow-soft)] ring-1 ring-[var(--line-soft)]"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Next step recommendation
          </p>
          <p className="mt-4 text-lg leading-8 font-medium text-[#0d2430]">
            {record.recommendation}
          </p>

          <div className="mt-6 rounded-[1.5rem] bg-cyan-500/10 p-4 ring-1 ring-cyan-200">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-900/70">
              Strong moments
            </p>
            <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
              {record.strongMoments.map((moment) => (
                <li key={moment} className="flex gap-3">
                  <Sparkles className="mt-1 size-4 shrink-0 text-cyan-600" />
                  <span>{moment}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.aside>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        <MockAudioPlayer
          duration={record.audioDuration}
          currentTime={currentTime}
          currentSegment={currentSegment}
          playbackMoments={record.playbackMoments}
          onSeek={setCurrentTime}
        />
        <TranscriptSyncPanel
          segments={record.transcriptSegments}
          currentTime={currentTime}
          onSeek={setCurrentTime}
        />
      </div>

      <BeforeAfterCoachingCard
        rewrite={record.coachingRewrite}
        expectedOutcomeDelta={record.expectedOutcomeDelta}
      />

      <section className="grid gap-4 lg:grid-cols-3">
        {record.evidenceQuotes.map((quote) => (
          <motion.button
            key={quote.id}
            type="button"
            onClick={() => {
              const matchedSegment = record.transcriptSegments.find(
                (segment) => segment.start.toString() === quote.timestamp.replace(':', '') || segment.start === Number(quote.timestamp.split(':')[0]) * 60 + Number(quote.timestamp.split(':')[1]),
              )
              const fallbackTime =
                Number(quote.timestamp.split(':')[0]) * 60 +
                Number(quote.timestamp.split(':')[1])
              setCurrentTime(matchedSegment?.start ?? fallbackTime)
            }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut', delay: 0.12 }}
            className="rounded-[1.6rem] bg-white/96 p-5 text-left shadow-sm ring-1 ring-[var(--line-soft)] transition-transform hover:-translate-y-0.5"
            aria-label={`Jump to ${quote.timestamp}`}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[#0d2430]">{quote.speaker}</p>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                {quote.timestamp}
              </span>
            </div>
            <Quote className="mt-5 size-5 text-cyan-600" />
            <p className="mt-4 text-base leading-7 text-[#3f5c6a]">{quote.quote}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
              Jump to {formatTime(
                Number(quote.timestamp.split(':')[0]) * 60 +
                  Number(quote.timestamp.split(':')[1]),
              )}
            </p>
          </motion.button>
        ))}
      </section>

      <div className="flex justify-end">
        {nextRiskCall ? (
          <Link
            to={`/calls/${nextRiskCall.id}`}
            className="inline-flex items-center gap-2 rounded-full bg-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20"
          >
            Открыть еще один риск-кейс
            <ArrowRight className="size-4" />
          </Link>
        ) : null}
      </div>
    </motion.section>
  )
}
