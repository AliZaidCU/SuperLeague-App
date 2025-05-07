import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, SafeAreaView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, ClipboardList } from 'lucide-react-native';
import { format } from 'date-fns';
import { theme } from '@/constants/theme';
import { fetchRefereeAssignments } from '@/services/api';
import { Game } from '@/types';
import { useAuth } from '@/context/AuthContext';

export default function RefereeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Game[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.role !== 'referee') {
      // Redirect non-referees
      router.replace('/(tabs)');
      return;
    }
    
    loadAssignments();
  }, [user]);

  const loadAssignments = async () => {
    try {
      const games = await fetchRefereeAssignments();
      setAssignments(games);
    } catch (error) {
      console.error('Failed to load referee assignments:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAssignments();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.replace('/(tabs)')}
        >
          <ChevronLeft size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Referee Dashboard</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{assignments.filter(g => g.status === 'scheduled').length}</Text>
          <Text style={styles.statLabel}>Upcoming</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{assignments.filter(g => g.status === 'live').length}</Text>
          <Text style={styles.statLabel}>Live</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{assignments.filter(g => g.status === 'completed').length}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>Your Assignments</Text>
      </View>

      <FlatList
        data={assignments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.gameItem}
            onPress={() => router.push({
              pathname: '/game/[id]',
              params: { id: item.id }
            })}
          >
            <View style={styles.gameItemHeader}>
              <Text style={styles.leagueName}>{item.league.name}</Text>
              <View style={[
                styles.statusIndicator, 
                item.status === 'live' && styles.liveIndicator,
                item.status === 'completed' && styles.completedIndicator
              ]}>
                <Text style={styles.statusText}>
                  {item.status === 'scheduled' ? 'Upcoming' : 
                   item.status === 'live' ? 'Live' : 'Completed'}
                </Text>
              </View>
            </View>
            
            <View style={styles.teamsRow}>
              <Text style={styles.teamName}>{item.homeTeam.name}</Text>
              <Text style={styles.vsText}>vs</Text>
              <Text style={styles.teamName}>{item.awayTeam.name}</Text>
            </View>
            
            <View style={styles.gameDetails}>
              <ClipboardList size={16} color={theme.colors.text.secondary} style={styles.detailIcon} />
              <Text style={styles.gameDetailText}>
                {format(new Date(item.scheduledAt), 'MMM d, yyyy • h:mm a')}
              </Text>
            </View>
            
            <View style={styles.venueRow}>
              <Text style={styles.venueText}>{item.venue}</Text>
            </View>
            
            {item.status === 'live' && (
              <View style={styles.actionRow}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => router.push({
                    pathname: '/game/[id]',
                    params: { id: item.id }
                  })}
                >
                  <Text style={styles.actionButtonText}>Update Score</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
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
            <Text style={styles.emptyText}>No assignments found</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: 'white',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: theme.colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
  },
  statCard: {
    backgroundColor: theme.colors.gray[100],
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    width: '30%',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: theme.colors.primary[600],
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  listHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.colors.text.primary,
  },
  listContent: {
    padding: 16,
  },
  gameItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
  },
  gameItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  leagueName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: theme.colors.gray[300],
  },
  liveIndicator: {
    backgroundColor: theme.colors.error[500],
  },
  completedIndicator: {
    backgroundColor: theme.colors.success[500],
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: 'white',
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.text.primary,
    flex: 1,
  },
  vsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginHorizontal: 8,
  },
  gameDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    marginRight: 8,
  },
  gameDetailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  venueRow: {
    marginBottom: 8,
  },
  venueText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionButton: {
    backgroundColor: theme.colors.primary[600],
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  actionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'white',
  },
  emptyContainer: {
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