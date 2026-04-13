import { useRef, useState } from 'react'
import { Upload, FileText, X, Eye } from 'lucide-react'

export interface UploadedDoc {
  id: string
  name: string
  content: string
  uploadedAt: string
}

interface Props {
  type: 'criteria' | 'unwanted'
  docs: UploadedDoc[]
  onAdd: (doc: UploadedDoc) => void
  onRemove: (id: string) => void
}

const labels = {
  criteria: { title: 'Критерии оценки / Скрипты', hint: 'Файлы используются при анализе качества звонков', color: 'cyan' },
  unwanted: { title: 'Нежелательные действия', hint: 'Файлы используются для обнаружения нарушений', color: 'rose' },
}

export function FileUploadZone({ type, docs, onAdd, onRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [preview, setPreview] = useState<UploadedDoc | null>(null)
  const { title, hint, color } = labels[type]

  async function handleFile(file: File) {
    if (!file.name.match(/\.(txt|md|docx?)$/i)) return
    const content = await file.text()
    onAdd({
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      content,
      uploadedAt: new Date().toLocaleString('ru'),
    })
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    Array.from(e.dataTransfer.files).forEach(handleFile)
  }

  const borderColor = dragging
    ? color === 'cyan' ? 'border-cyan-400 bg-cyan-50' : 'border-rose-400 bg-rose-50'
    : 'border-[var(--line-soft)] bg-[#f7fbfc] hover:border-slate-300'

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-[#0d2430]">{title}</h3>
        <p className="mt-0.5 text-xs text-[#5b7280]">{hint}</p>
      </div>

      {/* Drop zone */}
      <div
        className={`rounded-2xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${borderColor}`}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className={`mx-auto size-8 mb-3 ${color === 'cyan' ? 'text-cyan-400' : 'text-rose-400'}`} />
        <p className="text-sm font-semibold text-[#16323f]">Перетащите файл или кликните для выбора</p>
        <p className="mt-1 text-xs text-[#5b7280]">Поддерживаемые форматы: .txt, .md, .docx</p>
        <input
          ref={inputRef}
          type="file"
          accept=".txt,.md,.doc,.docx"
          multiple
          className="hidden"
          onChange={e => Array.from(e.target.files ?? []).forEach(handleFile)}
        />
      </div>

      {/* Uploaded docs */}
      {docs.length > 0 && (
        <div className="space-y-2">
          {docs.map(doc => (
            <div key={doc.id} className="flex items-center gap-3 rounded-xl border border-[var(--line-soft)] bg-white px-4 py-2.5">
              <FileText className="size-4 text-[#5b7280] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#16323f] truncate">{doc.name}</p>
                <p className="text-xs text-[#5b7280]">{doc.uploadedAt}</p>
              </div>
              <button
                onClick={() => setPreview(doc)}
                className="p-1.5 rounded-lg hover:bg-[#f0f4f6] text-[#5b7280] hover:text-cyan-700 transition-colors"
                title="Просмотр"
              >
                <Eye className="size-4" />
              </button>
              <button
                onClick={() => onRemove(doc.id)}
                className="p-1.5 rounded-lg hover:bg-rose-50 text-[#5b7280] hover:text-rose-600 transition-colors"
                title="Удалить"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setPreview(null)}>
          <div className="max-h-[70vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#0d2430]">{preview.name}</h3>
              <button onClick={() => setPreview(null)} className="p-1.5 rounded-lg hover:bg-[#f0f4f6]">
                <X className="size-4 text-[#5b7280]" />
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm leading-6 text-[#16323f] font-mono bg-[#f7fbfc] rounded-xl p-4 overflow-auto">
              {preview.content}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
