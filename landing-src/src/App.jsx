import { useEffect, useMemo, useState } from 'react'

const navItems = [
  { href: '#how', label: 'Как работает' },
  { href: '#screens', label: 'Экраны' },
  { href: '#adv', label: 'Преимущества' },
  { href: '#cases', label: 'Кейсы' },
  { href: '#book-demo', label: 'Демо' },
  { href: '#pricing', label: 'Тарифы' },
  { href: '#faq', label: 'FAQ' },
]

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']

function buildBookDemoHref() {
  const configured = import.meta.env.VITE_BOOK_DEMO_HREF
  const defaultMailto = `mailto:sales@dialogik.ru?subject=${encodeURIComponent('Запись на демо Dialogik')}`
  const raw =
    configured != null && String(configured).trim() !== '' ? String(configured).trim() : defaultMailto
  if (/^mailto:/i.test(raw)) return raw
  try {
    const url = new URL(raw)
    const incoming = new URLSearchParams(
      typeof window !== 'undefined' ? window.location.search.replace(/^\?/, '') : '',
    )
    for (const key of UTM_KEYS) {
      const v = incoming.get(key)
      if (v && !url.searchParams.has(key)) url.searchParams.set(key, v)
    }
    if (!url.searchParams.has('utm_source')) url.searchParams.set('utm_source', 'landing')
    if (!url.searchParams.has('utm_medium')) url.searchParams.set('utm_medium', 'cta')
    if (!url.searchParams.has('utm_campaign')) url.searchParams.set('utm_campaign', 'dialogik_book_demo')
    return url.toString()
  } catch {
    return raw
  }
}

const steps = [
  { title: 'Сбор данных', detail: 'Забираем завершенные звонки из телефонии или CRM.' },
  { title: 'Анализ клиента', detail: 'Выделяем запросы, боли, возражения и сигналы к покупке.' },
  { title: 'Анализ менеджера', detail: 'Считаем соблюдение скрипта и качество диалога.' },
  { title: 'Рекомендации', detail: 'Формируем конкретные формулировки и задачи на обучение.' },
  { title: 'Отчет после звонка', detail: 'Результат доступен почти сразу, пока лид горячий.' },
  { title: 'Фиксация в CRM', detail: 'Ключевые выводы и статус сделки записываются автоматически.' },
]

const audiences = [
  { title: 'Предприниматели', detail: 'Видят, где теряются деньги на этапах звонка.' },
  { title: 'Директора', detail: 'Контролируют отдел продаж без ручной прослушки.' },
  { title: 'Маркетологи', detail: 'Понимают качество лидов по источникам трафика.' },
  { title: 'РОПы', detail: 'Получают персональные рекомендации для обучения команды.' },
]

const advantages = [
  { title: 'Точность 98,7%', detail: 'Высокое качество аналитики по сравнению с типовыми связками.' },
  { title: 'Отчет за 2 минуты', detail: 'Действуйте по горячему лиду сразу после разговора.' },
  { title: 'Подключение за 1 день', detail: 'Быстрый старт без сложной технической подготовки.' },
  { title: 'Индивидуальные отчеты', detail: 'Настройка KPI и аналитики под ваш скрипт и воронку.' },
]

const cases = [
  {
    company: 'Iris',
    metric: '+22% конверсия в запись',
    context: 'Проблема: разная подача у операторов и потеря лидов в пиковые часы.',
    detail: 'Системный разбор 200+ звонков выявил потери на этапе работы с возражениями.',
  },
  {
    company: 'Профпоток',
    metric: '-31% доля риск-звонков',
    context: 'Проблема: нестабильное качество первого контакта и упущенные follow-up.',
    detail: 'Еженедельный коучинг по AI-разборам сократил критичные сценарии в воронке.',
  },
  {
    company: 'Headway',
    metric: '−66% длительность цикла сделки',
    context: 'Проблема: сделки застревали между первым звонком и демонстрацией.',
    detail: 'Сокращение цикла до 7-9 дней вместо 21-23.',
  },
  {
    company: 'Азбука переезда',
    metric: '+20% средний чек',
    context: 'Проблема: низкий апсейл из-за слабой диагностики потребности.',
    detail: 'Рост за 4 месяца после внедрения речевого контроля.',
  },
  {
    company: 'Инфо-портал',
    metric: '+85% выручки за год',
    context: 'Проблема: не было единой системы контроля качества звонков.',
    detail: 'Переход на data-driven продажи вместо интуитивного контроля.',
  },
]

