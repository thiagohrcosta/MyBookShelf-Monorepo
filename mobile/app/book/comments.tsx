"use client";

import { bookComents } from "@/services/book-comments";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { format } from "date-fns";

type Comment = {
  id: number;
  rating: number;
  review: string;
  user_email: string;
  user_name: string;
  created_at: string;
};

export default function BookComents() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [comments, setComments] = useState<Comment[] | null>(null);

  const fetchBookComments = async () => {
    const comments = await bookComents.getBookComments(Number(id));
    console.log("Book comments:", comments);
    setComments(comments.data);
  }

  useEffect(() => {
    fetchBookComments();
  }, [id]);

  return (
    <View>
      {comments ? (
        comments.map((comment: any) => (
          <View key={comment.id} style={style.commentContainer}>
            <Text style={style.review}>{comment.review}</Text>
             <View style={style.commentHeader}>
              <Text style={style.userName}>{comment.user_name}</Text>
              <Text style={style.date}>{format(comment.created_at, "MM/dd/yyyy")}</Text>
            </View>
          </View>
        ))
      ) : (
        <Text>Loading comments...</Text>
      )}
    </View>
  )
}

const style = StyleSheet.create({
  commentContainer: {
    margin: 16,
    padding: 24,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  commentHeader: {
    marginTop: 12,
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  review: {
    fontSize: 14,
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
})