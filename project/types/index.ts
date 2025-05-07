// Team type
export type Team = {
  id: number;
  name: string;
  logo: string;
};

// League type
export type League = {
  id: number;
  name: string;
  logo: string;
  sport: string;
  teamCount: number;
  season: string;
};

// Game type
export type Game = {
  id: number;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  status: 'scheduled' | 'live' | 'completed';
  scheduledAt: string;
  venue: string;
  league: League;
  period?: string;
  timeRemaining?: string;
  stats?: Array<{
    name: string;
    homeValue: number | string;
    awayValue: number | string;
  }>;
};

// Team standings type
export type TeamStanding = {
  teamId: number;
  teamName: string;
  played: number;
  won: number;
  lost: number;
  points: number;
};

// User role type
export type UserRole = 'fan' | 'player' | 'referee' | 'organizer';

// User type
export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};