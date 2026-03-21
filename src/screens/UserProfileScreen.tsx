import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize, LetterSpacing } from '../theme/typography';
import { Icon } from '../components/Icon';
import { useAuth } from '../context/AuthContext';

const ACCOUNT_ITEMS = [
  { icon: 'settings', title: 'Account Settings', subtitle: 'Privacy, security, and personal info' },
  { icon: 'payments', title: 'Payment Methods', subtitle: 'Manage cards and digital wallets' },
  { icon: 'help_center', title: 'Help Center', subtitle: 'FAQs and customer support' },
];

export function UserProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 64 + 24, paddingBottom: 120, paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarCircle}>
              <Icon name="person" size={52} color={Colors.secondary} />
            </View>
            <View style={styles.verifiedBadge}>
              <Icon name="verified" size={14} color="#FFFFFF" />
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.displayName ?? 'Traveler'}</Text>
            <View style={styles.profileBadges}>
              <View style={styles.levelBadge}>
                <Text style={styles.levelBadgeText}>Explorer Level</Text>
              </View>
              <View style={styles.premiumRow}>
                <Icon name="stars" size={14} color={Colors.secondary} />
                <Text style={styles.premiumText}>Premium Member</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Points Card */}
        <LinearGradient
          colors={[Colors.primaryContainer, Colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.pointsCard}
        >
          <View style={styles.pointsCardDecor}>
            <Icon name="card_membership" size={96} color="rgba(255,255,255,0.08)" />
          </View>
          <View>
            <Text style={styles.pointsLabel}>Total Rewards</Text>
            <Text style={styles.pointsValue}>125 pts</Text>
          </View>
          <TouchableOpacity style={styles.redeemBtn} activeOpacity={0.85}>
            <Text style={styles.redeemText}>Redeem</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Account Section */}
        <Text style={styles.sectionLabel}>Account Essentials</Text>
        <View style={styles.menuCard}>
          {ACCOUNT_ITEMS.map((item, i) => (
            <React.Fragment key={item.title}>
              <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
                <View style={styles.menuLeft}>
                  <View style={styles.menuIconBox}>
                    <Icon name={item.icon} size={22} color={Colors.onSurfaceVariant} />
                  </View>
                  <View>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                <Icon name="chevron_right" size={20} color={Colors.outlineVariant} />
              </TouchableOpacity>
              {i < ACCOUNT_ITEMS.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Preference */}
        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Preference</Text>
        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuRow} onPress={handleLogout} activeOpacity={0.7}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIconBox, { backgroundColor: Colors.surfaceContainerLow }]}>
                <Icon name="logout" size={22} color={Colors.error} />
              </View>
              <Text style={[styles.menuTitle, { color: Colors.error }]}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 32 },
  avatarWrapper: { position: 'relative' },
  avatarCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: Colors.surfaceContainerLow, borderWidth: 4, borderColor: Colors.surfaceContainerLowest, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 6 },
  verifiedBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: Colors.secondary, borderRadius: 999, padding: 6, borderWidth: 2, borderColor: Colors.surfaceContainerLowest },
  profileInfo: { flex: 1 },
  profileName: { fontSize: FontSize['3xl'], fontFamily: FontFamily.headlineExtraBold, color: Colors.onSurface, letterSpacing: LetterSpacing.tighter, marginBottom: 8 },
  profileBadges: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  levelBadge: { backgroundColor: Colors.secondaryContainer, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999 },
  levelBadgeText: { fontSize: 12, fontFamily: FontFamily.bodySemiBold, color: Colors.onSecondaryContainer, textTransform: 'uppercase', letterSpacing: LetterSpacing.wide },
  premiumRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  premiumText: { fontSize: FontSize.sm, fontFamily: FontFamily.bodyMedium, color: Colors.onSurfaceVariant },
  pointsCard: { borderRadius: 12, padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, shadowColor: Colors.primaryContainer, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 6, overflow: 'hidden' },
  pointsCardDecor: { position: 'absolute', right: -16, bottom: -16 },
  pointsLabel: { fontSize: 12, fontFamily: FontFamily.bodySemiBold, color: Colors.onPrimaryContainer, textTransform: 'uppercase', letterSpacing: LetterSpacing.widest, marginBottom: 4 },
  pointsValue: { fontSize: FontSize['4xl'], fontFamily: FontFamily.headlineExtraBold, color: Colors.secondaryFixed },
  redeemBtn: { backgroundColor: Colors.secondary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  redeemText: { fontSize: FontSize.sm, fontFamily: FontFamily.headline, color: '#FFFFFF' },
  sectionLabel: { fontSize: 12, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: LetterSpacing.widest, marginBottom: 16, paddingHorizontal: 4 },
  menuCard: { backgroundColor: Colors.surfaceContainerLowest, borderRadius: 12, overflow: 'hidden' },
  menuRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  menuIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.surfaceContainer, alignItems: 'center', justifyContent: 'center' },
  menuTitle: { fontSize: FontSize.sm, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurface },
  menuSubtitle: { fontSize: 12, fontFamily: FontFamily.body, color: Colors.onSurfaceVariant, marginTop: 2 },
  divider: { height: 1, backgroundColor: Colors.surfaceContainerLow, marginHorizontal: 16 },
});
