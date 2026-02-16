import Menu from '@/components/menu';
import { Book, booksService } from '@/services/books';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import BookComents from './comments';
import truncate from '@/utils/truncate';

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ showFullDescription, setShowFullDescription] = useState(false);

  const bookId = useMemo(() => Number(id), [id]);

  useEffect(() => {
    const fetchBook = async () => {
      if (!bookId) {
        setError('Invalid book');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await booksService.getBook(bookId);
        setBook(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load book');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#5d4037" />
      </View>
    );
  }

  if (error || !book) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'Book not found'}</Text>
        <Pressable style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryButtonText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const coverUrl = book.box_cover_url || book.cover_image_url;

  return (
    <View style={styles.container}>
      <Menu title="Book Details" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
      <View style={styles.bookHero}>
        {coverUrl ? (
          <Image
            source={{ uri: coverUrl }}
            style={styles.coverImage}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
        ) : (
          <View style={[styles.coverImage, styles.coverPlaceholder]}>
            <Text style={styles.coverPlaceholderText}>No cover</Text>
          </View>
        )}
        <View style={styles.bookMeta}>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.bookAuthor}>{book.author?.name || 'Unknown Author'}</Text>
          <Text style={styles.bookYear}>
            {book.publication_year || book.release_year || '—'}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>ISBN</Text>
            <Text style={styles.metaValue}>{book.isbn || 'N/A'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About the book</Text>
        <Text style={styles.sectionBody}>
          {truncate(book.description || book.summary || 'No description available.', showFullDescription ? 5000 : 200)}
        </Text>
        <Pressable style={styles.readMoreButton} onPress={() => setShowFullDescription(!showFullDescription)}>
          <Text style={styles.readMoreButtonText}>{showFullDescription ? "Show less" : "Read more"}</Text>
        </Pressable>
      </View>
      <View>
        <BookComents />
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 20,
    color: '#5d4037',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#5d4037',
  },
  headerSpacer: {
    width: 32,
  },
  bookHero: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  coverImage: {
    width: 120,
    height: 180,
    borderRadius: 12,
    backgroundColor: '#e0d6d3',
  },
  coverPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverPlaceholderText: {
    color: '#a1887f',
    fontSize: 12,
  },
  bookMeta: {
    flex: 1,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4e342e',
    marginBottom: 6,
  },
  bookAuthor: {
    fontSize: 16,
    color: '#7b5e57',
    marginBottom: 4,
  },
  bookYear: {
    fontSize: 14,
    color: '#8d6e63',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5d4037',
  },
  metaValue: {
    fontSize: 12,
    color: '#6d4c41',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0d6d3',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5d4037',
    marginBottom: 8,
  },
  sectionBody: {
    fontSize: 14,
    color: '#5f4b45',
    lineHeight: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f1f0',
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 16,
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
  readMoreButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#5d4037',
    borderRadius: 4,
  },
  readMoreButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  }
});
