import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, SafeAreaView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronDown } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { fetchLeagues, fetchStandings } from '@/services/api';
import { League, TeamStanding } from '@/types';

export default function StandingsScreen() {
  const router = useRouter();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showLeagueDropdown, setShowLeagueDropdown] = useState(false);

  useEffect(() => {
    loadLeagues();
  }, []);

  useEffect(() => {
    if (selectedLeague) {
      loadStandings(selectedLeague.id);
    }
  }, [selectedLeague]);

  const loadLeagues = async () => {
    try {
      const fetchedLeagues = await fetchLeagues();
      setLeagues(fetchedLeagues);
      
      if (fetchedLeagues.length > 0 && !selectedLeague) {
        setSelectedLeague(fetchedLeagues[0]);
      }
    } catch (error) {
      console.error('Failed to load leagues:', error);
    }
  };

  const loadStandings = async (leagueId: number) => {
    try {
      const fetchedStandings = await fetchStandings(leagueId);
      setStandings(fetchedStandings);
    } catch (error) {
      console.error('Failed to load standings:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (selectedLeague) {
      await loadStandings(selectedLeague.id);
    }
    setRefreshing(false);
  };

  const toggleLeagueDropdown = () => {
    setShowLeagueDropdown(!showLeagueDropdown);
  };

  const selectLeague = (league: League) => {
    setSelectedLeague(league);
    setShowLeagueDropdown(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Standings</Text>
      </View>

      <View style={styles.leagueSelector}>
        <TouchableOpacity 
          style={styles.leagueDropdown}
          onPress={toggleLeagueDropdown}
        >
          <Text style={styles.leagueName}>{selectedLeague?.name || 'Select League'}</Text>
          <ChevronDown size={20} color={theme.colors.text.primary} />
        </TouchableOpacity>

        {showLeagueDropdown && (
          <View style={styles.dropdown}>
            {leagues.map((league) => (
              <TouchableOpacity
                key={league.id}
                style={styles.dropdownItem}
                onPress={() => selectLeague(league)}
              >
                <Text 
                  style={[
                    styles.dropdownItemText,
                    selectedLeague?.id === league.id && styles.selectedLeagueText
                  ]}
                >
                  {league.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, styles.rankColumn]}>#</Text>
        <Text style={[styles.tableHeaderText, styles.teamColumn]}>Team</Text>
        <Text style={[styles.tableHeaderText, styles.statColumn]}>P</Text>
        <Text style={[styles.tableHeaderText, styles.statColumn]}>W</Text>
        <Text style={[styles.tableHeaderText, styles.statColumn]}>L</Text>
        <Text style={[styles.tableHeaderText, styles.statColumn]}>PTS</Text>
      </View>

      <FlatList
        data={standings}
        keyExtractor={(item) => item.teamId.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity 
            style={styles.tableRow}
            onPress={() => router.push({
              pathname: '/team/[id]',
              params: { id: item.teamId }
            })}
          >
            <Text style={[styles.tableText, styles.rankColumn, styles.rankText]}>
              {index + 1}
            </Text>
            <Text style={[styles.tableText, styles.teamColumn, styles.teamName]}>
              {item.teamName}
            </Text>
            <Text style={[styles.tableText, styles.statColumn]}>
              {item.played}
            </Text>
            <Text style={[styles.tableText, styles.statColumn]}>
              {item.won}
            </Text>
            <Text style={[styles.tableText, styles.statColumn]}>
              {item.lost}
            </Text>
            <Text style={[styles.tableText, styles.statColumn, styles.pointsText]}>
              {item.points}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.tableContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary[600]]}
            tintColor={theme.colors.primary[600]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No standings available</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: theme.colors.text.primary,
  },
  leagueSelector: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
    zIndex: 10,
  },
  leagueDropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: theme.colors.gray[300],
    borderRadius: 8,
  },
  leagueName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  dropdown: {
    position: 'absolute',
    top: 70,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: theme.colors.gray[300],
    borderRadius: 8,
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
  },
  dropdownItemText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  selectedLeagueText: {
    color: theme.colors.primary[600],
    fontFamily: 'Inter-SemiBold',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.gray[100],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[300],
  },
  tableHeaderText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
  },
  tableText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.text.primary,
  },
  rankColumn: {
    width: '10%',
  },
  teamColumn: {
    width: '40%',
  },
  statColumn: {
    width: '12.5%',
    textAlign: 'center',
  },
  rankText: {
    fontFamily: 'Inter-SemiBold',
  },
  teamName: {
    fontFamily: 'Inter-Medium',
  },
  pointsText: {
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.primary[600],
  },
  tableContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});