import Menu from '@/components/menu';
import { Book, booksService } from '@/services/books';
import {
  PlatformStatistics,
  platformStatisticsService,
} from '@/services/platform-statistics';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [stats, setStats] = useState<PlatformStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHomeData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [booksResponse, statsResponse] = await Promise.all([
        booksService.getBooks(1, 6),
        platformStatisticsService.getStatistics(),
      ]);
      setRecentBooks(booksResponse.data || []);
      setStats(statsResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load home data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  const sortedRecentBooks = useMemo(() => {
    return [...recentBooks].sort((a, b) => {
      if (a.created_at && b.created_at) {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return b.id - a.id;
    });
  }, [recentBooks]);

  return (
    <View style={styles.container}>
      <Menu title="Home" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
      <View style={styles.titleContainer}>
        <Text style={styles.appTitle}>My Bookshelf</Text>
      </View>

      <View style={styles.mainTitleContainer}>
        <Text style={styles.mainTitle}>Your bookshelf.</Text>
        <Text style={styles.mainSubTitle}>Your story.</Text>
      </View>

      <View style={styles.homeBannerContainer}>
        <Image
          source={require('@/assets/images/bannerhome.png')}
          style={styles.homeBannerBackground}
          contentFit="cover"
        />
        <View style={styles.homeBannerTextContainer}>
          <Text style={styles.bannerText}>
            Organize, track, and remember all the books you have read throughout the
            years.
          </Text>
        </View>
      </View>

      <View style={styles.callToActionContainer}>
        <Pressable style={styles.buttonPrimary}>
          <Text style={styles.buttonPrimaryText}>Add book</Text>
        </Pressable>
        <Pressable
          style={styles.buttonSecondary}
          onPress={() => router.push('/(tabs)/library')}
        >
          <Text style={styles.buttonSecondaryText}>My library</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#5d4037" />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={fetchHomeData}>
            <Text style={styles.retryButtonText}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recently Added</Text>
              <Pressable onPress={() => router.push('/(tabs)/library')}>
                <Text style={styles.sectionAction}>See all</Text>
              </Pressable>
            </View>
            <FlatList
              data={sortedRecentBooks}
              horizontal
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentList}
              renderItem={({ item }) => {
                const imageUrl = item.box_cover_url || item.cover_image_url;
                return (
                  <Pressable
                    style={styles.recentBookCard}
                    onPress={() =>
                      router.push({ pathname: '/book/[id]', params: { id: item.id } })
                    }
                  >
                    {imageUrl ? (
                      <Image
                        source={{ uri: imageUrl }}
                        style={styles.recentCover}
                        contentFit="cover"
                      />
                    ) : (
                      <View style={[styles.recentCover, styles.placeholderCover]}>
                        <Text style={styles.placeholderText}>No cover</Text>
                      </View>
                    )}
                    <Text style={styles.recentTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text style={styles.recentAuthor} numberOfLines={1}>
                      {item.author?.name || 'Unknown Author'}
                    </Text>
                  </Pressable>
                );
              }}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reading stats</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats?.total_books || 0}</Text>
                <Text style={styles.statLabel}>Books read</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {stats?.total_pages?.toLocaleString() || 0}
                </Text>
                <Text style={styles.statLabel}>Pages read</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>❤</Text>
                <Text style={styles.statLabel}>
                  {stats?.most_read_author?.name || 'Most read author'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
            </View>
            <View style={styles.activityContainer}>
              {stats?.recent_activities && stats.recent_activities.length > 0 ? (
                stats.recent_activities.slice(0, 4).map((activity) => (
                  <View key={activity.id} style={styles.activityItem}>
                    <View style={styles.activityIcon}>
                      <Text style={styles.activityIconText}>📚</Text>
                    </View>
                    <View style={styles.activityTextContainer}>
                      <Text style={styles.activityText} numberOfLines={2}>
                        {activity.user_name} {activity.action.toLowerCase()} "
                        {activity.book_title}"
                      </Text>
                      <Text style={styles.activityDate}>{activity.date}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No recent activity</Text>
              )}
            </View>
          </View>
        </>
      )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f1f0',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  appTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6d4c41',
  },
  mainTitleContainer: {
    padding: 16,
    gap: 8,
    marginBottom: 8,
    color: '#fff',
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5d4037',
  },
  mainSubTitle: {
    fontSize: 20,
    color: '#8d6e63',
  },
  homeBannerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 160,
    backgroundColor: '#f0e6e2',
    marginHorizontal: 16,
    borderRadius: 16,
  },
  homeBannerBackground: {
    position: 'absolute',
    top: 0,
    left: '20%',
    width: '100%',
    height: '100%',
    zIndex: 0,
    resizeMode: 'cover',
    opacity: 0.3,
  },
  homeBannerTextContainer: {
    zIndex: 1,
    maxWidth: '70%',
  },
  bannerText: {
    fontSize: 14,
    color: '#5d4037',
    lineHeight: 20,
  },
  buttonPrimary: {
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 12,
    backgroundColor: '#5d4037',
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondary: {
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#5d4037',
    backgroundColor: 'transparent',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondaryText: {
    color: '#5d4037',
    fontSize: 16,
    fontWeight: '600',
  },
  callToActionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingHorizontal: 8,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5d4037',
  },
  sectionAction: {
    fontSize: 13,
    color: '#8d6e63',
  },
  recentList: {
    gap: 16,
  },
  recentBookCard: {
    width: 120,
  },
  recentCover: {
    width: 120,
    height: 170,
    borderRadius: 12,
    backgroundColor: '#e0d6d3',
    marginBottom: 8,
  },
  placeholderCover: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: '#a1887f',
  },
  recentTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4e342e',
  },
  recentAuthor: {
    fontSize: 11,
    color: '#7b5e57',
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e6dcd8',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#5d4037',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 11,
    textAlign: 'center',
    color: '#8d6e63',
  },
  activityContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e6dcd8',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f2ece9',
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e8dcd6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityIconText: {
    fontSize: 16,
  },
  activityTextContainer: {
    flex: 1,
  },
  activityText: {
    fontSize: 13,
    color: '#4e342e',
  },
  activityDate: {
    fontSize: 11,
    color: '#9c857f',
    marginTop: 4,
  },
  centerContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#5d4037',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 13,
    color: '#9c857f',
    textAlign: 'center',
  },
});
