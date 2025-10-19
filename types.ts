
export interface MythOptions {
  theme: string;
  length: 'short' | 'full';
  tone: 'dramatic' | 'humorous' | 'dark' | 'epic';
}

export interface Character {
  name: string;
  role: string;
  description: string;
}

export interface Myth {
  title: string;
  characters: Character[];
  plot: string;
  symbolism: string;
}
