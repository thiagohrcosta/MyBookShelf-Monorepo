import Menu from '@/components/menu';
import {
  BookInYear,
  MonthData,
  userStatisticsService,
  UserStatistics,
} from '@/services/user-statistics';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ComponentProps, useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const MONTH_LABELS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_LABELS_FULL = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

interface SummaryCardProps {
  iconName: ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  iconBackgroundColor: string;
  label: string;
  value: string | number;
}

function SummaryCard({ iconName, iconColor, iconBackgroundColor, label, value }: SummaryCardProps) {
  return (
    <View style={styles.summaryCard}>
      <View style={[styles.summaryIconContainer, { backgroundColor: iconBackgroundColor }]}>
        <Ionicons name={iconName} size={16} color={iconColor} />
      </View>
      <View style={styles.summaryTextContainer}>
        <Text style={styles.summaryLabel}>{label}</Text>
        <Text style={styles.summaryValue}>{value}</Text>
      </View>
    </View>
  );
}

interface MonthChartProps {
  data: MonthData[];
}

function MonthChart({ data }: MonthChartProps) {
  const maxCount = useMemo(() => Math.max(...data.map((month) => month.count), 1), [data]);

  return (
    <View style={styles.chartBarsRow}>
      {data.map((monthData) => {
        const height = monthData.count > 0 ? Math.max((monthData.count / maxCount) * 100, 12) : 0;

        return (
          <View key={monthData.month} style={styles.chartColumn}>
            <View style={styles.barContainer}>
              {monthData.count > 0 ? <Text style={styles.barValue}>{monthData.count}</Text> : null}
              <View style={[styles.chartBar, { height: `${height}%` }]} />
            </View>
            <Text style={styles.barMonthLabel}>{MONTH_LABELS_SHORT[monthData.month - 1]}</Text>
          </View>
        );
      })}
    </View>
  );
}

interface BookListItemProps {
  book: BookInYear;
  onPress: () => void;
}

