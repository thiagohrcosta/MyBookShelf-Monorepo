import Menu from '@/components/menu';
import { myLibrary } from '@/services/my-labrary';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type BookListStatus = 'acquired' | 'reading' | 'finished' | 'abandoned' | 'wishlist';
type StatusFilter = 'all' | BookListStatus;

interface LibraryAuthor {
  name: string;
}

interface LibraryBook {
  id: number;
  title: string;
  release_year?: number;
  publication_year?: number;
  box_cover_url?: string;
  cover_image_url?: string;
  author?: LibraryAuthor;
}

interface LibraryBookListItem {
  id: number;
  status: BookListStatus;
  book: LibraryBook;
}

const STATUS_FILTERS: Array<{ label: string; value: StatusFilter }> = [
  { label: 'All', value: 'all' },
  { label: 'Acquired', value: 'acquired' },
  { label: 'Reading', value: 'reading' },
  { label: 'Finished', value: 'finished' },
  { label: 'Abandoned', value: 'abandoned' },
  { label: 'Wishlist', value: 'wishlist' },
];

const STATUS_BADGE_COLORS: Record<BookListStatus, { background: string; text: string }> = {
  acquired: { background: '#efe5df', text: '#5d4037' },
  reading: { background: '#dfebe6', text: '#3f6b5a' },
  finished: { background: '#e2e9f3', text: '#405c82' },
  abandoned: { background: '#f6e1df', text: '#8c3f35' },
  wishlist: { background: '#efe7f5', text: '#644b7b' },
};

export default function MyLibraryScreen() {
  const router = useRouter();
  const [libraryItems, setLibraryItems] = useState<LibraryBookListItem[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('all');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyLibrary = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await myLibrary.getMyLibrary(1);
      const data = Array.isArray(response.data) ? response.data : [];
      setLibraryItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load your library');
      setLibraryItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyLibrary();
  }, [fetchMyLibrary]);

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return libraryItems.filter((item) => {
      let matchesStatus = false;
      if (selectedStatus === 'all') {
        matchesStatus = true;
      } else if (selectedStatus === 'acquired') {
        matchesStatus = item.status !== 'wishlist';
      } else {
        matchesStatus = item.status === selectedStatus;
      }

      const title = item.book?.title?.toLowerCase() || '';
      const authorName = item.book?.author?.name?.toLowerCase() || '';
      const matchesSearch =
        normalizedSearch.length === 0 ||
        title.includes(normalizedSearch) ||
        authorName.includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [libraryItems, searchText, selectedStatus]);

  const renderBook = ({ item }: { item: LibraryBookListItem }) => {
    const imageUrl = item.book.box_cover_url || item.book.cover_image_url;
    const badgeColors = STATUS_BADGE_COLORS[item.status];

    return (
      <Pressable
        style={styles.bookItem}
        onPress={() => router.push({ pathname: '/book/[id]', params: { id: item.book.id } })}
      >
        <View style={styles.coverContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.bookCover} contentFit="cover" />
          ) : (
            <View style={[styles.bookCover, styles.placeholderCover]}>
              <Text style={styles.placeholderText}>No image</Text>
            </View>
          )}
        </View>

        <Text style={styles.bookTitle} numberOfLines={2}>
          {item.book.title}
        </Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>
          {item.book.author?.name || 'Unknown author'}
        </Text>
        <Text style={styles.bookYear}>{item.book.release_year || item.book.publication_year || '—'}</Text>
        <View style={[styles.statusBadge, { backgroundColor: badgeColors.background }]}>
          <Text style={[styles.statusBadgeText, { color: badgeColors.text }]}>
            {item.status}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Menu title="My Library" showSearch={false} />

      <View style={styles.searchBarContainer}>
        <Text style={styles.searchIcon}>
          <Ionicons name="search" size={16} color="#999" />
        </Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search my books..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <View style={styles.tabsContainer}>
        {STATUS_FILTERS.map((filter) => (
          <Pressable
            key={filter.value}
            style={[styles.tab, selectedStatus === filter.value && styles.tabActive]}
            onPress={() => setSelectedStatus(filter.value)}
          >
            <Text style={[styles.tabText, selectedStatus === filter.value && styles.tabTextActive]}>
              {filter.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#5d4037" />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={fetchMyLibrary}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      ) : filteredItems.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No books found for this filter.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderBook}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f1f0',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#e8e0df',
    borderRadius: 20,
    height: 40,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#999',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    paddingVertical: 0,
  },
  tabsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#e8e0df',
  },
  tabActive: {
    backgroundColor: '#d7ccc8',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#5d4037',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  bookItem: {
    width: '31%',
  },
  coverContainer: {
    width: '100%',
    aspectRatio: 0.68,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#e8e0df',
    marginBottom: 8,
  },
  bookCover: {
    width: '100%',
    height: '100%',
  },
  placeholderCover: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: '#999',
  },
  bookTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2c2c2c',
    marginBottom: 2,
  },
  bookAuthor: {
    fontSize: 12,
    color: '#5d4037',
    marginBottom: 2,
  },
  bookYear: {
    fontSize: 12,
    color: '#7d7d7d',
    marginBottom: 6,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    color: '#7d7d7d',
    fontSize: 15,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#5d4037',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
