import Menu from "@/components/menu";
import { profileService } from "@/services/profile";
import { Ionicons as IonIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";


export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<any>(null);

  const fetchUserProfile = async () => {
    try {
      const userProfile = await profileService.getUserProfile();
      setUserProfile(userProfile.data);
      console.log(userProfile);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <View style={styles.screen}>
      <Menu title="Profile" />
      <View style={styles.container}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1620399909663-b7a7da934161?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
          style={styles.userAvatar}
        />
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 16 }}>
          {userProfile?.full_name}
        </Text>
        <Text>{userProfile?.email}</Text>
      </View>
      <View style={styles.profileOptions}>
        <View style={styles.profileOption}>
          <IonIcons name="person" size={24} color="black" />
          <Text>Edit Profile</Text>
        </View>
        <View style={styles.profileOption}>
          <IonIcons name="log-out" size={24} color="black" />
          <Text>Logout</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 32,
  },
  profileOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileOptions: {
    margin: 32,
    padding: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  }
})