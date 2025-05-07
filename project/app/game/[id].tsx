import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ChevronLeft, Bell, Clock, MapPin, Star, Calendar, Zap } from 'lucide-react-native';
import { format } from 'date-fns';
import { theme } from '@/constants/theme';
import { fetchGameById } from '@/services/api';
import { Game } from '@/types';
import { useAuth } from '@/context/AuthContext';
import UpdateScoreModal from '@/components/UpdateScoreModal';

export default function GameDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);

  useEffect(() => {
    loadGame();
  }, [id]);

  const loadGame = async () => {
    try {
      setLoading(true);
      setError(null);
      if (id) {
        const fetchedGame = await fetchGameById(Number(id));
        setGame(fetchedGame);
        // In a real app, we would check if user has subscribed to this game
        setSubscribed(false);
      }
    } catch (error) {
      console.error('Failed to load game:', error);
      setError('Failed to load game details');
    } finally {
      setLoading(false);
    }
  };

  const toggleSubscription = () => {
    // In a real app, this would call an API to subscribe/unsubscribe
    setSubscribed(!subscribed);
  };

  const handleUpdateScore = () => {
    setShowScoreModal(true);
  };

  const handleScoreUpdate = async (homeScore: number, awayScore: number) => {
    // In a real app, this would call an API to update the score
    if (game) {
      const updatedGame = {
        ...game,
        homeScore,
        awayScore,
      };
      setGame(updatedGame);
    }
    setShowScoreModal(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary[600]} />
      </SafeAreaView>
    );
  }

  if (error || !game) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Game not found'}</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const isLive = game.status === 'live';
  const isUpcoming = game.status === 'scheduled';
  const isCompleted = game.status === 'completed';

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.subscribeButton}
              onPress={toggleSubscription}
            >
              <Bell 
                size={24} 
                color="white" 
                fill={subscribed ? 'white' : 'transparent'} 
              />
            </TouchableOpacity>
          </View>

          <View style={styles.gameHeader}>
            <View style={styles.leagueInfo}>
              <Text style={styles.leagueName}>{game.league.name}</Text>
            </View>
            
            {isLive && (
              <View style={styles.liveTag}>
                <Zap size={14} color="white" />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            )}
          </View>

          <View style={styles.teamsContainer}>
            <View style={styles.teamContainer}>
              <Image 
                source={{ uri: game.homeTeam.logo }} 
                style={styles.teamLogo} 
              />
              <Text style={styles.teamName}>{game.homeTeam.name}</Text>
            </View>
            
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>{game.homeScore}</Text>
              <Text style={styles.scoreText}>-</Text>
              <Text style={styles.scoreText}>{game.awayScore}</Text>
            </View>
            
            <View style={styles.teamContainer}>
              <Image 
                source={{ uri: game.awayTeam.logo }} 
                style={styles.teamLogo} 
              />
              <Text style={styles.teamName}>{game.awayTeam.name}</Text>
            </View>
          </View>

          {isLive && (
            <View style={styles.gameTime}>
              <Text style={styles.periodText}>
                {game.period} • {game.timeRemaining}
              </Text>
            </View>
          )}

          {isUpcoming && (
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Calendar size={16} color={theme.colors.text.secondary} style={styles.infoIcon} />
                <Text style={styles.infoText}>
                  {format(new Date(game.scheduledAt), 'EEEE, MMMM d, yyyy')}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Clock size={16} color={theme.colors.text.secondary} style={styles.infoIcon} />
                <Text style={styles.infoText}>
                  {format(new Date(game.scheduledAt), 'h:mm a')}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <MapPin size={16} color={theme.colors.text.secondary} style={styles.infoIcon} />
                <Text style={styles.infoText}>{game.venue}</Text>
              </View>
            </View>
          )}

          {isCompleted && (
            <View style={styles.infoContainer}>
              <Text style={styles.finalResultText}>Final Result</Text>
            </View>
          )}

          <View style={styles.statsContainer}>
            <Text style={styles.statsTitle}>Game Stats</Text>
            {game.stats && game.stats.length > 0 ? (
              game.stats.map((stat, index) => (
                <View key={index} style={styles.statRow}>
                  <View style={styles.statValueLeft}>
                    <Text style={styles.statValueText}>{stat.homeValue}</Text>
                  </View>
                  <View style={styles.statName}>
                    <Text style={styles.statNameText}>{stat.name}</Text>
                  </View>
                  <View style={styles.statValueRight}>
                    <Text style={styles.statValueText}>{stat.awayValue}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noStatsText}>
                {isUpcoming 
                  ? 'Game stats will be available once the game starts.' 
                  : 'No stats available for this game.'}
              </Text>
            )}
          </View>

          {user?.role === 'referee' && isLive && (
            <TouchableOpacity 
              style={styles.updateScoreButton}
              onPress={handleUpdateScore}
            >
              <Text style={styles.updateScoreText}>Update Score</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>

      <UpdateScoreModal
        visible={showScoreModal}
        game={game}
        onClose={() => setShowScoreModal(false)}
        onUpdate={handleScoreUpdate}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.text.secondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: theme.colors.primary[600],
  },
  backButton: {
    padding: 8,
  },
  subscribeButton: {
    padding: 8,
  },
  gameHeader: {
    backgroundColor: theme.colors.primary[600],
    paddingHorizontal: 16,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leagueInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leagueName: {
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    fontSize: 16,
  },
  liveTag: {
    backgroundColor: theme.colors.error[500],
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  liveText: {
    fontFamily: 'Inter-Bold',
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
  },
  teamContainer: {
    alignItems: 'center',
    width: '35%',
  },
  teamLogo: {
    width: 72,
    height: 72,
    marginBottom: 8,
    borderRadius: 8,
  },
  teamName: {
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.text.primary,
    fontSize: 16,
    textAlign: 'center',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
  },
  scoreText: {
    fontFamily: 'Inter-Bold',
    color: theme.colors.text.primary,
    fontSize: 32,
    marginHorizontal: 8,
  },
  gameTime: {
    backgroundColor: theme.colors.gray[100],
    padding: 8,
    alignItems: 'center',
  },
  periodText: {
    fontFamily: 'Inter-Medium',
    color: theme.colors.text.secondary,
    fontSize: 14,
  },
  infoContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    color: theme.colors.text.secondary,
    fontSize: 14,
  },
  finalResultText: {
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.text.primary,
    fontSize: 16,
    textAlign: 'center',
  },
  statsContainer: {
    backgroundColor: 'white',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
  },
  statsTitle: {
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.text.primary,
    fontSize: 18,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statValueLeft: {
    width: '25%',
    alignItems: 'center',
  },
  statName: {
    width: '50%',
    alignItems: 'center',
  },
  statValueRight: {
    width: '25%',
    alignItems: 'center',
  },
  statNameText: {
    fontFamily: 'Inter-Regular',
    color: theme.colors.text.secondary,
    fontSize: 14,
  },
  statValueText: {
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.text.primary,
    fontSize: 16,
  },
  noStatsText: {
    fontFamily: 'Inter-Regular',
    color: theme.colors.text.secondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
  },
  updateScoreButton: {
    backgroundColor: theme.colors.primary[600],
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    margin: 16,
  },
  updateScoreText: {
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    fontSize: 16,
  },
  backButtonText: {
    fontFamily: 'Inter-Medium',
    color: theme.colors.primary[600],
    fontSize: 16,
  },
});