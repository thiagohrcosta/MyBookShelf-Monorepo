import Menu from '@/components/menu';
import { useAuth } from '@/context/auth-context';
import { profileService, type UserProfile } from '@/services/profile';
import { subscriptionService, type Subscription } from '@/services/subscription';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const MONTHLY_PRICE = '$3.99';

function formatProfileDate(date?: string) {
  if (!date) {
    return '-';
  }

  return new Date(date).toLocaleDateString('pt-BR');
}

function formatRenewalDate(date?: string) {
  if (!date) {
    return '-';
  }

  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ProfilePage() {
  const router = useRouter();
  const { token, isAuthenticated, isLoading, logout } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasActiveSubscription = useMemo(
    () => subscription?.status === 'active',
    [subscription],
  );

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated) {
        setIsLoadingProfile(false);
        return;
      }

      try {
        const userProfile = await profileService.getUserProfile();
        setProfile(userProfile);
      } catch {
        setErrorMessage('Unable to load your profile right now.');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (!isLoading) {
      fetchProfile();
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!token) {
        setIsLoadingSubscription(false);
        return;
      }

      try {
        const currentSubscription = await subscriptionService.getSubscription(token);
        setSubscription(currentSubscription);
      } catch {
        setErrorMessage('Unable to load subscription details right now.');
      } finally {
        setIsLoadingSubscription(false);
      }
    };

    if (!isLoading) {
      fetchSubscription();
    }
  }, [isLoading, token]);

  const handleSubscribe = async () => {
    if (!token) {
      Alert.alert('Authentication required', 'Please sign in to subscribe.');
      return;
    }

    setIsCreatingCheckout(true);

    try {
      const checkoutUrl = await subscriptionService.createCheckoutSession(token);
      const canOpenCheckout = await Linking.canOpenURL(checkoutUrl);

      if (!canOpenCheckout) {
        throw new Error('Checkout URL cannot be opened');
      }

      await Linking.openURL(checkoutUrl);
    } catch {
      Alert.alert('Subscription', 'Unable to open Stripe checkout. Please try again.');
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <View style={styles.screen}>
      <Menu title="My Profile" />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>My Profile</Text>
          <Text style={styles.pageSubtitle}>See your personal information and keep your data up to date.</Text>
        </View>

        <View style={styles.card}>
          {isLoadingProfile ? (
            <View style={styles.loadingWrapper}>
              <ActivityIndicator color="#5d4037" />
              <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
          ) : profile ? (
            <View style={styles.profileContent}>
              <View>
                <Text style={styles.label}>Full name</Text>
                <Text style={styles.value}>{profile.full_name || 'Not provided'}</Text>
              </View>

              <View>
                <Text style={styles.label}>E-mail</Text>
                <Text style={styles.value}>{profile.email}</Text>
              </View>

              <View style={styles.profileBottomRow}>
                <View style={styles.profileBottomColumn}>
                  <Text style={styles.label}>Role</Text>
                  <Text style={styles.value}>{profile.role || 'user'}</Text>
                </View>
                <View style={styles.profileBottomColumn}>
                  <Text style={styles.label}>Created at</Text>
                  <Text style={styles.value}>{formatProfileDate(profile.created_at)}</Text>
                </View>
              </View>
            </View>
          ) : (
            <Text style={styles.emptyText}>No profile data was found.</Text>
          )}
        </View>

        {isLoadingSubscription ? (
          <View style={styles.subscriptionCard}>
            <ActivityIndicator color="#047857" />
            <Text style={styles.subscriptionMutedText}>Loading subscription...</Text>
          </View>
        ) : hasActiveSubscription && subscription ? (
          <View style={styles.subscriptionCard}>
            <View style={styles.subscriptionHeaderRow}>
              <View>
                <Text style={styles.subscriptionTitle}>Your Subscription</Text>
                <Text style={styles.subscriptionSubtitle}>Active subscription details</Text>
              </View>
              <View style={styles.activeChip}>
                <Text style={styles.activeChipText}>✓ Active</Text>
              </View>
            </View>

            <View style={styles.metricsRow}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>MONTHLY PRICE</Text>
                <Text style={styles.priceValue}>{MONTHLY_PRICE}</Text>
                <Text style={styles.metricHint}>per month</Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>NEXT RENEWAL</Text>
                <Text style={styles.metricValue}>{formatRenewalDate(subscription.current_period_end)}</Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>BILLING TYPE</Text>
                <Text style={styles.metricValue}>Monthly</Text>
                <Text style={styles.metricHint}>Auto-renewing</Text>
              </View>
            </View>

            <View style={styles.featureNotice}>
              <Text style={styles.featureNoticeText}>
                ✓ You have full access to all premium features including unlimited book reviews, premium content, and priority support.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.subscriptionFallbackCard}>
            <Text style={styles.subscriptionFallbackTitle}>Subscription</Text>
            <Text style={styles.subscriptionFallbackSubtitle}>Manage your premium membership</Text>

            <View style={styles.featureBox}>
              <Text style={styles.featureBoxTitle}>Premium Features</Text>
              <Text style={styles.featureLine}>✓ Create unlimited book reviews</Text>
              <Text style={styles.featureLine}>✓ Access to premium content</Text>
              <Text style={styles.featureLine}>✓ Priority support</Text>
              <Text style={styles.featureLine}>✓ Ad-free experience</Text>
            </View>

            <Pressable
              style={[styles.subscribeButton, isCreatingCheckout && styles.disabledButton]}
              onPress={handleSubscribe}
              disabled={isCreatingCheckout}
            >
              <Text style={styles.subscribeButtonText}>
                {isCreatingCheckout ? 'Opening Stripe...' : 'Subscribe with Stripe'}
              </Text>
            </Pressable>
          </View>
        )}

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f1f0',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 24,
    gap: 16,
  },
  pageHeader: {
    gap: 4,
  },
  pageTitle: {
    fontSize: 36,
    color: '#1f2a44',
    fontWeight: '600',
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#3f556b',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d6d6d6',
    padding: 20,
  },
  loadingWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 120,
  },
  loadingText: {
    color: '#6d4c41',
  },
  profileContent: {
    gap: 24,
  },
  label: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    color: '#0f2744',
    fontWeight: '600',
  },
  profileBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  profileBottomColumn: {
    flex: 1,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 15,
  },
  subscriptionCard: {
    backgroundColor: '#e7f7ec',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#9de8bb',
    padding: 20,
    gap: 16,
  },
  subscriptionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  subscriptionTitle: {
    fontSize: 28,
    color: '#0f2744',
    fontWeight: '600',
  },
  subscriptionSubtitle: {
    fontSize: 16,
    color: '#3f556b',
  },
  activeChip: {
    backgroundColor: '#c7f5d5',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  activeChipText: {
    color: '#065f46',
    fontWeight: '700',
    fontSize: 18,
  },
  metricsRow: {
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#9de8bb',
    padding: 16,
    gap: 4,
  },
  metricLabel: {
    fontSize: 16,
    color: '#455d73',
  },
  priceValue: {
    fontSize: 32,
    color: '#059669',
    fontWeight: '700',
  },
  metricValue: {
    fontSize: 28,
    color: '#0f2744',
    fontWeight: '600',
  },
  metricHint: {
    fontSize: 16,
    color: '#64748b',
  },
  featureNotice: {
    borderWidth: 1,
    borderColor: '#9de8bb',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#f6fffa',
  },
  featureNoticeText: {
    color: '#046c4e',
    fontSize: 15,
    lineHeight: 24,
  },
  subscriptionMutedText: {
    color: '#3f556b',
    fontSize: 15,
  },
  subscriptionFallbackCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d6d6d6',
    padding: 20,
    gap: 16,
  },
  subscriptionFallbackTitle: {
    fontSize: 26,
    color: '#0f2744',
    fontWeight: '600',
  },
  subscriptionFallbackSubtitle: {
    fontSize: 16,
    color: '#3f556b',
  },
  featureBox: {
    backgroundColor: '#fffbeb',
    borderColor: '#f7cd68',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  featureBoxTitle: {
    fontSize: 22,
    color: '#0f2744',
    fontWeight: '600',
    marginBottom: 6,
  },
  featureLine: {
    fontSize: 15,
    color: '#1f2937',
  },
  subscribeButton: {
    backgroundColor: '#b45309',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.7,
  },
  errorText: {
    color: '#b91c1c',
    textAlign: 'center',
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
});
