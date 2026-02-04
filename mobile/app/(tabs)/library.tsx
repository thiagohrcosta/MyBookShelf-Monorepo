import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { booksService, Book } from '@/services/books';

export default function LibraryScreen() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'reading' | 'finished'>('all');
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, [selectedTab]);

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await booksService.getBooks(
        1,
        12,
        searchText || undefined,
        selectedTab
      );
      setBooks(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err instanceof Error ? err.message : 'Failed to load books');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchBooks();
  };

  const handleMenuItemPress = (route: 'index' | 'library' | 'explore') => {
    setMenuOpen(false);
    // Navigate to the selected route
    if (route === 'index') {
      router.push('/');
    } else if (route === 'library') {
      router.push('/(tabs)/library');
    } else if (route === 'explore') {
      router.push('/(tabs)/explore');
    }
  };

  const renderBook = ({ item }: { item: Book }) => {
    const imageUrl = item.box_cover_url || item.cover_image_url;
    console.log('Book:', item.title, 'Image URL:', imageUrl);

    return (
      <Pressable style={styles.bookItem}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.bookCover}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
        ) : (
          <View style={[styles.bookCover, styles.placeholderCover]}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
        <Text style={styles.bookTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>
          {item.author?.name || 'Unknown Author'}
        </Text>
        <Text style={styles.bookYear}>{item.publication_year}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Menu Drawer */}
      {menuOpen && (
        <Pressable
          style={styles.menuOverlay}
          onPress={() => setMenuOpen(false)}
        >
          <View style={styles.menuDrawer}>
            <Pressable
              style={styles.menuCloseButton}
              onPress={() => setMenuOpen(false)}
            >
              <Text style={styles.menuCloseIcon}>✕</Text>
            </Pressable>

            <View style={styles.menuContent}>
              <Pressable
                style={styles.menuItem}
                onPress={() => handleMenuItemPress('index')}
              >
                <Text style={styles.menuItemIcon}>🏠</Text>
                <Text style={styles.menuItemText}>Home</Text>
              </Pressable>

              <Pressable
                style={styles.menuItem}
                onPress={() => handleMenuItemPress('library')}
              >
                <Text style={styles.menuItemIcon}>📚</Text>
                <Text style={styles.menuItemText}>Library</Text>
              </Pressable>

              <Pressable
                style={styles.menuItem}
                onPress={() => handleMenuItemPress('explore')}
              >
                <Text style={styles.menuItemIcon}>✈️</Text>
                <Text style={styles.menuItemText}>Explore</Text>
              </Pressable>

              <View style={styles.menuDivider} />

              <Pressable style={styles.menuItem}>
                <Text style={styles.menuItemIcon}>👤</Text>
                <Text style={styles.menuItemText}>Profile</Text>
              </Pressable>

              <Pressable style={styles.menuItem}>
                <Text style={styles.menuItemIcon}>⚙️</Text>
                <Text style={styles.menuItemText}>Settings</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      )}

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.menuButton}
          onPress={() => setMenuOpen(!menuOpen)}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Library</Text>
        <Pressable style={styles.searchButton}>
          <Text style={styles.searchIcon}>🔍</Text>
        </Pressable>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <Text style={styles.searchIconSmall}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search books..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <Pressable
          style={[styles.tab, selectedTab === 'all' && styles.tabActive]}
          onPress={() => setSelectedTab('all')}
        >
          <Text style={[styles.tabText, selectedTab === 'all' && styles.tabTextActive]}>
            All
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, selectedTab === 'reading' && styles.tabActive]}
          onPress={() => setSelectedTab('reading')}
        >
          <Text style={[styles.tabText, selectedTab === 'reading' && styles.tabTextActive]}>
            Reading
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, selectedTab === 'finished' && styles.tabActive]}
          onPress={() => setSelectedTab('finished')}
        >
          <Text style={[styles.tabText, selectedTab === 'finished' && styles.tabTextActive]}>
            Finished
          </Text>
        </Pressable>
        <Pressable style={styles.filterButton}>
          <Text style={styles.filterIcon}>☰</Text>
        </Pressable>
      </View>

      {/* Books Grid */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#5d4037" />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={fetchBooks}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      ) : books.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No books found</Text>
        </View>
      ) : (
        <FlatList
          data={books}
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
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  menuDrawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '75%',
    height: '100%',
    backgroundColor: '#fff',
    zIndex: 1001,
    paddingTop: 16,
  },
  menuCloseButton: {
    padding: 16,
    alignItems: 'flex-end',
  },
  menuCloseIcon: {
    fontSize: 24,
    color: '#5d4037',
    fontWeight: 'bold',
  },
  menuContent: {
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f1f0',
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 24,
    color: '#5d4037',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5d4037',
  },
  searchButton: {
    padding: 8,
  },
  searchIcon: {
    fontSize: 20,
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
  searchIconSmall: {
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
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
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
    fontWeight: '600',
  },
  filterButton: {
    marginLeft: 'auto',
    padding: 8,
  },
  filterIcon: {
    fontSize: 18,
    color: '#5d4037',
  },
  listContent: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  columnWrapper: {
    justifyContent: 'space-around',
    gap: 8,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  bookItem: {
    flex: 1,
    alignItems: 'center',
    maxWidth: '30%',
  },
  bookCover: {
    width: '100%',
    height: 185,
    aspectRatio: 0.67,
    borderRadius: 8,
    backgroundColor: '#ddd',
    marginBottom: 8,
  },
  placeholderCover: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 12,
  },
  bookTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginBottom: 2,
  },
  bookYear: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#5d4037',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
