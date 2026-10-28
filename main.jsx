import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDownLeft, ArrowLeft, ArrowUpLeft, BarChart3, BadgeCheck,
  CalendarDays, ChevronLeft, CircleDollarSign, CircleHelp, Coins,
  Gauge, Layers3, MapPin, Pickaxe, Play, ShieldAlert, Sparkles, Users,
} from 'lucide-react';
import './base.css';
import './style.css';
import MotionStory from './MotionStory.jsx';

const fa = value => new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 1 }).format(value);

function App() {
  const [price, setPrice] = useState(82);
  const [cost, setCost] = useState(34);
  const [capital, setCapital] = useState(120);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('seen');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach(element => revealObserver.observe(element));

    let raf = 0;
    const updateProgress = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        document.documentElement.style.setProperty('--page-progress', max > 0 ? `${window.scrollY / max}` : '0');
        raf = 0;
      });
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    return () => {
      revealObserver.disconnect();
      window.removeEventListener('scroll', updateProgress);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(''), 4200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const model = useMemo(() => {
    const annualVolume = 1.2; // million tonnes; hypothetical
    const fixedCost = 18; // million USD per year; hypothetical
    const revenue = annualVolume * price;
    const operatingCost = annualVolume * cost + fixedCost;
    const operatingProfit = revenue - operatingCost;
    const capitalRecovery = capital / 5;
    const requiredPrice = cost + (fixedCost + capitalRecovery) / annualVolume;
    const simplePayback = operatingProfit > 0 ? capital / operatingProfit : null;
    const stressRevenue = annualVolume * price * 0.85;
    const stressCost = annualVolume * cost * 1.1 + fixedCost;
    const stressProfit = stressRevenue - stressCost;
    return { revenue, operatingCost, operatingProfit, capitalRecovery, requiredPrice, simplePayback, stressProfit };
  }, [price, cost, capital]);

  const showRegistrationNote = () => setNotice('تاریخ، محل و سامانهٔ ثبت‌نام پس از نهایی‌شدن اطلاعات همایش اعلام می‌شود.');

  return <>
    <div className="read-progress" aria-hidden="true" />
    <main>
      <MotionStory />

      <section className="field-section" id="field-story">
        <div className="wrap">
          <div className="field-intro" data-reveal>
            <div className="eyebrow"><span className="eyebrow-line" />روایت همایش / از زمین تا تصمیم</div>
            <h2>ارزش معدن،<br /><em>در لایه‌های تصمیم پنهان است.</em></h2>
            <p>هوش مالی کمک می‌کند داده‌های زمین‌شناسی و عملیاتی را کنار هم بخوانیم؛ تا ذخیره، هزینه و ریسک در تصمیم اقتصادی معنا پیدا کنند.</p>
          </div>
          <div className="station-grid">
            <StationCard index="۰۱" eyebrow="زمین‌شناسی / دارایی" title="ذخیره و عیار" text="چه چیزی در دل زمین داریم و برآورد ما چقدر اطمینان‌پذیر است؟" scene="reserve" marker="ارزش بالقوه" />
            <StationCard index="۰۲" eyebrow="عملیات / اقتصاد استخراج" title="هزینه و تولید" text="از استخراج تا فرآوری، کدام هزینه‌ها اقتصاد هر تن را شکل می‌دهند؟" scene="operations" marker="هزینهٔ واقعی" />
            <StationCard index="۰۳" eyebrow="مالی / تصمیم سرمایه" title="جریان نقد و ریسک" text="اگر قیمت یا هزینه تغییر کند، تصمیم امروز چه‌قدر تاب‌آوری دارد؟" scene="finance" marker="سناریوی سرمایه" />
          </div>
          <div className="field-footnote" data-reveal><span>حرکت یک پیوسته</span><i /><span>سه ایستگاه برای دیدن تصویر مالی معدن</span></div>
        </div>
      </section>

      <section className="speakers-section" id="speakers">
        <div className="wrap">
          <div className="section-topline" data-reveal><span>گفت‌وگوی میان‌رشته‌ای</span><span>کافه معدن　/　همایش</span></div>
          <div className="speakers-heading" data-reveal>
            <div><div className="eyebrow"><span className="eyebrow-line" />میزبانان و مهمانان</div><h2>سخنرانان را<br /><em>به‌زودی بشناسید.</em></h2></div>
            <p>نگاه زمین‌شناسی، مهندسی و مالی کنار هم می‌نشینند تا دربارهٔ تصمیم‌هایی حرف بزنند که آیندهٔ دارایی‌های معدنی را می‌سازند.</p>
          </div>
          <div className="speaker-grid">
            <SpeakerCard monogram="ک" name="خانم مهندس کلانکی" label="مهمان همایش" index="01" />
            <SpeakerCard monogram="ک" name="آقای مهندس کلانکی" label="مهمان همایش" index="02" featured />
            <SpeakerCard monogram="ب" name="آقای بازوندی" label="مهمان همایش" index="03" />
          </div>
          <div className="speaker-note"><Users size={15} /><span>معرفی کامل و ویدیوی دعوت سخنرانان پس از دریافت اطلاعات نهایی جایگزین می‌شود.</span></div>
        </div>
      </section>

      <section className="economics-section" id="scenario">
        <div className="wrap economics-layout">
          <div className="economics-copy" data-reveal>
            <div className="eyebrow"><span className="eyebrow-line" />میز تصمیم / شبیه‌سازی ساده</div>
            <h2>یک فرض را عوض کن.<br /><em>اثر آن را ببین.</em></h2>
            <p>قیمت فروش، هزینهٔ استخراج و سرمایهٔ اولیه را تغییر بده. این مدل کوچک نشان می‌دهد چند فرض اقتصادی چطور به هم وابسته‌اند.</p>
            <div className="model-note"><BadgeCheck size={16} /><span>سناریوی نمایشی است؛ دادهٔ یک معدن واقعی یا توصیهٔ سرمایه‌گذاری نیست.</span></div>
            <div className="model-assumptions"><span>پایهٔ محاسبه</span><p>حجم فروش سالانهٔ فرضی: ۱٫۲ میلیون تن · هزینهٔ ثابت فرضی: ۱۸ میلیون دلار در سال · دورهٔ بازیافت فرضی سرمایه: ۵ سال</p><small>مالیات، بازیابی، زمان‌بندی، تأمین مالی و نوسان واقعی بازار در این مدل لحاظ نشده‌اند.</small></div>
          </div>

          <div className="finance-console" data-reveal>
            <div className="console-header"><span><i />سناریوی معدن / نمونهٔ ۰۱</span><span>USD · فرضی</span></div>
            <RangeControl label="قیمت فروش هر تن" value={price} min={45} max={130} unit="دلار" onChange={setPrice} />
            <RangeControl label="هزینهٔ استخراج هر تن" value={cost} min={15} max={70} unit="دلار" onChange={setCost} />
            <RangeControl label="سرمایهٔ اولیه" value={capital} min={40} max={260} step={5} unit="میلیون دلار" onChange={setCapital} />

            <div className="metric-grid">
              <Metric label="درآمد سالانه" value={model.revenue} unit="میلیون دلار" icon={<Coins size={15} />} />
              <Metric label="هزینهٔ عملیاتی" value={model.operatingCost} unit="میلیون دلار" icon={<Gauge size={15} />} />
              <Metric label="سود عملیاتی" value={model.operatingProfit} unit="میلیون دلار" icon={<BarChart3 size={15} />} featured />
            </div>

            <div className={`stress-test ${model.stressProfit >= 0 ? 'stress-positive' : 'stress-negative'}`}>
              <div className="stress-icon"><ShieldAlert size={17} /></div>
              <div className="stress-copy"><span>آزمون فشار / قیمت −۱۵٪، هزینه +۱۰٪</span><b>{model.stressProfit >= 0 ? 'سود عملیاتی سناریو مثبت می‌ماند' : 'سود عملیاتی سناریو منفی می‌شود'}</b><small>سود در این فرض: {fa(model.stressProfit)} میلیون دلار در سال</small></div>
              <span className="stress-tag">فرضی</span>
            </div>

            <div className="console-footer"><span>قیمت لازم برای پوشش مدل: <b>{fa(model.requiredPrice)} دلار / تن</b></span><span>بازگشت سادهٔ سرمایه: <b>{model.simplePayback == null ? '—' : `${fa(model.simplePayback)} سال`}</b></span></div>
          </div>
        </div>
      </section>

      <section className="agenda-section" id="topics">
        <div className="wrap agenda-layout">
          <div className="agenda-heading" data-reveal>
            <div className="eyebrow"><span className="eyebrow-line" />محورهای گفت‌وگو</div>
            <h2>سؤال‌های درست،<br /><em>پیش از تصمیم بزرگ.</em></h2>
            <p>همایش برای مالکان و مدیران دارایی‌های معدنی طراحی شده که به خدمات مالی و نگاه دقیق‌تری به اقتصاد پروژه نیاز دارند.</p>
          </div>
          <div className="agenda-list" data-reveal>
            <AgendaRow index="۱" icon={<Layers3 size={18} />} title="ارزش‌گذاری دارایی معدنی" text="پیوند ذخیره، عیار و عدم‌قطعیت با ارزش اقتصادی پروژه." />
            <AgendaRow index="۲" icon={<CircleDollarSign size={18} />} title="سرمایه و جریان نقد" text="دیدن نیاز مالی پروژه در کنار هزینه، زمان و درآمد." />
            <AgendaRow index="۳" icon={<CircleHelp size={18} />} title="ریسک و سناریو" text="بررسی اینکه تغییر قیمت و هزینه چطور نتیجهٔ تصمیم را جابه‌جا می‌کند." />
          </div>
        </div>
      </section>

      <section className="closing-section" id="register">
        <div className="closing-topography" aria-hidden="true"><ContourGraphic /></div>
        <div className="wrap closing-content" data-reveal>
          <div className="closing-mark"><Pickaxe size={18} /><span>کافه معدن</span></div>
          <div className="eyebrow"><span className="eyebrow-line" />دعوت به گفت‌وگو</div>
          <h2>از مغزه تا میز تصمیم.</h2>
          <p>همایش هوش مالی در معدن‌داری؛ جایی برای کنار هم دیدن زمین، عملیات و سرمایه.</p>
          <div className="event-details"><span><CalendarDays size={15} />تاریخ: به‌زودی</span><span><MapPin size={15} />محل برگزاری: به‌زودی</span></div>
          <button className="register-button" type="button" onClick={showRegistrationNote}>از شروع ثبت‌نام باخبرم کن <ArrowLeft size={17} /></button>
          <small className="registration-footnote">این نسخه نمونه است؛ لینک ثبت‌نام با نهایی‌شدن اطلاعات رویداد متصل می‌شود.</small>
        </div>
      </section>
    </main>
    <footer className="site-footer">
      <div className="wrap footer-inner"><a className="footer-brand" href="#top"><span className="footer-symbol"><Layers3 size={17} /></span><span>کافه معدن<small>نبض مالی معدن</small></span></a><span>نمونهٔ تعاملی · داده‌های اقتصادی همگی فرضی‌اند</span><span className="footer-en">CAFE MADAN　/　FINANCIAL INTELLIGENCE</span></div>
    </footer>
    {notice && <div className="notice-toast" role="status"><Sparkles size={16} /><span>{notice}</span><button type="button" onClick={() => setNotice('')} aria-label="بستن پیام"><ArrowDownLeft size={15} /></button></div>}
  </>;
}

