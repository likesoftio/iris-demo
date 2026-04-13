import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileUploadZone, type UploadedDoc } from '../components/FileUploadZone'

export function SettingsPage() {
  const [criteriaDocs, setCriteriaDocs] = useState<UploadedDoc[]>([])
  const [unwantedDocs, setUnwantedDocs] = useState<UploadedDoc[]>([])

  function addDoc(type: 'criteria' | 'unwanted', doc: UploadedDoc) {
    if (type === 'criteria') setCriteriaDocs(d => [...d, doc])
    else setUnwantedDocs(d => [...d, doc])
  }

  function removeDoc(type: 'criteria' | 'unwanted', id: string) {
    if (type === 'criteria') setCriteriaDocs(d => d.filter(x => x.id !== id))
    else setUnwantedDocs(d => d.filter(x => x.id !== id))
  }

  const totalDocs = criteriaDocs.length + unwantedDocs.length

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' as const }}
      className="space-y-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.04em] text-[#0d2430]">Настройки</h1>
          <p className="mt-1 text-sm text-[#5b7280]">Загрузите документы для использования при анализе звонков</p>
        </div>
        {totalDocs > 0 && (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
            {totalDocs} {totalDocs === 1 ? 'документ загружен' : 'документа загружено'}
          </span>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-[var(--shadow-soft)] ring-1 ring-[var(--line-soft)]">
          <FileUploadZone
            type="criteria"
            docs={criteriaDocs}
            onAdd={(doc) => addDoc('criteria', doc)}
            onRemove={(id) => removeDoc('criteria', id)}
          />
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-[var(--shadow-soft)] ring-1 ring-[var(--line-soft)]">
          <FileUploadZone
            type="unwanted"
            docs={unwantedDocs}
            onAdd={(doc) => addDoc('unwanted', doc)}
            onRemove={(id) => removeDoc('unwanted', id)}
          />
        </div>
      </div>

      {totalDocs === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-[var(--line-soft)] p-8 text-center">
          <p className="text-sm text-[#5b7280]">Загрузите хотя бы один документ, чтобы использовать его при анализе звонков</p>
        </div>
      )}
    </motion.section>
  )
}
