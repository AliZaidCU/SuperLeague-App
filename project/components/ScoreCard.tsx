import { StyleSheet, View, Text, TouchableOpacity, Image, ViewStyle } from 'react-native';
import { format } from 'date-fns';
import { Zap } from 'lucide-react-native';
import { Game } from '@/types';
import { theme } from '@/constants/theme';

type ScoreCardProps = {
  game: Game;
  onPress: () => void;
  live?: boolean;
  style?: ViewStyle;
};

export default function ScoreCard({ game, onPress, live = false, style }: ScoreCardProps) {
  const isCompleted = game.status === 'completed';
  const formattedDate = format(new Date(game.scheduledAt), 'MMM d, yyyy');

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={onPress}
    >
      <View style={styles.header}>
        <Text style={styles.leagueName}>{game.league.name}</Text>
        {live && (
          <View style={styles.liveTag}>
            <Zap size={12} color="white" />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
      </View>

      <View style={styles.scoreContainer}>
        <View style={styles.teamContainer}>
          <Image 
            source={{ uri: game.homeTeam.logo }} 
            style={styles.teamLogo} 
          />
          <Text style={styles.teamName}>{game.homeTeam.name}</Text>
        </View>
        
        <View style={styles.scoreSection}>
          <Text style={styles.scoreText}>{game.homeScore}</Text>
          <Text style={styles.scoreSeparator}>-</Text>
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
      
      <View style={styles.footer}>
        {live ? (
          <Text style={styles.gameStatus}>
            {game.period} • {game.timeRemaining}
          </Text>
        ) : (
          <Text style={styles.gameStatus}>
            {isCompleted ? 'Final' : formattedDate}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  leagueName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  liveTag: {
    backgroundColor: theme.colors.error[500],
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  liveText: {
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  teamContainer: {
    alignItems: 'center',
    width: '35%',
  },
  teamLogo: {
    width: 48,
    height: 48,
    marginBottom: 8,
    borderRadius: 24,
  },
  teamName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  scoreSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
  },
  scoreText: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: theme.colors.text.primary,
  },
  scoreSeparator: {
    fontFamily: 'Inter-Regular',
    fontSize: 24,
    color: theme.colors.text.secondary,
    marginHorizontal: 4,
  },
  footer: {
    alignItems: 'center',
  },
  gameStatus: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
});