import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, SafeAreaView, RefreshControl, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Search, Zap } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { fetchUpcomingGames, fetchLiveGames, fetchFeaturedLeagues } from '@/services/api';
import { Game, League } from '@/types';
import GameCard from '@/components/GameCard';
import ScoreCard from '@/components/ScoreCard';
import LeagueCard from '@/components/LeagueCard';
import { useAuth } from '@/context/AuthContext';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [upcomingGames, setUpcomingGames] = useState<Game[]>([]);
  const [liveGames, setLiveGames] = useState<Game[]>([]);
  const [featuredLeagues, setFeaturedLeagues] = useState<League[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const upcoming = await fetchUpcomingGames();
      const live = await fetchLiveGames();
      const leagues = await fetchFeaturedLeagues();
      
      setUpcomingGames(upcoming);
      setLiveGames(live);
      setFeaturedLeagues(leagues);
    } catch (error) {
      console.error('Failed to load data:', error);
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
        <View style={styles.headerTop}>
          <View style={styles.userInfo}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }} 
              style={styles.userAvatar} 
            />
            <View>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.userName}>{user?.name || 'Guest'}</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Bell size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Search size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FlatList
        data={[]} // Just a dummy item to enable the FlatList
        renderItem={null}
        ListHeaderComponent={
          <>
            {liveGames.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionHeaderLeft}>
                    <Zap size={20} color={theme.colors.error[500]} />
                    <Text style={styles.sectionTitle}>Live Now</Text>
                  </View>
                  <TouchableOpacity onPress={() => router.push('/scores')}>
                    <Text style={styles.seeAllText}>See All</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={liveGames}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <ScoreCard 
                      game={item} 
                      onPress={() => router.push({
                        pathname: '/game/[id]',
                        params: { id: item.id }
                      })} 
                      live
                    />
                  )}
                  contentContainerStyle={styles.horizontalListContent}
                />
              </View>
            )}

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Upcoming Games</Text>
                <TouchableOpacity onPress={() => router.push('/schedule')}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={upcomingGames}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <GameCard 
                    game={item} 
                    onPress={() => router.push({
                      pathname: '/game/[id]',
                      params: { id: item.id }
                    })} 
                  />
                )}
                contentContainerStyle={styles.horizontalListContent}
              />
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Your Leagues</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={featuredLeagues}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <LeagueCard 
                    league={item} 
                    onPress={() => router.push({
                      pathname: '/league/[id]',
                      params: { id: item.id }
                    })} 
                  />
                )}
                contentContainerStyle={styles.horizontalListContent}
              />
            </View>
          </>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary[600]]}
            tintColor={theme.colors.primary[600]}
          />
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  welcomeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  userName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  headerActions: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.colors.text.primary,
    marginLeft: 4,
  },
  seeAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.primary[600],
  },
  horizontalListContent: {
    paddingHorizontal: 12,
  },
});