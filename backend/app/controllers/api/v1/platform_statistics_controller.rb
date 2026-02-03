module Api
  module V1
    class PlatformStatisticsController < ApplicationController
      # Public endpoint - no authentication required

      def index
        # Total books registered on the platform
        total_books = Book.count

        # Total pages summing all books
        total_pages = Book.sum(:pages) || 0

        # Most read author by users
        most_read_author = find_most_read_author

        # Recent activities - last books read by users
        recent_activities = find_recent_activities

        # Recent users - last 5 users registered
        recent_users = find_recent_users

        render json: {
          total_books: total_books,
          total_pages: total_pages,
          most_read_author: most_read_author,
          recent_activities: recent_activities,
          recent_users: recent_users
        }, status: :ok
      end

      private

      def find_most_read_author
        # Find the author with the most books read by users
        author_reads = ReadBook.joins(book: :author)
          .group("authors.id", "authors.name")
          .select("authors.id, authors.name, COUNT(read_books.id) as read_count")
          .order("read_count DESC")
          .first

        if author_reads
          {
            id: author_reads.id,
            name: author_reads.name,
            read_count: author_reads.read_count
          }
        else
          nil
        end
      end

      def find_recent_activities
        # Get the last 5 books read by users with details
        ReadBook.includes(:user, book: [:author])
          .order(created_at: :desc)
          .limit(5)
          .map do |read_book|
            {
              id: read_book.id,
              user_name: read_book.user.full_name,
              book_title: read_book.book.title,
              author_name: read_book.book.author.name,
              action: determine_action(read_book),
              date: read_book.created_at.strftime("%b %-d")
            }
          end
      end

      def determine_action(read_book)
        # Check if this is a recent read (within last 7 days)
        if read_book.created_at > 7.days.ago
          "Finished reading"
        else
          "Read"
        end
      end

      def find_recent_users
        # Get the last 5 users registered with their stats
        User.order(created_at: :desc)
          .limit(5)
          .map do |user|
            books_count = user.books.count
            reviews_count = user.book_reviews.count

            {
              id: user.id,
              full_name: user.full_name,
              email: user.email,
              books_count: books_count,
              reviews_count: reviews_count,
              created_at: user.created_at.strftime("%b %-d")
            }
          end
      end
    end
  end
end
