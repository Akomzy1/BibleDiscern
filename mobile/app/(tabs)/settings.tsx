import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
  Linking,
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { useSubscriptionStore } from '@/stores/useSubscriptionStore';
import { apiClient } from '@/lib/api';
import { resetPurchasesUser } from '@/lib/purchases';
import {
  registerForPushNotifications,
  scheduleDailyMomentNotification,
  cancelAllScheduledNotifications,
} from '@/lib/notifications';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '@/constants/theme';
import type { Profile } from '@librato/shared';

// 30-minute interval preset times for daily moment notification
const TIME_OPTIONS = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
  '09:00', '09:30', '10:00', '12:00', '20:00', '21:00',
];

function formatTime(time24: string): string {
  const [hStr, mStr] = time24.split(':');
  const h = parseInt(hStr, 10);
  const m = mStr ?? '00';
  const period = h < 12 ? 'AM' : 'PM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m} ${period}`;
}

function formatRenewalDate(iso: string | null): string {
  if (!iso) return 'Unknown';
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function SettingsScreen() {
  const { user, signOut } = useAuthStore();
  const { subscription, isPremium, isTrial, fetchSubscription } = useSubscriptionStore();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [, setLoadingProfile] = useState(true);

  // Editable fields
  const [displayName, setDisplayName] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [savingName, setSavingName] = useState(false);

  // Notifications — default ON so the Daily Moment is enabled out of the box
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [notifTime, setNotifTime] = useState('08:00');
  const [savingNotif, setSavingNotif] = useState(false);

  useEffect(() => {
    loadProfile();
    fetchSubscription();
  }, []);

  const loadProfile = async () => {
    setLoadingProfile(true);
    try {
      const p = await apiClient.getProfile();
      setProfile(p);
      setDisplayName(p.display_name ?? p.full_name ?? '');
      // Keep the Daily Moment toggle ON by default. Only reflect the profile
      // when a push token already exists — absence of a token means the
      // user hasn't registered yet, not that they explicitly opted out.
      if (p.expo_push_token) setNotificationsOn(true);
      setNotifTime(p.daily_moment_time ?? '08:00');
    } catch {
      // non-fatal
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleSaveName = async () => {
    if (!displayName.trim()) return;
    setSavingName(true);
    try {
      const updated = await apiClient.updateProfile({ display_name: displayName.trim() });
      setProfile(updated);
      setEditingName(false);
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Could not save name.');
    } finally {
      setSavingName(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSavingNotif(true);
    try {
      if (notificationsOn) {
        // Ensure we have a push token before scheduling
        await registerForPushNotifications();
        await scheduleDailyMomentNotification(notifTime);
      } else {
        await cancelAllScheduledNotifications();
      }
      await apiClient.updateProfile({ daily_moment_time: notifTime });
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Could not save notification settings.');
    } finally {
      setSavingNotif(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await resetPurchasesUser();
          await signOut();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const openUrl = (url: string) => {
    Linking.openURL(url).catch(() =>
      Alert.alert('Could not open link', 'Please visit ' + url),
    );
  };

  const openManageSubscription = () => {
    if (Platform.OS === 'ios') {
      openUrl('itms-apps://apps.apple.com/account/subscriptions');
    } else {
      openUrl('https://play.google.com/store/account/subscriptions');
    }
  };

  const displayNameValue =
    profile?.display_name ?? profile?.full_name ?? user?.email ?? 'Friend';

  return (
    <ScreenWrapper>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* ── Profile ───────────────────────────── */}
      <SectionHeader label="Profile" />
      <Card style={styles.card}>
        {/* Avatar row */}
        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>
              {displayNameValue.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.avatarInfo}>
            {editingName ? (
              <View style={styles.nameEditRow}>
                <TextInput
                  value={displayName}
                  onChangeText={setDisplayName}
                  style={styles.nameInput}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleSaveName}
                  accessibilityLabel="Display name"
                />
                <Pressable
                  onPress={handleSaveName}
                  disabled={savingName}
                  accessibilityRole="button"
                  style={styles.saveNameBtn}
                >
                  {savingName
                    ? <ActivityIndicator size="small" color={COLORS.gold} />
                    : <Text style={styles.saveNameText}>Save</Text>}
                </Pressable>
                <Pressable
                  onPress={() => { setEditingName(false); setDisplayName(displayNameValue); }}
                  accessibilityRole="button"
                  style={styles.cancelNameBtn}
                >
                  <Text style={styles.cancelNameText}>Cancel</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={() => setEditingName(true)}
                accessibilityRole="button"
                accessibilityLabel="Edit display name"
              >
                <Text style={styles.profileName}>{displayNameValue}</Text>
                <Text style={styles.editHint}>Tap to edit</Text>
              </Pressable>
            )}
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
          <Badge
            label={isTrial ? 'Trial' : isPremium ? 'Premium' : 'Free'}
            variant={isPremium || isTrial ? 'gold' : 'neutral'}
          />
        </View>
      </Card>

      {/* ── Subscription ─────────────────────── */}
      <SectionHeader label="Subscription" />
      <Card style={styles.card}>
        {isPremium || isTrial ? (
          <View style={styles.subRow}>
            <View style={styles.subInfo}>
              <Text style={styles.subTier}>Premium{isTrial ? ' (Trial)' : ''}</Text>
              {subscription?.billing_interval && (
                <Text style={styles.subDetail}>
                  Billed {subscription.billing_interval === 'year' ? 'annually' : 'monthly'}
                </Text>
              )}
              {subscription?.current_period_end && (
                <Text style={styles.subDetail}>
                  Renews {formatRenewalDate(subscription.current_period_end)}
                </Text>
              )}
            </View>
            <Pressable
              onPress={openManageSubscription}
              style={styles.manageBtn}
              accessibilityRole="button"
            >
              <Text style={styles.manageBtnText}>Manage</Text>
            </Pressable>
          </View>
        ) : (
          <Button
            title="✨ Upgrade to Premium"
            onPress={() => router.push('/upgrade')}
            fullWidth
          />
        )}
      </Card>

      {/* ── Daily Moment Notification ─────────── */}
      <SectionHeader label="Daily Moment" />
      <Card style={styles.card}>
        <View style={styles.notifToggleRow}>
          <View style={styles.notifToggleText}>
            <Text style={styles.notifTitle}>Morning notification</Text>
            <Text style={styles.notifSub}>Receive a daily scripture and reflection</Text>
          </View>
          <Switch
            value={notificationsOn}
            onValueChange={setNotificationsOn}
            trackColor={{ false: COLORS.border, true: COLORS.gold }}
            thumbColor={COLORS.cream}
          />
        </View>

        {notificationsOn && (
          <>
            <View style={styles.separator} />
            <Text style={styles.timeLabel}>Delivery time</Text>
            <View style={styles.timeGrid}>
              {TIME_OPTIONS.map((t) => (
                <Pressable
                  key={t}
                  onPress={() => setNotifTime(t)}
                  style={[styles.timePill, notifTime === t && styles.timePillSelected]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: notifTime === t }}
                >
                  <Text style={[styles.timePillText, notifTime === t && styles.timePillTextSelected]}>
                    {formatTime(t)}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Button
              title={savingNotif ? 'Saving…' : 'Save'}
              onPress={handleSaveNotifications}
              disabled={savingNotif}
              variant="ghost"
              style={styles.saveNotifBtn}
            />
          </>
        )}
      </Card>

      {/* ── Links ────────────────────────────── */}
      <SectionHeader label="About" />
      <Card style={[styles.card, styles.linksCard]}>
        <LinkRow label="About BibleDiscern" onPress={() => openUrl('https://librato.ai/about')} />
        <View style={styles.separator} />
        <LinkRow label="Privacy Policy" onPress={() => openUrl('https://librato.ai/privacy')} />
        <View style={styles.separator} />
        <LinkRow label="Terms of Service" onPress={() => openUrl('https://librato.ai/terms')} />
        <View style={styles.separator} />
        <LinkRow label="Contact Support" onPress={() => openUrl('mailto:support@librato.ai')} />
      </Card>

      {/* ── Sign Out ─────────────────────────── */}
      <Pressable
        onPress={handleSignOut}
        style={styles.signOutBtn}
        accessibilityRole="button"
        accessibilityLabel="Sign out"
      >
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>

      <Text style={styles.version}>BibleDiscern v1.0.0 — Weigh it with wisdom</Text>
    </ScreenWrapper>
  );
}

function SectionHeader({ label }: { label: string }) {
  return <Text style={sectionStyles.label}>{label.toUpperCase()}</Text>;
}

function LinkRow({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }: { pressed: boolean }) => [
        sectionStyles.linkRow,
        pressed && { opacity: 0.65 },
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={sectionStyles.linkLabel}>{label}</Text>
      <Text style={sectionStyles.linkChevron}>›</Text>
    </Pressable>
  );
}

const sectionStyles = StyleSheet.create({
  label: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.textLight,
    letterSpacing: 1.5,
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  linkLabel: { fontFamily: FONTS.body, fontSize: 15, color: COLORS.textDark },
  linkChevron: { fontFamily: FONTS.body, fontSize: 20, color: COLORS.textLight, lineHeight: 22 },
});

const styles = StyleSheet.create({
  header: { paddingTop: SPACING['3xl'], marginBottom: SPACING.xl },
  title: { fontFamily: FONTS.display, fontSize: 28, color: COLORS.navy },

  card: { marginBottom: 0 },
  linksCard: { padding: 0 },

  // Profile
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.navy,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarLetter: { fontFamily: FONTS.display, fontSize: 20, color: COLORS.goldLight },
  avatarInfo: { flex: 1, gap: 2 },
  nameEditRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  nameInput: {
    flex: 1,
    fontFamily: FONTS.bodySemiBold,
    fontSize: 15,
    color: COLORS.navy,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gold,
    paddingVertical: 2,
  },
  saveNameBtn: { padding: SPACING.xs },
  saveNameText: { fontFamily: FONTS.bodyBold, fontSize: 13, color: COLORS.gold },
  cancelNameBtn: { padding: SPACING.xs },
  cancelNameText: { fontFamily: FONTS.body, fontSize: 13, color: COLORS.textLight },
  profileName: { fontFamily: FONTS.bodySemiBold, fontSize: 15, color: COLORS.navy },
  editHint: { fontFamily: FONTS.body, fontSize: 11, color: COLORS.textLight },
  profileEmail: { fontFamily: FONTS.body, fontSize: 13, color: COLORS.textLight },

  // Subscription
  subRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  subInfo: { gap: 2 },
  subTier: { fontFamily: FONTS.bodySemiBold, fontSize: 15, color: COLORS.navy },
  subDetail: { fontFamily: FONTS.body, fontSize: 13, color: COLORS.textMedium },
  manageBtn: {
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  manageBtnText: { fontFamily: FONTS.bodySemiBold, fontSize: 13, color: COLORS.gold },

  // Notifications
  notifToggleRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  notifToggleText: { flex: 1 },
  notifTitle: { fontFamily: FONTS.bodySemiBold, fontSize: 15, color: COLORS.navy },
  notifSub: { fontFamily: FONTS.body, fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  separator: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.md },
  timeLabel: { fontFamily: FONTS.bodyBold, fontSize: 11, color: COLORS.textLight, letterSpacing: 1, textTransform: 'uppercase', marginBottom: SPACING.sm },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  timePill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timePillSelected: { backgroundColor: `${COLORS.gold}22`, borderColor: COLORS.gold },
  timePillText: { fontFamily: FONTS.body, fontSize: 13, color: COLORS.textMedium },
  timePillTextSelected: { fontFamily: FONTS.bodyBold, color: COLORS.navy },
  saveNotifBtn: { alignSelf: 'flex-end', marginTop: SPACING.sm },

  // Sign out
  signOutBtn: {
    marginTop: SPACING['2xl'],
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  signOutText: { fontFamily: FONTS.bodySemiBold, fontSize: 15, color: COLORS.error },

  version: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING['3xl'],
  },
});
