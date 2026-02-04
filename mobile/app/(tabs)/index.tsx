import { Image } from 'expo-image';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { Background } from '@react-navigation/elements';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <>
      <ThemedView style={styles.titleContainer}>
        <Text>My Bookshelf</Text>
      </ThemedView>
      <View style={styles.mainTitleContainer}>
        <Text style={styles.mainTitle}>Your bookshelf</Text>
        <Text style={styles.mainSubTitle}>Your story</Text>
      </View>
      <View style={styles.homeBannerContainer}>
        <Image
          source={require('@/assets/images/bannerhome.png')}
          style={styles.homeBannerBackground}
        />
        <View style={styles.homeBannerTextContainer}>
          <Text>Organize, track and remember all the books reads throughtout the years</Text>
        </View>
      </View>
      <View style={styles.callToActionContainer}>
        <Pressable style={styles.buttonPrimary}>
          <Text style={styles.buttonPrimaryText}>Add Book</Text>
        </Pressable>
        <Pressable
          style={styles.buttonSecondary}
          onPress={() => router.push('/(tabs)/library')}
        >
          <Text style={styles.buttonSecondaryText}>Library</Text>
        </Pressable>
      </View>
    </>
);
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
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
    fontSize: 16,
    color: '#5d4037',
    zIndex: 1,
    maxWidth: '60%',
  },
  homeBannerImageContainer: {
    maxWidth: '40%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 12,
    backgroundColor: '#5d4037',
    color: '#fff',
    borderRadius: 8,
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
  },
});
