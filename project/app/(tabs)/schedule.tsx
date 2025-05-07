import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, SafeAreaView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react-native';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import { theme } from '@/constants/theme';
import { fetchGamesByDate } from '@/services/api';
import { Game } from '@/types';
import GameCard from '@/components/GameCard';

export default function ScheduleScreen() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [games, setGames] = useState<Game[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  
  // Generate 14 days from today for the date picker
  const dates = Array.from({ length: 14 }, (_, i) => addDays(currentDate, i));

  useEffect(() => {
    loadGames();
  }, [selectedDate]);

  const loadGames = async () => {
    try {
      const games = await fetchGamesByDate(selectedDate);
      setGames(games);
    } catch (error) {
      console.error('Failed to load games:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGames();
    setRefreshing(false);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = direction === 'prev' 
      ? subDays(selectedDate, 1) 
      : addDays(selectedDate, 1);
    setSelectedDate(newDate);
  };

  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };

  const formatDateHeader = (date: Date) => {
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Schedule</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.calendarContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={dates}
          keyExtractor={(item) => item.toISOString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.dateItem,
                isSameDay(item, selectedDate) && styles.selectedDateItem
              ]}
              onPress={() => setSelectedDate(item)}
            >
              <Text
                style={[
                  styles.dayName,
                  isSameDay(item, selectedDate) && styles.selectedDateText
                ]}
              >
                {format(item, 'EEE')}
              </Text>
              <Text
                style={[
                  styles.dayNumber,
                  isSameDay(item, selectedDate) && styles.selectedDateText
                ]}
              >
                {format(item, 'd')}
              </Text>
              {isToday(item) && <View style={styles.todayIndicator} />}
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.datesListContent}
        />
      </View>

      <View style={styles.dateNavigation}>
        <TouchableOpacity 
          style={styles.dateNavButton}
          onPress={() => navigateDate('prev')}
        >
          <ChevronLeft size={20} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.currentDateText}>
          {formatDateHeader(selectedDate)}
        </Text>
        <TouchableOpacity 
          style={styles.dateNavButton}
          onPress={() => navigateDate('next')}
        >
          <ChevronRight size={20} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={games}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <GameCard
            game={item}
            onPress={() => router.push({
              pathname: '/game/[id]',
              params: { id: item.id }
            })}
            style={styles.gameCard}
            showTime
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
            <Text style={styles.emptyText}>No games scheduled for this date</Text>
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
  calendarContainer: {
    backgroundColor: 'white',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
  },
  datesListContent: {
    paddingHorizontal: 8,
  },
  dateItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 64,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: theme.colors.gray[100],
  },
  selectedDateItem: {
    backgroundColor: theme.colors.primary[600],
  },
  dayName: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
  dayNumber: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.colors.text.primary,
  },
  selectedDateText: {
    color: 'white',
  },
  todayIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.error[500],
    marginTop: 4,
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
  },
  dateNavButton: {
    padding: 8,
  },
  currentDateText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  listContent: {
    padding: 16,
  },
  gameCard: {
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