function StationCard({ index, eyebrow, title, text, scene, marker }) {
  return <article className={`station-card station-${scene}`} data-reveal>
    <div className="station-art"><MiniatureScene type={scene} /><span className="station-marker"><i />{marker}</span></div>
    <div className="station-card-copy"><div><span className="station-index">{index}</span><span className="station-eyebrow">{eyebrow}</span></div><h3>{title}</h3><p>{text}</p><a href="#scenario" aria-label={`دیدن سناریوی ${title}`}>بررسی در سناریو <ChevronLeft size={15} /></a></div>
  </article>;
}

function MiniatureScene({ type }) {
  return <svg viewBox="0 0 420 230" role="img" aria-label="تصویر فنی از زمین و فعالیت معدنی" className={`miniature-svg miniature-${type}`}>
    <path className="miniature-ground" d="M0 172 C62 136 104 151 153 126 C220 91 266 159 325 115 C366 85 392 105 420 89 V230 H0Z" />
    <path className="contour contour-a" d="M-10 169 C55 133 104 157 151 128 C213 89 275 167 325 119 C364 84 392 112 431 85" />
    <path className="contour contour-b" d="M-12 184 C53 151 102 172 150 145 C213 108 272 181 321 137 C363 103 396 128 431 105" />
    <path className="contour contour-c" d="M-11 200 C52 169 98 187 146 163 C210 129 267 197 316 155 C361 122 397 146 432 126" />
    <path className="contour contour-d" d="M-10 216 C46 187 95 202 141 181 C204 149 262 214 311 174 C358 143 397 165 431 146" />
    <path className="ore-vein" d="M44 211 C106 176 130 188 174 150 S248 130 285 108" />
    <path className="route-line" d="M36 157 C109 178 152 126 212 138 S313 157 378 103" />
    <circle className="route-node" cx="38" cy="157" r="5" /><circle className="route-node" cx="212" cy="138" r="5" /><circle className="route-node" cx="378" cy="103" r="5" />
    {type === 'reserve' && <g className="mini-person" transform="translate(88 83)"><circle className="person-head" cx="0" cy="0" r="8" /><path className="person-helmet" d="M-10 0a10 10 0 0 1 20 0M-12 1h24" /><path className="person-body" d="M0 9v29m0-17-12 13m12-13 12 13m-12 4-9 18m9-18 9 18" /><path className="sample-core" d="M25 34v21m8-21v21m-10-21h12m-12 21h12" /></g>}
    {type === 'operations' && <g className="mini-truck" transform="translate(177 106)"><path d="M0 28h72v-23H17L8 15H0Z" /><path d="M72 11h20l14 15v17H72Z" /><path d="M7 13 18 2h44l8 7" /><circle cx="21" cy="47" r="9" /><circle cx="82" cy="47" r="9" /><circle className="truck-light" cx="21" cy="47" r="3" /><circle className="truck-light" cx="82" cy="47" r="3" /></g>}
    {type === 'finance' && <g className="mini-person mini-analyst" transform="translate(309 77)"><circle className="person-head" cx="0" cy="0" r="8" /><path className="person-helmet" d="M-10 0a10 10 0 0 1 20 0M-12 1h24" /><path className="person-body" d="M0 9v30m0-18-10 12m10-12 10 12m-10 6-8 17m8-17 8 17" /><rect className="finance-board" x="-42" y="20" width="23" height="30" rx="2" /><path className="finance-chart" d="m-38 41 5-6 5 2 4-8" /></g>}
    <text className="miniature-label" x="20" y="28">{type === 'reserve' ? 'RESOURCE' : type === 'operations' ? 'UNIT COST' : 'CASH FLOW'}</text>
  </svg>;
}

