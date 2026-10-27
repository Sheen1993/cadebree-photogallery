const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;

export interface TimeTogether {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/** Elapsed time since `since`, split into whole days plus the remaining hours/minutes/seconds. */
export function getTimeTogether(since: Date, now: Date = new Date()): TimeTogether {
  const elapsed = Math.max(0, now.getTime() - since.getTime());
  return {
    days: Math.floor(elapsed / MS_PER_DAY),
    hours: Math.floor((elapsed % MS_PER_DAY) / MS_PER_HOUR),
    minutes: Math.floor((elapsed % MS_PER_HOUR) / MS_PER_MINUTE),
    seconds: Math.floor((elapsed % MS_PER_MINUTE) / MS_PER_SECOND),
  };
}

/** Parses a YYYY-MM-DD string as a local date, avoiding the UTC shift of `new Date(iso)`. */
export function parseIsoDate(iso: string): Date {
  const [year = 1970, month = 1, day = 1] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** Whole calendar days from today until `target`; negative once it has passed. */
export function daysUntil(target: Date, now: Date = new Date()): number {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target.getTime() - today.getTime()) / MS_PER_DAY);
}

const longDate = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
const shortDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export function formatDate(iso: string, style: 'long' | 'short' = 'long'): string {
  return (style === 'long' ? longDate : shortDate).format(parseIsoDate(iso));
}
