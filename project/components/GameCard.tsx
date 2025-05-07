import { StyleSheet, View, Text, TouchableOpacity, Image, ViewStyle } from 'react-native';
import { format } from 'date-fns';
import { MapPin, Calendar, Clock } from 'lucide-react-native';
import { Game } from '@/types';
import { theme } from '@/constants/theme';

type GameCardProps = {
  game: Game;
  onPress: () => void;
  style?: ViewStyle;
  showTime?: boolean;
};

export default function GameCard({ game, onPress, style, showTime = false }: GameCardProps) {
  const formattedDate = format(new Date(game.scheduledAt), 'MMM d');
  const formattedTime = format(new Date(game.scheduledAt), 'h:mm a');

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={onPress}
    >
      <View style={styles.header}>
        <Text style={styles.leagueName}>{game.league.name}</Text>
      </View>
      
      <View style={styles.teamsContainer}>
        <View style={styles.teamContainer}>
          <Image 
            source={{ uri: game.homeTeam.logo }} 
            style={styles.teamLogo} 
          />
          <Text style={styles.teamName}>{game.homeTeam.name}</Text>
        </View>
        
        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>vs</Text>
        </View>
        
        <View style={styles.teamContainer}>
          <Image 
            source={{ uri: game.awayTeam.logo }} 
            style={styles.teamLogo} 
          />
          <Text style={styles.teamName}>{game.awayTeam.name}</Text>
        </View>
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Calendar size={14} color={theme.colors.text.secondary} style={styles.detailIcon} />
          <Text style={styles.detailText}>{formattedDate}</Text>
        </View>
        
        {showTime && (
          <View style={styles.detailItem}>
            <Clock size={14} color={theme.colors.text.secondary} style={styles.detailIcon} />
            <Text style={styles.detailText}>{formattedTime}</Text>
          </View>
        )}
        
        <View style={styles.detailItem}>
          <MapPin size={14} color={theme.colors.text.secondary} style={styles.detailIcon} />
          <Text style={styles.detailText}>{game.venue}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
    width: 280,
  },
  header: {
    marginBottom: 12,
  },
  leagueName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  teamContainer: {
    alignItems: 'center',
    width: '40%',
  },
  teamLogo: {
    width: 56,
    height: 56,
    marginBottom: 8,
    borderRadius: 28,
  },
  teamName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  vsContainer: {
    width: '20%',
    alignItems: 'center',
  },
  vsText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200],
    paddingTop: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailIcon: {
    marginRight: 6,
  },
  detailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: theme.colors.text.secondary,
  },
});