function BookListItem({ book, onPress }: BookListItemProps) {
  return (
    <Pressable style={styles.bookRow} onPress={onPress}>
      <View style={styles.bookCoverContainer}>
        {book.box_cover_url ? (
          <Image source={{ uri: book.box_cover_url }} style={styles.bookCoverImage} contentFit="cover" />
        ) : (
          <View style={[styles.bookCoverImage, styles.bookCoverPlaceholder]}>
            <Ionicons name="book-outline" size={18} color="#a1887f" />
          </View>
        )}
      </View>

      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={1}>
          {book.title}
        </Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>
          {book.author}
        </Text>
        <Text style={styles.bookPages}>{book.pages} pages</Text>
      </View>

      <View style={styles.monthBadge}>
        <Ionicons name="calendar-outline" size={12} color="#8f4f16" />
        <Text style={styles.monthBadgeText}>{MONTH_LABELS_FULL[book.month - 1]}</Text>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const [dashboardData, setDashboardData] = useState<UserStatistics | null>(null);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async (year: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await userStatisticsService.getStatistics(year);
      setDashboardData(response);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Unable to load statistics.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData(selectedYear);
  }, [fetchDashboardData, selectedYear]);

  const hasPreviousYear = useMemo(() => {
    if (!dashboardData?.available_years?.length) {
      return selectedYear > 2000;
    }

    return selectedYear > Math.min(...dashboardData.available_years);
  }, [dashboardData?.available_years, selectedYear]);

  const hasNextYear = selectedYear < currentYear;

  const handleSelectPreviousYear = () => {
    if (hasPreviousYear) {
      setSelectedYear((year) => year - 1);
    }
  };

  const handleSelectNextYear = () => {
    if (hasNextYear) {
      setSelectedYear((year) => year + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Menu title="Dashboard" />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.heading}>Reading Statistics</Text>
          <Text style={styles.subHeading}>Track your reading journey over time</Text>
        </View>

        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#5d4037" />
          </View>
        ) : error || !dashboardData ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error || 'No data available'}</Text>
            <Pressable style={styles.retryButton} onPress={() => fetchDashboardData(selectedYear)}>
              <Text style={styles.retryButtonText}>Try again</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.summaryList}>
              <SummaryCard
                iconName="book-outline"
                iconColor="#8f4f16"
                iconBackgroundColor="#fef3e8"
                label="Total Books Read"
                value={dashboardData.total_books}
              />
              <SummaryCard
                iconName="calendar-outline"
                iconColor="#1e3a8a"
                iconBackgroundColor="#eaf2ff"
                label="Books This Year"
                value={dashboardData.books_this_year}
              />
              <SummaryCard
                iconName="document-text-outline"
                iconColor="#14532d"
                iconBackgroundColor="#eaf9ef"
                label="Total Pages"
                value={dashboardData.total_pages.toLocaleString()}
              />
            </View>

            <View style={styles.cardSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Books Read in {selectedYear}</Text>
                <View style={styles.yearSelector}>
                  <Pressable
                    style={[styles.yearButton, !hasPreviousYear && styles.yearButtonDisabled]}
                    onPress={handleSelectPreviousYear}
                    disabled={!hasPreviousYear}
                  >
                    <Ionicons name="chevron-back" size={18} color={hasPreviousYear ? '#6b4f43' : '#c2b2ab'} />
                  </Pressable>
                  <Text style={styles.yearText}>{selectedYear}</Text>
                  <Pressable
                    style={[styles.yearButton, !hasNextYear && styles.yearButtonDisabled]}
                    onPress={handleSelectNextYear}
                    disabled={!hasNextYear}
                  >
                    <Ionicons name="chevron-forward" size={18} color={hasNextYear ? '#6b4f43' : '#c2b2ab'} />
                  </Pressable>
                </View>
              </View>

              <Text style={styles.chartLegend}>Books per Month</Text>
              <MonthChart data={dashboardData.books_per_month} />
            </View>

            <View style={styles.cardSection}>
              <Text style={styles.sectionTitle}>
                Books Read in {selectedYear} ({dashboardData.books_in_year.length})
              </Text>

              {dashboardData.books_in_year.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="book-outline" size={28} color="#c4ada1" />
                  <Text style={styles.emptyStateText}>No books read in {selectedYear} yet.</Text>
                </View>
              ) : (
                <View style={styles.bookList}>
                  {dashboardData.books_in_year.map((book) => (
                    <BookListItem
                      key={`${book.id}-${book.month}`}
                      book={book}
                      onPress={() => router.push({ pathname: '/book/[id]', params: { id: book.id } })}
                    />
                  ))}
                </View>
              )}
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
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  header: {
    marginTop: 20,
    marginBottom: 14,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2f1d16',
  },
  subHeading: {
    marginTop: 6,
    color: '#7b665d',
    fontSize: 13,
  },
  summaryList: {
    gap: 10,
    marginBottom: 14,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e6dcd8',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  summaryIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  summaryTextContainer: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#7b665d',
  },
  summaryValue: {
    marginTop: 2,
    fontSize: 26,
    fontWeight: '700',
    color: '#2f1d16',
  },
  cardSection: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e6dcd8',
    padding: 14,
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '600',
    color: '#2f1d16',
  },
  yearSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  yearButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f3ece8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  yearButtonDisabled: {
    backgroundColor: '#f8f5f4',
  },
  yearText: {
    minWidth: 48,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: '#4b2f26',
  },
  chartLegend: {
    marginBottom: 8,
    fontSize: 12,
    color: '#7b665d',
  },
  chartBarsRow: {
    minHeight: 170,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 4,
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
  },
  barContainer: {
    height: 130,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  chartBar: {
    width: '86%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: '#9a4f15',
    minHeight: 0,
  },
  barValue: {
    marginBottom: 4,
    fontSize: 10,
    color: '#4b2f26',
    fontWeight: '600',
  },
  barMonthLabel: {
    marginTop: 8,
    fontSize: 10,
    color: '#73615a',
  },
  bookList: {
    marginTop: 8,
    gap: 8,
  },
  bookRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  bookCoverContainer: {
    marginRight: 10,
  },
  bookCoverImage: {
    width: 42,
    height: 62,
    borderRadius: 6,
    backgroundColor: '#ede4df',
  },
  bookCoverPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    color: '#2f1d16',
    fontSize: 14,
    fontWeight: '600',
  },
  bookAuthor: {
    marginTop: 2,
    color: '#6f5a52',
    fontSize: 12,
  },
  bookPages: {
    marginTop: 2,
    color: '#98837a',
    fontSize: 11,
  },
  monthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fdf5e9',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  monthBadgeText: {
    fontSize: 10,
    color: '#8f4f16',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    gap: 6,
  },
  emptyStateText: {
    color: '#947b70',
    fontSize: 13,
  },
  centerContainer: {
    paddingVertical: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#5d4037',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
});