const pricing = [
  {
    id: 'Пакет 10',
    price: '60 000 ₽',
    minutes: '10 000 + 1 000 минут',
    perMinute: '5.5 ₽/мин',
    features: ['Транскрипция 100% звонков', 'Оценка менеджера 0–100', 'Email-отчеты ежедневно', 'До 3 пользователей'],
  },
  {
    id: 'Пакет 25',
    price: '150 000 ₽',
    minutes: '25 000 + 5 000 минут',
    perMinute: '5 ₽/мин',
    features: ['Все из Пакета 10', 'Анализ возражений клиента', 'Рекомендации по скриптам', 'Интеграция с CRM', 'До 10 пользователей'],
  },
  {
    id: 'Пакет 50',
    price: '300 000 ₽',
    minutes: '50 000 + 15 000 минут',
    perMinute: '4.6 ₽/мин',
    popular: true,
    features: ['Все из Пакета 25', 'Командные дашборды', 'Тренды и динамика', 'API доступ', 'Приоритетная поддержка', 'До 25 пользователей'],
  },
  {
    id: 'Пакет 100',
    price: '600 000 ₽',
    minutes: '100 000 + 40 000 минут',
    perMinute: '4.3 ₽/мин',
    features: ['Все из Пакета 50', 'Персональный менеджер', 'Кастомные KPI и скрипты', 'Расширенный API', 'Неограниченно пользователей'],
  },
  {
    id: 'Пакет 250',
    price: '1 500 000 ₽',
    minutes: '250 000 + 125 000 минут',
    perMinute: '4 ₽/мин',
    features: ['Все из Пакета 100', 'SLA 99.9%', 'Выделенный аккаунт', 'Onboarding-сессия', 'White Label'],
  },
]

const faqs = [
  ['С любой ли CRM можно интегрировать?', 'Да. Для редких решений адаптация занимает чуть больше времени.'],
  ['Что входит в бесплатный разбор?', 'Первые 20 звонков, scorecard, риски и рекомендации на 2 недели.'],
  ['Можно ли работать без CRM?', 'Да. Можно загружать записи вручную и получать анализ по вашим критериям.'],
  ['Где хранятся данные?', 'Используем ролевой доступ и шифрование каналов передачи.'],
  ['Как быстро сервис окупается?', 'Обычно за 1–2 возвращенные сделки, в зависимости от среднего чека.'],
]

const heroKpis = [
  { label: 'Конверсия', value: '64%', delta: '+8 п.п.' },
  { label: 'Риск-звонки', value: '18%', delta: '-31%' },
  { label: 'Средний чек', value: '₽48k', delta: '+20%' },
]

const trendPoints = [38, 42, 47, 51, 56, 61, 64]

const lossBars = [
  { label: 'Не закрыли на следующий шаг', value: 62 },
  { label: 'Слабая отработка возражений', value: 48 },
  { label: 'Нет фиксации договоренностей', value: 36 },
]

