import { ArrowRight, CircleAlert, ShieldCheck, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import { BenchmarkStrip } from '../components/BenchmarkStrip'
import { LeakageTrendChart } from '../components/LeakageTrendChart'
import { MoneyImpactSimulator } from '../components/MoneyImpactSimulator'
import { NarrativePanel } from '../components/NarrativePanel'
import { OperatorPerformancePanel } from '../components/OperatorPerformancePanel'
import { OperatorSpotlightPanel } from '../components/OperatorSpotlightPanel'
import { OutcomeMixChart } from '../components/OutcomeMixChart'
import { ServiceLineHeatmap } from '../components/ServiceLineHeatmap'
import { demoData } from '../data/demoData'

const toneStyles = {
  primary: 'bg-cyan-500/12 text-cyan-900 ring-cyan-200',
  success: 'bg-emerald-400/12 text-emerald-950 ring-emerald-200',
  risk: 'bg-rose-400/14 text-rose-950 ring-rose-200',
  warning: 'bg-amber-300/18 text-amber-950 ring-amber-200',
} as const

const fallbackInsight = {
  eyebrow: 'Insight',
  title: 'Ключевой вывод появится здесь',
  body: 'Demo screen ожидает подготовленные insight cards.',
}

export function ExecutiveSummaryPage() {
  const heroInsight = demoData.insightCards[0] ?? fallbackInsight
  const strengthInsight = demoData.insightCards[1] ?? fallbackInsight
  const opportunityInsight = demoData.insightCards[2] ?? fallbackInsight

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="space-y-8"
    >
      <div className="grid gap-6 lg:grid-cols-[1.6fr_0.95fr]">
        <motion.article
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.05 }}
          className="overflow-hidden rounded-[2rem] bg-white p-8 shadow-[var(--shadow-soft)] ring-1 ring-[var(--line-soft)]"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-800">
            <Sparkles className="size-3.5" />
            Executive Summary
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl leading-tight font-semibold tracking-[-0.04em] text-[#0d2430] md:text-5xl">
            Где клиника теряет пациентов и сколько это стоит
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#466372]">
            {heroInsight.body}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,rgba(31,183,201,0.16),rgba(107,198,255,0.08))] p-5 ring-1 ring-cyan-200/70">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-900/70">
                {heroInsight.eyebrow}
              </p>
              <h2 className="mt-3 text-2xl leading-tight font-semibold text-[#0d2430]">
                {heroInsight.title}
              </h2>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[1.5rem] bg-emerald-400/12 p-5 ring-1 ring-emerald-200">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-900/70">
                  {strengthInsight.eyebrow}
                </p>
                <p className="mt-3 text-lg font-semibold text-[#0d2430]">
                  {strengthInsight.title}
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-amber-300/16 p-5 ring-1 ring-amber-200">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-900/70">
                  {opportunityInsight.eyebrow}
                </p>
                <p className="mt-3 text-lg font-semibold text-[#0d2430]">
                  {opportunityInsight.title}
                </p>
              </div>
            </div>
          </div>
        </motion.article>

        <motion.aside
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.1 }}
          className="rounded-[2rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(234,244,246,0.9))] p-6 shadow-[var(--shadow-soft)] ring-1 ring-[var(--line-soft)]"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Что видно за 30 секунд
          </p>

          <div className="mt-5 space-y-4">
            {[
              'Где теряем пациентов',
              'Какие ошибки повторяются',
              'Какие кейсы спасают выручку',
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-[1.25rem] bg-white/90 px-4 py-3 ring-1 ring-slate-200/80"
              >
                <ShieldCheck className="mt-0.5 size-4 text-cyan-600" />
                <p className="text-sm leading-6 text-[#385666]">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/calls"
              className="inline-flex items-center gap-2 rounded-full bg-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:-translate-y-0.5"
            >
              Открыть звонки
              <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/calls/10028"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:-translate-y-0.5"
            >
              Слабый кейс
              <CircleAlert className="size-4 text-rose-500" />
            </Link>
          </div>
        </motion.aside>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {demoData.dashboardMetrics.map((metric) => (
          <motion.article
            key={metric.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut', delay: 0.12 }}
            className={`rounded-[1.75rem] p-5 ring-1 shadow-sm ${toneStyles[metric.tone]}`}
          >
            <p className="text-sm leading-6 text-current/90">{metric.label}</p>
            <p className="mt-4 text-4xl leading-none font-semibold tracking-[-0.05em]">
              {metric.value}
            </p>
            <p className="mt-3 text-sm font-semibold text-current/85">{metric.delta}</p>
            <p className="mt-4 text-sm leading-6 text-current/80">
              {metric.description}
            </p>
          </motion.article>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.9fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut', delay: 0.18 }}
        >
          <LeakageTrendChart points={demoData.trendSeries} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut', delay: 0.2 }}
        >
          <OutcomeMixChart slices={demoData.outcomeDistribution} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut', delay: 0.22 }}
        >
          <OperatorPerformancePanel operators={demoData.operatorStats.slice(0, 3)} />
        </motion.div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut', delay: 0.24 }}
        >
          <MoneyImpactSimulator scenarios={demoData.moneyImpactScenarios} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut', delay: 0.26 }}
        >
          <NarrativePanel highlights={demoData.narrativeHighlights} />
        </motion.div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut', delay: 0.28 }}
        >
          <ServiceLineHeatmap items={demoData.serviceLineStats} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut', delay: 0.3 }}
        >
          <BenchmarkStrip stats={demoData.benchmarkStats} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut', delay: 0.32 }}
      >
        <OperatorSpotlightPanel spotlights={demoData.operatorSpotlights} />
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-4">
        {demoData.lossCategories.map((category) => (
          <motion.article
            key={category.id}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut', delay: 0.16 }}
            className={`rounded-[1.75rem] bg-white/94 p-5 shadow-sm ring-1 ${toneStyles[category.tone]}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-current/65">
                  Потеря
                </p>
                <h2 className="mt-3 text-xl leading-tight font-semibold text-[#0d2430]">
                  {category.title}
                </h2>
              </div>
              <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-current ring-1 ring-current/10">
                {category.rate}
              </span>
            </div>

            <p className="mt-4 text-sm font-medium text-current/80">
              {category.impact}
            </p>
            <p className="mt-3 text-sm leading-6 text-[#4a6775]">
              {category.summary}
            </p>
          </motion.article>
        ))}
      </div>
    </motion.section>
  )
}
