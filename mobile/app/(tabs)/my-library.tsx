import { myLibrary } from "@/services/my-labrary";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function MyLibraryScreen() {
  const [myLibraryData, setMyLibraryData] = useState<any[]>([]);

  const fetchMyLibrary = async () => {
      try {
        const response = await myLibrary.getMyLibrary(1);
        console.log('My Library:', response.data);
        setMyLibraryData(response.data);
      } catch (error) {
        console.error('Error fetching my library:', error);
      }
  }

  useEffect(() => {
    fetchMyLibrary();
  }, []);

  return (
    <View>
      {myLibraryData.map((bookData) => {
        return (
          <View key={bookData.id} style={style.bookContainer}>
            <View style={style.bookHeaderContainer}>
              <Image source={bookData.book.box_cover_url} style={{ width: 100, height: 150 }} />
              <View>
                <Text style={style.bookTitle}>{bookData.book.title}</Text>
                <Text style={style.bookAuthor}>{bookData.book.author.name}</Text>
              </View>
            </View>
          </View>
        )
      })}
    </View>
  )
}

const style = StyleSheet.create({
  bookContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  bookHeaderContainer: {
    flexDirection: 'row',
    margin: 16,
    padding: 16,
    gap: 16,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
  },
})