function SpeakerCard({ monogram, name, label, index, featured }) {
  return <article className={`speaker-card ${featured ? 'speaker-featured' : ''}`} data-reveal>
    <div className="speaker-portrait"><ContourGraphic /><span>{monogram}</span><i className="portrait-dot" /></div>
    <div className="speaker-card-meta"><span>{label}</span><span>۰{index}</span></div>
    <h3>{name}</h3>
    <p>معرفی و سوابق سخنران به‌زودی</p>
    <div className="speaker-rule"><span /></div>
  </article>;
}

function RangeControl({ label, value, min, max, step = 1, unit, onChange }) {
  const fill = ((value - min) / (max - min)) * 100;
  return <label className="range-control">
    <span className="range-title">{label}<b>{fa(value)} <small>{unit}</small></b></span>
    <input type="range" dir="ltr" min={min} max={max} step={step} value={value} onChange={event => onChange(+event.target.value)} style={{ '--range-fill': `${fill}%` }} aria-label={label} />
    <span className="range-limits" dir="ltr"><span>{fa(min)}</span><span>{fa(max)}</span></span>
  </label>;
}

function Metric({ label, value, unit, icon, featured }) {
  return <div className={`metric ${featured ? 'metric-featured' : ''}`}><span className="metric-icon">{icon}</span><span className="metric-label">{label}</span><b>{fa(value)}<small>{unit}</small></b></div>;
}

function AgendaRow({ index, icon, title, text }) {
  return <article className="agenda-row"><span className="agenda-index">{index}</span><span className="agenda-icon">{icon}</span><div><h3>{title}</h3><p>{text}</p></div><ArrowUpLeft className="agenda-arrow" size={17} /></article>;
}

function ContourGraphic() {
  return <svg viewBox="0 0 240 150" preserveAspectRatio="none" aria-hidden="true" className="contour-graphic">
    <path d="M-20 22C35 1 68 12 99 25s63 17 95 1 50-14 75-5" /><path d="M-20 42C35 21 68 32 99 45s63 17 95 1 50-14 75-5" /><path d="M-20 62C35 41 68 52 99 65s63 17 95 1 50-14 75-5" /><path d="M-20 82C35 61 68 72 99 85s63 17 95 1 50-14 75-5" /><path d="M-20 102C35 81 68 92 99 105s63 17 95 1 50-14 75-5" /><path d="M-20 122C35 101 68 112 99 125s63 17 95 1 50-14 75-5" />
  </svg>;
}

createRoot(document.getElementById('root')).render(<App />);
