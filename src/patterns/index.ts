import type { VoiceId } from '../audio/voices';

export type Pattern = {
  id: string;
  name: string;
  displayName?: string; // optional, defaults to `name`
  letterSpacing?: number; // optional
  steps: 12 | 16;
  grid: Partial<Record<VoiceId, number[]>>; // missing voice = all rests
};

// Helper: string like "1...1...1...1..." → [1,0,0,0,1,0,0,0,...]
const p = (s: string) => s.split('').map(c => (c === '1' ? 1 : 0));

// Patterns transcribed by ear from FR-1 demos — treat as starting point,
// refine against reference recordings. Source: FR-1 demo listening sessions.
export const PATTERNS: Pattern[] = [
  {
    id: 'waltz', name: 'Waltz', steps: 12, grid: {
      bd: p('1...........'),
      sd: p('....1...1...'),
      cy: p('1...1...1...'),
      mc: p('..1...1...1.'),
    }
  },
  {
    id: 'dixie', name: 'Dixieland', displayName: "Dixie land", steps: 16, grid: {
      bd: p('1...1...1...1...'),
      sd: p('....1.......1...'),
      cy: p('1.1.1.1.1.1.1.1.'),
      cl: p('..1...1...1...1.'),
    }
  },
  {
    id: 'western', name: 'Western', letterSpacing: -0.6, steps: 16, grid: {
      bd: p('1.......1.......'),
      sd: p('....1.......1...'),
      cb: p('1...1...1...1...'),
      mc: p('..1...1...1...1.'),
    }
  },
  {
    id: 'rock', name: "Rock'n Roll", letterSpacing: -0.2, steps: 16, grid: {
      bd: p('1...1...1...1...'),
      sd: p('....1.......1...'),
      cy: p('1.1.1.1.1.1.1.1.'),
    }
  },
  {
    id: 'slowrock', name: 'Slow Rock', steps: 16, grid: {
      bd: p('1.......1.......'),
      sd: p('....1.......1...'),
      cy: p('1.1.1.1.1.1.1.1.'),
    }
  },
  {
    id: 'bossa', name: 'Bosa Nova', steps: 16, grid: {
      bd: p('1...1...1...1...'),
      sd: p('....1.......1...'),
      cl: p('1..1..1...1.1...'),
      mc: p('..1...1...1...1.'),
    }
  },
  {
    id: 'foxtrot', name: 'Fox Trot', steps: 16, grid: {
      bd: p('1...1...1...1...'),
      sd: p('....1.......1...'),
      cy: p('..1...1...1...1.'),
    }
  },
  {
    id: 'swing', name: 'Swing', steps: 16, grid: {
      bd: p('1...1...1...1...'),
      sd: p('....1.......1...'),
      cy: p('1..1.11..1.11..1'), // swung ride feel
    }
  },
  {
    id: 'tango', name: 'Tango', steps: 16, grid: {
      bd: p('1.......1.......'),
      sd: p('......1.....1.1.'),
      cl: p('1...1...1...1.1.'),
    }
  },
  {
    id: 'beguine', name: 'Beguine', letterSpacing: -0.6, steps: 16, grid: {
      bd: p('1.....1.1.....1.'),
      lc: p('....1.......1...'),
      cl: p('1...1.1.1...1.1.'),
      mc: p('..1...1...1...1.'),
    }
  },
  {
    id: 'rhumba', name: 'Rhumba', letterSpacing: -0.4, steps: 16, grid: {
      bd: p('1.....1...1.....'),
      sd: p('....1.......1...'),
      cl: p('1..1..1...1.1...'),
      mc: p('..1...1...1...1.'),
    }
  },
  {
    id: 'samba', name: 'Samba', steps: 16, grid: {
      bd: p('1..1..1.1..1..1.'),
      sd: p('....1.......1...'),
      cb: p('1...1...1...1...'),
      mc: p('.1.1.1.1.1.1.1.1'),
    }
  },
  {
    id: 'mambo', name: 'Mambo', steps: 16, grid: {
      bd: p('1.....1.1.....1.'),
      sd: p('....1.......1...'),
      cb: p('1...1.1.1...1.1.'),
      lc: p('......1.......1.'),
    }
  },
  {
    id: 'chacha', name: 'Cha-Cha', letterSpacing: -0.6, steps: 16, grid: {
      bd: p('1...1...1...1.1.'),
      sd: p('....1.......1...'),
      cb: p('1.1.1.1.1.1.1.1.'),
      mc: p('..1...1...1...1.'),
    }
  },
  {
    id: 'sniffle', name: 'Sniffle', letterSpacing: -0.4, steps: 16, grid: {
      bd: p('1...1...1...1...'),
      sd: p('....1.......1...'),
      cy: p('1.1.1.1.1.1.1.1.'),
      cl: p('..1...1...1...1.'),
    }
  },
  {
    id: 'march', name: 'March', steps: 16, grid: {
      bd: p('1...1...1...1...'),
      sd: p('..1.1.1.1.1.1.1.'),
      cy: p('1...1...1...1...'),
    }
  },
];
