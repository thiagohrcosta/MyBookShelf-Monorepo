import Menu from "@/components/menu";
import { Image } from "expo-image";
import { reviewsService } from "@/services/reviews";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Author {
  id: number;
  name: string;
}

interface Reviewer {
  name: string;
  initials: string;
}

interface Publisher {
  id: number;
  name: string;
}

interface BookReview {
  id: number;
  book_id: number;
  title: string;
  description?: string;
  box_cover_url: string;
  author: Author;
  publisher?: Publisher;
  review_count: number;
  avg_rating: number;
  reviewers?: Reviewer[];
}

export default function ReviewPage() {
  const router = useRouter();
  const [bookReviews, setBookReviews] = useState<BookReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const reviews = await reviewsService.getReviews();
      console.log("Reviews fetched:", reviews);
      setBookReviews(Array.isArray(reviews) ? reviews : reviews?.data || []);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setError("Não foi possível carregar as avaliações");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const renderStars = (rating: number) => {
    const normalized = Math.max(0, Math.min(10, rating));
    const starValue = normalized / 2;
    const fullStars = Math.floor(starValue);
    const hasHalfStar = starValue % 1 !== 0;
    const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

    return (
      <View style={styles.starsContainer}>
        {[...Array(fullStars)].map((_, i) => (
          <Ionicons key={`full-${i}`} name="star" size={16} color="#ffc107" />
        ))}
        {hasHalfStar && (
          <Ionicons key="half" name="star-half" size={16} color="#ffc107" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#ddd" />
        ))}
      </View>
    );
  };

  const renderReviewCard = (review: BookReview, index: number) => {
    const coverUrl = review.box_cover_url;
    const title = review.title;
    const author = review.author?.name || "Autor desconhecido";

    return (
      <Pressable
        key={index}
        style={styles.reviewCard}
        onPress={() => router.push({ pathname: `/book/${review.id}` })}
        android_ripple={{ color: 'rgba(93, 64, 55, 0.1)' }}
      >
        {console.log(review)}
        <View style={styles.cardContent}>
          {/* Book Cover */}
          <View style={styles.coverContainer}>
            {coverUrl ? (
              <Image
                source={{ uri: coverUrl }}
                style={styles.bookCover}
                contentFit="cover"
                cachePolicy="memory-disk"
              />
            ) : (
              <View style={[styles.bookCover, styles.placeholderCover]}>
                <Text style={styles.placeholderText}>Sem capa</Text>
              </View>
            )}
          </View>

          {/* Book Info */}
          <View style={styles.bookInfo}>
            <Text style={styles.bookTitle} numberOfLines={2}>
              {title}
            </Text>
            <Text style={styles.authorName} numberOfLines={1}>
              {author}
            </Text>

            {/* Rating */}
            <View style={styles.ratingSection}>
              <View style={styles.starsWrapper}>
                {renderStars(review.avg_rating || 0)}
              </View>
              <Text style={styles.ratingText}>
                ({review.review_count || 0})
              </Text>
            </View>

            {/* Reviewers */}
            {review.reviewers && review.reviewers.length > 0 && (
              <View style={styles.reviewersContainer}>
                {review.reviewers.map((reviewer, idx) => (
                  <View key={idx} style={styles.reviewerBadge}>
                    <Text style={styles.reviewerInitials}>
                      {reviewer.initials}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Menu title="Reviews" />

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#5d4037" />
          <Text style={styles.loadingText}>Carregando avaliações...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle" size={48} color="#d32f2f" />
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retryText} onPress={fetchReviews}>
            Tentar novamente
          </Text>
        </View>
      ) : bookReviews.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="book-outline" size={48} color="#bbb" />
          <Text style={styles.emptyText}>Nenhuma avaliação ainda</Text>
          <Text style={styles.emptySubtext}>
            Comece a avaliar seus livros favoritos
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookReviews}
          renderItem={({ item, index }) => renderReviewCard(item, index)}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
          nestedScrollEnabled={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f1f0",
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    paddingBottom: 20,
  },
  reviewCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardContent: {
    flexDirection: "row",
    padding: 16,
    gap: 16,
  },
  coverContainer: {
    width: 110,
    height: 160,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#e8e0df",
  },
  bookCover: {
    width: "100%",
    height: "100%",
    color: "#ccc",
  },
  placeholderCover: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
  bookInfo: {
    flex: 1,
    paddingRight: 8,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2c2c2c",
    marginBottom: 4,
    lineHeight: 22,
  },
  authorName: {
    fontSize: 13,
    color: "#5d4037",
    marginBottom: 8,
  },
  ratingSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  starsWrapper: {
    flexDirection: "row",
  },
  starsContainer: {
    flexDirection: "row",
    gap: 2,
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  reviewText: {
    fontSize: 12,
    color: "#555",
    lineHeight: 16,
    marginBottom: 6,
    fontStyle: "italic",
  },
  reviewersContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    flexWrap: "wrap",
  },
  reviewerBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#5d4037",
    justifyContent: "center",
    alignItems: "center",
  },
  reviewerInitials: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
  dateText: {
    fontSize: 11,
    color: "#999",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#666",
    marginTop: 12,
  },
  errorText: {
    fontSize: 16,
    color: "#d32f2f",
    textAlign: "center",
    fontWeight: "500",
  },
  retryText: {
    fontSize: 14,
    color: "#5d4037",
    fontWeight: "600",
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#e8e0df",
    borderRadius: 8,
    overflow: "hidden",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#5d4037",
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 13,
    color: "#999",
    textAlign: "center",
  },
});
