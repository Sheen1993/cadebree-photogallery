import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookHeart, Gem, Heart, Sparkles, Wine, type LucideIcon } from 'lucide-react';
import { TIMELINE, type MilestoneIcon, type TimelineMilestone } from '../data/galleryData';
import { daysUntil, parseIsoDate } from '../utils/date';
import SectionHeading from './SectionHeading';

gsap.registerPlugin(ScrollTrigger);

const ICONS: Record<MilestoneIcon, LucideIcon> = {
  ring: Gem,
  cheers: Wine,
  sparkles: Sparkles,
};

function CountdownBadge({ date }: { date: string }) {
  const remaining = daysUntil(parseIsoDate(date));
  if (remaining < 0) return null;

  const label =
    remaining === 0 ? 'Happy Anniversary, my love!' : `Coming up in ${remaining} ${remaining === 1 ? 'day' : 'days'}`;

  return (
    <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-love-gradient px-3.5 py-1.5 text-xs font-semibold text-slate-800 shadow-glow">
      <Heart className="h-3.5 w-3.5 animate-pulse fill-white text-white" aria-hidden="true" />
      {label}
    </span>
  );
}

function MilestoneCard({ milestone, alignRight }: { milestone: TimelineMilestone; alignRight: boolean }) {
  const Icon = ICONS[milestone.icon];
  return (
    <article
      data-card
      className="glass-card gradient-border group rounded-3xl p-6 transition-shadow duration-500 hover:shadow-glow sm:p-8"
    >
      <div className={`flex items-center gap-3 ${alignRight ? 'md:flex-row-reverse' : ''}`}>
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-love-gradient text-slate-800 shadow-md transition-transform duration-500 group-hover:rotate-12">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-love-sky-deep">{milestone.dateLabel}</p>
      </div>
      <h3 className="mt-4 font-display text-2xl font-bold text-slate-800 sm:text-3xl">{milestone.title}</h3>
      <p className="mt-3 leading-relaxed text-slate-600">{milestone.description}</p>
      <ul className={`mt-5 flex flex-wrap gap-2 ${alignRight ? 'md:justify-end' : ''}`}>
        {milestone.highlights.map((highlight) => (
          <li
            key={highlight}
            data-chip
            className="rounded-full border border-love-lilac/70 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600"
          >
            {highlight}
          </li>
        ))}
      </ul>
      {milestone.date && <CountdownBadge date={milestone.date} />}
    </article>
  );
}

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia(section);
    mm.add(
      { isDesktop: '(min-width: 768px)', reduceMotion: '(prefers-reduced-motion: reduce)' },
      (context) => {
        const { isDesktop = false, reduceMotion = false } = context.conditions ?? {};
        if (reduceMotion) return;

        // The gradient line "draws" itself as you scroll through the story.
        gsap.fromTo(
          progressRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: listRef.current, start: 'top 70%', end: 'bottom 55%', scrub: 0.6 },
          },
        );

        section.querySelectorAll<HTMLElement>('[data-milestone]').forEach((item) => {
          const fromX = isDesktop && item.dataset.side === 'left' ? -70 : 70;
          gsap
            .timeline({
              scrollTrigger: { trigger: item, start: 'top 80%', toggleActions: 'play none none reverse' },
            })
            .from(item.querySelector('[data-node]'), { scale: 0, rotate: -45, opacity: 0, duration: 0.6, ease: 'back.out(2.2)' })
            .from(item.querySelector('[data-card]'), { x: fromX, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.3')
            .from(item.querySelectorAll('[data-chip]'), { y: 12, opacity: 0, stagger: 0.08, duration: 0.45, ease: 'power2.out' }, '-=0.45');
        });

        gsap.from(section.querySelector('[data-finale]'), {
          scale: 0.6,
          opacity: 0,
          duration: 0.8,
          ease: 'back.out(1.8)',
          scrollTrigger: { trigger: section.querySelector('[data-finale]'), start: 'top 90%', toggleActions: 'play none none reverse' },
        });
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="story" aria-labelledby="story-title" className="relative px-4 py-24 sm:px-6 sm:py-32">
      <SectionHeading
        id="story-title"
        icon={BookHeart}
        eyebrow="Our Story"
        title="Chapters of Us"
        subtitle="A few of the moments that turned two people into one beautiful life."
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Track + scroll-driven progress line */}
        <div
          aria-hidden="true"
          className="absolute bottom-6 left-6 top-0 w-1 -translate-x-1/2 rounded-full bg-white/80 shadow-inner md:bottom-[4.5rem] md:left-1/2"
        >
          <div
            ref={progressRef}
            className="h-full w-full origin-top rounded-full bg-gradient-to-b from-love-sky via-love-lilac to-love-sky"
          />
        </div>

        <ol ref={listRef} className="relative space-y-14 sm:space-y-20">
          {TIMELINE.map((milestone, index) => {
            const side = index % 2 === 0 ? 'left' : 'right';
            return (
              <li key={milestone.id} data-milestone data-side={side} className="relative pl-16 md:grid md:grid-cols-2 md:gap-20 md:pl-0">
                <div className="absolute left-6 top-6 z-10 -translate-x-1/2 md:left-1/2">
                  <div
                    data-node
                    className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-love-gradient text-2xl shadow-glow"
                  >
                    <span role="img" aria-hidden="true">
                      {milestone.emoji}
                    </span>
                  </div>
                </div>
                <div className={side === 'left' ? 'md:col-start-1 md:text-right' : 'md:col-start-2'}>
                  <MilestoneCard milestone={milestone} alignRight={side === 'left'} />
                </div>
              </li>
            );
          })}
        </ol>

        <div data-finale className="relative mt-16 flex items-center gap-4 md:flex-col md:gap-0 md:text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-glow">
            <Heart className="h-6 w-6 animate-pulse fill-love-lilac text-love-lilac-deep" aria-hidden="true" />
          </span>
          <p className="font-script text-3xl text-love-lilac-deep md:mt-3">To be continued&hellip;</p>
        </div>
      </div>
    </section>
  );
}
