import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, SafeAreaView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Filter, Zap } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { fetchLiveGames, fetchRecentGames } from '@/services/api';
import { Game } from '@/types';
import ScoreCard from '@/components/ScoreCard';

export default function ScoresScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('live');
  const [liveGames, setLiveGames] = useState<Game[]>([]);
  const [recentGames, setRecentGames] = useState<Game[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      if (activeTab === 'live') {
        const games = await fetchLiveGames();
        setLiveGames(games);
      } else {
        const games = await fetchRecentGames();
        setRecentGames(games);
      }
    } catch (error) {
      console.error('Failed to load games:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Scores</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'live' && styles.activeTab]}
          onPress={() => setActiveTab('live')}
        >
          <View style={styles.tabContent}>
            {activeTab === 'live' && <Zap size={16} color={theme.colors.error[500]} style={styles.liveIcon} />}
            <Text
              style={[
                styles.tabText,
                activeTab === 'live' && styles.activeTabText
              ]}
            >
              Live
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'recent' && styles.activeTab]}
          onPress={() => setActiveTab('recent')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'recent' && styles.activeTabText
            ]}
          >
            Recent
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeTab === 'live' ? liveGames : recentGames}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ScoreCard
            game={item}
            onPress={() => router.push({
              pathname: '/game/[id]',
              params: { id: item.id }
            })}
            live={activeTab === 'live'}
            style={styles.scoreCard}
          />
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
            <Text style={styles.emptyText}>
              {activeTab === 'live' 
                ? 'No live games at the moment' 
                : 'No recent games to display'}
            </Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  filterButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
  },
  tab: {
    paddingVertical: 12,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: theme.colors.primary[600],
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveIcon: {
    marginRight: 4,
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: theme.colors.text.secondary,
  },
  activeTabText: {
    color: theme.colors.primary[600],
    fontFamily: 'Inter-SemiBold',
  },
  listContent: {
    padding: 16,
  },
  scoreCard: {
    marginBottom: 12,
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