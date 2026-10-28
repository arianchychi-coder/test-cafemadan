import { useEffect, useRef } from 'react';
import { ArrowLeft, Layers3 } from 'lucide-react';
import './motion-story.css';

const clamp = value => Math.max(0, Math.min(1, value));
const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };

export default function MotionStory() {
  const storyRef = useRef(null);
  const stageRef = useRef(null);
  const filmRef = useRef(null);
  const percentRef = useRef(null);

  useEffect(() => {
    const story = storyRef.current;
    const stage = stageRef.current;
    const film = filmRef.current;
    if (!story || !stage || !film) return undefined;

    let raf = 0;
    let currentProgress = 0;
    let lastFrameAt = 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const set = (name, value) => stage.style.setProperty(name, typeof value === 'number' ? value.toFixed(3) : value);
    const seekFilm = progress => {
      if (!film.duration || !Number.isFinite(film.duration)) return;
      // Skip the truck intro and begin on the dark underground light sequence.
      const sourceStart = 0.62;
      const sourceEnd = 0.93;
      const time = (sourceStart + clamp(progress) * (sourceEnd - sourceStart)) * Math.max(0, film.duration - 0.04);
      if (Math.abs(time - film.currentTime) > 0.045) film.currentTime = time;
    };

    const update = timestamp => {
      const rect = story.getBoundingClientRect();
      const range = Math.max(1, story.offsetHeight - window.innerHeight);
      const target = clamp(-rect.top / range);
      const delta = Math.min(50, lastFrameAt ? timestamp - lastFrameAt : 16);
      lastFrameAt = timestamp;
      const damping = reducedMotion ? 1 : 1 - Math.exp(-delta / 110);
      currentProgress += (target - currentProgress) * damping;
      if (Math.abs(target - currentProgress) < 0.0007) currentProgress = target;
      const p = currentProgress;

      set('--ambient-drift', `${(-1.2 * p).toFixed(2)}vh`);
      set('--film-drift', `${(-0.45 * p).toFixed(2)}vh`);
      set('--film-scale', (1.025 + 0.045 * smooth(p)));
      set('--hint-opacity', 1 - smooth(p / 0.15));
      set('--progress-width', `${(p * 100).toFixed(2)}%`);

      const streamOpacity = smooth((p - 0.015) / 0.08) * (1 - smooth((p - 0.34) / 0.12));
      set('--logo-stream-opacity', streamOpacity);
      set('--logo-trace-opacity', smooth((p - 0.095) / 0.08) * (1 - smooth((p - 0.69) / 0.075)));
      set('--logo-trace-progress', smooth((p - 0.1) / 0.48));
      set('--logo-image-opacity', smooth((p - 0.49) / 0.085));

      const logoFlight = smooth((p - 0.67) / 0.18);
      set('--logo-scale', 1 - 0.58 * logoFlight);
      set('--logo-top', `${(50 - 31 * logoFlight).toFixed(2)}vh`);
      set('--logo-yaw', `${(12 * (1 - logoFlight)).toFixed(2)}deg`);
      set('--logo-pitch', `${(-5 * (1 - logoFlight)).toFixed(2)}deg`);
      set('--whiteout-opacity', smooth((p - 0.83) / 0.16));

      if (percentRef.current) percentRef.current.textContent = `${String(Math.round(p * 100)).padStart(2, '0')}%`;
      seekFilm(p);
      if (Math.abs(target - currentProgress) > 0.0007) raf = requestAnimationFrame(update);
      else raf = 0;
    };

    const queue = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    film.addEventListener('loadedmetadata', queue);
    film.addEventListener('seeked', () => stage.classList.add('media-ready'), { once: true });
    if (film.readyState >= 1) seekFilm(0);
    queue();
    return () => {
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
      film.removeEventListener('loadedmetadata', queue);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <section className="motion-story" id="top" ref={storyRef} aria-label="روایت سینمایی همایش کافه معدن">
    <div className="ms-stage" ref={stageRef}>
      <div className="ms-ambient" aria-hidden="true" />
      <div className="ms-film">
        <video ref={filmRef} muted playsInline preload="auto" poster="/images/logo-formation-poster.png" src="/videos/mineral-film-edited-v3.mp4" aria-label="نورهایی که با اسکرول، لوگوی کافه معدن را شکل می‌دهند" />
      </div>

      <header className="story-header">
        <a className="story-brand" href="#top" aria-label="کافه معدن، بازگشت به ابتدای صفحه"><span className="story-brand-mark"><Layers3 size={18} /></span><span>کافه معدن<small>همایش هوش مالی</small></span></a>
        <nav aria-label="ناوبری اصلی"><a href="#field-story">روایت</a><a href="#topics">محورها</a><a href="#speakers">سخنرانان</a></nav>
        <a className="story-header-cta" href="#register">جزئیات همایش <ArrowLeft size={15} /></a>
      </header>

      <svg className="ms-logo-streams" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
        <defs><linearGradient id="ms-logo-ray-grad" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#83e9ff" stopOpacity="0" /><stop offset=".72" stopColor="#baf6ff" stopOpacity=".95" /><stop offset="1" stopColor="#f3b51b" /></linearGradient></defs>
        <path pathLength="1" d="M0 270 C260 250 355 410 500 500" /><path pathLength="1" d="M1000 250 C750 255 630 400 500 500" /><path pathLength="1" d="M0 760 C270 730 380 585 500 500" /><path pathLength="1" d="M1000 770 C745 720 620 575 500 500" /><path pathLength="1" d="M310 0 C360 230 430 390 500 500" /><path pathLength="1" d="M720 0 C655 230 575 385 500 500" />
      </svg>

      <div className="ms-logo-stack" aria-label="لوگوی کافه معدن"><svg className="ms-logo-trace" viewBox="0 0 240 350" preserveAspectRatio="none" aria-hidden="true">
        <path pathLength="1" d="M30 43 C61 35 84 38 117 46 S178 57 210 58" /><path pathLength="1" d="M30 63 C63 54 83 58 116 67 S177 78 210 80" /><path pathLength="1" d="M30 84 C64 74 87 76 117 85 S176 98 210 99" /><path pathLength="1" d="M30 106 C62 98 80 88 112 94 S177 112 210 113" /><path pathLength="1" d="M30 128 C61 121 83 106 110 101 S177 129 210 129" /><path pathLength="1" d="M30 151 C61 146 83 137 113 126 S180 146 210 148" /><path pathLength="1" d="M30 174 C63 167 81 155 112 146 S180 163 210 167" /><path pathLength="1" d="M30 196 C62 190 82 183 111 173 S177 185 210 188" /><path pathLength="1" d="M30 219 C64 214 85 207 114 197 S180 204 210 210" /><path pathLength="1" d="M30 240 C63 236 85 231 115 221 S180 225 210 231" />
      </svg><img className="ms-logo-image" src="/images/cafe-madan-logo.png" alt="لوگوی کافه معدن" /></div>

      <div className="ms-scroll-hint"><i aria-hidden="true" /><span>اسکرول کن؛ نورها لوگو را می‌سازند</span></div>
      <div className="ms-meter" aria-hidden="true"><span>SCROLL</span><i /><b ref={percentRef}>00%</b></div>
      <div className="ms-whiteout" aria-hidden="true" />
    </div>
  </section>;
}