export function App() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState('Не выбран')
  const [openFaq, setOpenFaq] = useState(0)
  const [formState, setFormState] = useState({
    name: '',
    company: '',
    role: '',
    team: '',
    contact: '',
    consent: false,
  })
  const baseUrl = import.meta.env.BASE_URL ?? '/'
  const demoUrl = import.meta.env.VITE_DEMO_URL ?? `${baseUrl}../demo/`
  const privacyUrl = `${baseUrl}privacy.html`
  const offerUrl = `${baseUrl}offer.html`
  const consentUrl = `${baseUrl}consent.html`
  const recordingConsentUrl = `${baseUrl}recording-consent.html`
  const leadPostUrl = import.meta.env.VITE_LEAD_POST_URL?.trim()
  const bookDemoHref = useMemo(() => buildBookDemoHref(), [])
  const bookDemoIsMailto = /^mailto:/i.test(bookDemoHref)

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const canSubmit = useMemo(() => {
    return Boolean(
      formState.name &&
        formState.company &&
        formState.role &&
        formState.team &&
        formState.contact &&
        formState.consent,
    )
  }, [formState])

  const handleChange = (key) => (event) => {
    const value = key === 'consent' ? event.target.checked : event.target.value
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const submitForm = async (event) => {
    event.preventDefault()
    if (!canSubmit || submitting) return
    setSubmitting(true)
    const body = encodeURIComponent(
      `Имя: ${formState.name}\nКомпания: ${formState.company}\nРоль: ${formState.role}\nКоманда: ${formState.team}\nКонтакт: ${formState.contact}\nТариф: ${selectedPackage}`,
    )
    const subject = encodeURIComponent(`Заявка с лендинга Dialogik (${selectedPackage})`)
    const mailtoHref = `mailto:sales@dialogik.ru?subject=${subject}&body=${body}`
    try {
      if (leadPostUrl) {
        const res = await fetch(leadPostUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formState.name,
            company: formState.company,
            role: formState.role,
            team: formState.team,
            contact: formState.contact,
            package: selectedPackage,
          }),
        })
        if (res.ok) {
          setSubmitted(true)
          return
        }
      }
    } catch {
      // fallback: mailto
    } finally {
      setSubmitting(false)
    }
    window.location.href = mailtoHref
    setSubmitted(true)
  }

  return (
    <div className="page">
      <header className="header">
        <a href={baseUrl} className="brand">
          <span className="brandBadge">dk</span>
          Dialogik
        </a>
        <nav id="landing-mobile-nav" className={`nav ${mobileOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
              {item.label}
            </a>
          ))}
          <a href="#contact" className="cta ghost" onClick={() => setMobileOpen(false)}>
            Попробовать бесплатно
          </a>
          <a
            href={bookDemoHref}
            {...(bookDemoIsMailto ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
            className="cta ghost"
            onClick={() => setMobileOpen(false)}
          >
            Записаться на демо
          </a>
        </nav>
        <div className="headerCtaGroup desktopOnly">
          <a
            href={bookDemoHref}
            {...(bookDemoIsMailto ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
            className="cta ghost"
          >
            Записаться на демо
          </a>
          <a href="#contact" className="cta">
            Попробовать бесплатно
          </a>
        </div>
        <button
          className="menuBtn"
          onClick={() => setMobileOpen((v) => !v)}
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="landing-mobile-nav"
          aria-label={mobileOpen ? 'Закрыть меню' : 'Открыть меню'}
        >
          ☰
        </button>
      </header>

      <main>
        <section className="hero">
          <div className="heroLayout">
            <div className="heroCopy">
              <span className="eyebrow">AI речевая аналитика звонков</span>
              <h1>
                Увеличьте продажи с <span>AI-аналитикой звонков</span>
              </h1>
              <p>Находите потерянные сделки и усиливайте отдел продаж на реальных диалогах, а не на ручной прослушке.</p>
              <div className="chips">
                <span>Рост выручки до +30%</span>
                <span>Запуск за 1 день</span>
                <span>Интеграция с любой CRM</span>
              </div>
              <div className="actions">
                <a href="#contact" className="cta">
                  Получить бесплатный разбор
                </a>
                <a href={demoUrl} className="cta ghost">
                  Открыть демо
                </a>
                <a
                  href={bookDemoHref}
                  {...(bookDemoIsMailto ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                  className="cta ghost"
                >
                  Записаться на демо
                </a>
              </div>
            </div>

            <div className="showcase" aria-label="Примеры аналитики Dialogik">
              <article className="showcasePrimary">
                <div className="miniKpis" aria-label="Ключевые метрики">
                  {heroKpis.map((kpi) => (
                    <div key={kpi.label} className="miniKpi">
                      <p>{kpi.label}</p>
                      <strong>{kpi.value}</strong>
                      <span>{kpi.delta}</span>
                    </div>
                  ))}
                </div>
                <p>Executive dashboard: KPI отдела и прирост по неделям</p>
              </article>
              <article className="showcaseSecondary">
                <div className="miniTrend" aria-label="Динамика конверсии по неделям">
                  {trendPoints.map((point, index) => (
                    <div key={`${point}-${index}`} className="miniTrendCol">
                      <span style={{ height: `${point}%` }} />
                    </div>
                  ))}
                </div>
                <p>Тренд конверсии: от 38% до 64% за 7 недель</p>
              </article>
              <article className="mockCard">
                <p className="mockTitle">Отчет за 2 минуты</p>
                <div className="mockLine">
                  <span>Транскрипция</span>
                  <strong>0:45</strong>
                </div>
                <div className="mockLine">
                  <span>AI-анализ</span>
                  <strong>1:20</strong>
                </div>
                <div className="mockLine isDone">
                  <span>Отчет готов</span>
                  <strong>2:00</strong>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="book-demo" className="section bookDemo" aria-labelledby="book-demo-title">
          <div className="bookDemoInner">
            <div>
              <p className="eyebrow">Живая презентация</p>
              <h2 id="book-demo-title">Записаться на демо</h2>
              <p className="bookDemoLead">
                Покажем кабинет на ваших сценариях: воронка, KPI операторов и разбор звонков. Обычно 30–40 минут.
              </p>
            </div>
            <a
              href={bookDemoHref}
              {...(bookDemoIsMailto ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
              className="cta bookDemoCta"
            >
              Записаться на демо
            </a>
          </div>
        </section>

        <section id="screens" className="section screenGallery">
          <h2>Ключевые графики платформы</h2>
          <p className="screenLead">Наглядная аналитика без мелких скриншотов: динамика, причины потерь и KPI команды продаж.</p>
          <div className="screenGrid">
            <article className="screenCard">
              <div className="chartCard chartTrend" role="img" aria-label="График роста конверсии по неделям">
                <div className="chartAxis">
                  <span>70%</span>
                  <span>50%</span>
                  <span>30%</span>
                </div>
                <div className="chartCols">
                  {trendPoints.map((point, index) => (
                    <div key={`trend-${point}-${index}`} className="chartCol">
                      <span style={{ height: `${point}%` }} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="screenMeta">
                <h3>Рост конверсии по неделям</h3>
                <p>Видно, как меняется результат после внедрения скриптов и коучинга.</p>
              </div>
            </article>
            <article className="screenCard">
              <div className="chartCard chartBars" role="img" aria-label="График причин потерь звонков">
                {lossBars.map((bar) => (
                  <div key={bar.label} className="barRow">
                    <p>{bar.label}</p>
                    <div className="barTrack">
                      <span style={{ width: `${bar.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="screenMeta">
                <h3>Причины потерь в звонках</h3>
                <p>Приоритизация зон обучения менеджеров по влиянию на выручку.</p>
              </div>
            </article>
          </div>
        </section>

        <section className="section">
          <h2>Кому полезен сервис</h2>
          <div className="grid four">
            {audiences.map((item) => (
              <article key={item.title} className="card">
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="how" className="section alt">
          <h2>Как это работает</h2>
          <div className="grid">
            {steps.map((step, idx) => (
              <article key={step.title} className="card">
                <p className="num">{String(idx + 1).padStart(2, '0')}</p>
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="adv" className="section">
          <h2>Преимущества</h2>
          <div className="grid">
            {advantages.map((item) => (
              <article key={item.title} className="card">
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="cases" className="section alt">
          <h2>Кейсы клиентов</h2>
          <div className="grid three">
            {cases.map((item) => (
              <article key={item.company} className="card">
                <h3>{item.company}</h3>
                <p className="metric">{item.metric}</p>
                <p className="caseContext">{item.context}</p>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="pricing" className="section">
          <h2>Тарифы</h2>
          <div className="grid five">
            {pricing.map((pack) => (
              <article key={pack.id} className={`card pricingCard ${pack.popular ? 'popular' : ''}`}>
                <p className="label">{pack.id}</p>
                <h3>{pack.price}</h3>
                <p>{pack.minutes}</p>
                <p>{pack.perMinute}</p>
                <ul className="featureList">
                  {pack.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <button
                  className="cta"
                  type="button"
                  onClick={() => {
                    setSelectedPackage(pack.id)
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  Выбрать тариф
                </button>
              </article>
            ))}
          </div>
        </section>

        <section id="faq" className="section alt">
          <h2>FAQ</h2>
          <div className="faq">
            {faqs.map(([q, a], idx) => (
              <article key={q} className="faqItem">
                <button type="button" onClick={() => setOpenFaq((v) => (v === idx ? -1 : idx))}>
                  <span>{q}</span>
                  <span>{openFaq === idx ? '−' : '+'}</span>
                </button>
                {openFaq === idx && <p>{a}</p>}
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="section contact">
          <h2>Оставьте заявку на разбор первых 20 звонков</h2>
          <p className="selected">Выбранный тариф: {selectedPackage}</p>
          {submitted ? (
            <div className="card" style={{ maxWidth: 560, textAlign: 'center', padding: '2rem' }}>
              <h3>Спасибо за заявку!</h3>
              <p>Мы свяжемся с вами в ближайшее время.</p>
            </div>
          ) : (
            <form onSubmit={submitForm} className="form">
              <input
                name="name"
                autoComplete="name"
                placeholder="Ваше имя"
                value={formState.name}
                onChange={handleChange('name')}
              />
              <input
                name="organization"
                autoComplete="organization"
                placeholder="Компания"
                value={formState.company}
                onChange={handleChange('company')}
              />
              <input
                name="organization-title"
                autoComplete="organization-title"
                placeholder="Роль"
                value={formState.role}
                onChange={handleChange('role')}
              />
              <input
                name="team"
                inputMode="numeric"
                placeholder="Количество менеджеров"
                value={formState.team}
                onChange={handleChange('team')}
              />
              <input
                name="contact"
                autoComplete="tel"
                inputMode="tel"
                type="tel"
                placeholder="Телефон или Telegram"
                value={formState.contact}
                onChange={handleChange('contact')}
              />
              <label className="consent">
                <input type="checkbox" checked={formState.consent} onChange={handleChange('consent')} />
                Принимаю{' '}
                <a href={consentUrl} target="_blank" rel="noopener noreferrer">
                  условия обработки данных
                </a>
                ,{' '}
                <a href={recordingConsentUrl} target="_blank" rel="noopener noreferrer">
                  положения о записи переговоров
                </a>{' '}
                и{' '}
                <a href={privacyUrl} target="_blank" rel="noopener noreferrer">
                  политику конфиденциальности
                </a>
                ; условия оферты:{' '}
                <a href={offerUrl} target="_blank" rel="noopener noreferrer">
                  публичная оферта
                </a>
              </label>
              <button className="cta" type="submit" disabled={!canSubmit || submitting}>
                {submitting ? 'Отправка...' : 'Отправить заявку'}
              </button>
            </form>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>© 2026 Dialogik</p>
        <div>
          <a href={privacyUrl}>Политика</a>
          <a href={consentUrl}>Согласие</a>
          <a href={recordingConsentUrl}>Запись звонков</a>
          <a href={offerUrl}>Оферта</a>
        </div>
      </footer>
    </div>
  )
}
