import { Game, League, TeamStanding } from '@/types';

// Mock data for development purposes
// In a real app, this would be replaced with actual API calls

const mockTeams = [
  { id: 1, name: 'Green Eagles', logo: 'https://images.pexels.com/photos/855414/pexels-photo-855414.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 2, name: 'Blue Sharks', logo: 'https://images.pexels.com/photos/615336/pexels-photo-615336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 3, name: 'Red Dragons', logo: 'https://images.pexels.com/photos/3755440/pexels-photo-3755440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 4, name: 'Yellow Tigers', logo: 'https://images.pexels.com/photos/7835663/pexels-photo-7835663.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 5, name: 'Purple Panthers', logo: 'https://images.pexels.com/photos/33961/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 6, name: 'Orange Owls', logo: 'https://images.pexels.com/photos/2261/food-man-person-face.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
];

const mockLeagues: League[] = [
  { 
    id: 1, 
    name: 'City Basketball League', 
    logo: 'https://images.pexels.com/photos/976873/pexels-photo-976873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    sport: 'Basketball',
    teamCount: 8,
    season: '2025'
  },
  { 
    id: 2, 
    name: 'Regional Soccer Cup', 
    logo: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    sport: 'Soccer',
    teamCount: 12,
    season: '2025'
  },
  { 
    id: 3, 
    name: 'Downtown Volleyball', 
    logo: 'https://images.pexels.com/photos/1263426/pexels-photo-1263426.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    sport: 'Volleyball',
    teamCount: 6,
    season: '2025'
  },
];

const generateMockGames = (): Game[] => {
  const games: Game[] = [];
  const statuses = ['scheduled', 'live', 'completed'];
  const venues = ['City Arena', 'Downtown Stadium', 'West Park Court', 'East Side Gym'];
  
  // Generate 20 games with different statuses
  for (let i = 1; i <= 20; i++) {
    const homeTeamIndex = Math.floor(Math.random() * mockTeams.length);
    let awayTeamIndex = Math.floor(Math.random() * mockTeams.length);
    
    // Make sure home and away teams are different
    while (awayTeamIndex === homeTeamIndex) {
      awayTeamIndex = Math.floor(Math.random() * mockTeams.length);
    }
    
    const leagueIndex = Math.floor(Math.random() * mockLeagues.length);
    const statusIndex = Math.floor(Math.random() * statuses.length);
    const status = statuses[statusIndex] as 'scheduled' | 'live' | 'completed';
    
    // Generate a random date between -7 days and +14 days from now
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 21) - 7);
    
    // For live games, make sure the date is today
    if (status === 'live') {
      date.setDate(new Date().getDate());
    }
    
    // For completed games, make sure the date is in the past
    if (status === 'completed') {
      date.setDate(date.getDate() - Math.floor(Math.random() * 7) - 1);
    }
    
    let homeScore = 0;
    let awayScore = 0;
    let period = '';
    let timeRemaining = '';
    
    if (status === 'live' || status === 'completed') {
      homeScore = Math.floor(Math.random() * 100);
      awayScore = Math.floor(Math.random() * 100);
      
      if (status === 'live') {
        const periods = ['1st', '2nd', '3rd', '4th'];
        period = periods[Math.floor(Math.random() * periods.length)];
        timeRemaining = `${Math.floor(Math.random() * 12)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;
      }
    }
    
    const stats = status !== 'scheduled' ? [
      { name: 'Shots', homeValue: Math.floor(Math.random() * 30) + 10, awayValue: Math.floor(Math.random() * 30) + 10 },
      { name: 'Possession', homeValue: `${Math.floor(Math.random() * 40) + 30}%`, awayValue: `${Math.floor(Math.random() * 40) + 30}%` },
      { name: 'Fouls', homeValue: Math.floor(Math.random() * 15), awayValue: Math.floor(Math.random() * 15) },
    ] : [];
    
    games.push({
      id: i,
      homeTeam: mockTeams[homeTeamIndex],
      awayTeam: mockTeams[awayTeamIndex],
      homeScore,
      awayScore,
      status,
      scheduledAt: date.toISOString(),
      venue: venues[Math.floor(Math.random() * venues.length)],
      league: mockLeagues[leagueIndex],
      period,
      timeRemaining,
      stats,
    });
  }
  
  return games;
};

const mockGames = generateMockGames();

const mockStandings: TeamStanding[] = mockTeams.map((team, index) => {
  const played = Math.floor(Math.random() * 10) + 5;
  const won = Math.floor(Math.random() * played);
  const lost = played - won;
  const points = won * 3;
  
  return {
    teamId: team.id,
    teamName: team.name,
    played,
    won,
    lost,
    points,
  };
});

// Simulated API calls with delays to mimic network requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchUpcomingGames = async (): Promise<Game[]> => {
  await delay(500);
  return mockGames
    .filter(game => game.status === 'scheduled')
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 5);
};

export const fetchLiveGames = async (): Promise<Game[]> => {
  await delay(500);
  return mockGames.filter(game => game.status === 'live');
};

export const fetchRecentGames = async (): Promise<Game[]> => {
  await delay(500);
  return mockGames
    .filter(game => game.status === 'completed')
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())
    .slice(0, 10);
};

export const fetchGamesByDate = async (date: Date): Promise<Game[]> => {
  await delay(500);
  return mockGames.filter(game => {
    const gameDate = new Date(game.scheduledAt);
    return gameDate.getDate() === date.getDate() && 
           gameDate.getMonth() === date.getMonth() && 
           gameDate.getFullYear() === date.getFullYear();
  });
};

export const fetchGameById = async (id: number): Promise<Game> => {
  await delay(500);
  const game = mockGames.find(game => game.id === id);
  if (!game) {
    throw new Error('Game not found');
  }
  return game;
};

export const fetchLeagues = async (): Promise<League[]> => {
  await delay(500);
  return mockLeagues;
};

export const fetchFeaturedLeagues = async (): Promise<League[]> => {
  await delay(500);
  // Return a random subset of leagues
  return [...mockLeagues].sort(() => Math.random() - 0.5).slice(0, 2);
};

export const fetchStandings = async (leagueId: number): Promise<TeamStanding[]> => {
  await delay(500);
  // Sort by points in descending order
  return [...mockStandings].sort((a, b) => b.points - a.points);
};

export const fetchRefereeAssignments = async (): Promise<Game[]> => {
  await delay(500);
  // Return a subset of games as referee assignments
  return mockGames.filter((_, index) => index % 3 === 0).slice(0, 6);
};