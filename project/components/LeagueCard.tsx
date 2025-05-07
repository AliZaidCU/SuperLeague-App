import { StyleSheet, View, Text, TouchableOpacity, Image, ViewStyle } from 'react-native';
import { League } from '@/types';
import { theme } from '@/constants/theme';

type LeagueCardProps = {
  league: League;
  onPress: () => void;
  style?: ViewStyle;
};

export default function LeagueCard({ league, onPress, style }: LeagueCardProps) {
  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={onPress}
    >
      <Image 
        source={{ uri: league.logo }} 
        style={styles.leagueLogo} 
      />
      <Text style={styles.leagueName}>{league.name}</Text>
      <Text style={styles.leagueTeams}>{league.teamCount} Teams</Text>
      <View style={styles.leagueTagContainer}>
        <View style={styles.leagueTag}>
          <Text style={styles.leagueTagText}>{league.sport}</Text>
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
    width: 160,
    alignItems: 'center',
  },
  leagueLogo: {
    width: 80,
    height: 80,
    marginBottom: 12,
    borderRadius: 40,
  },
  leagueName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  leagueTeams: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: 12,
  },
  leagueTagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  leagueTag: {
    backgroundColor: theme.colors.primary[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginHorizontal: 4,
    marginBottom: 4,
  },
  leagueTagText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: theme.colors.primary[600],
  },
});