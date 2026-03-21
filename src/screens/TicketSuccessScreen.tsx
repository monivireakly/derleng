import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize, LetterSpacing } from '../theme/typography';
import { Icon } from '../components/Icon';

interface TicketSuccessScreenProps {
  navigation: any;
  route: any;
}

export function TicketSuccessScreen({ navigation, route }: TicketSuccessScreenProps) {
  const insets = useSafeAreaInsets();
  const { passengerName, email, seat, result } = route?.params ?? {};
  const displayEmail = email || 'your email address';

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primaryContainer, Colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top }]}
      >
        <View style={styles.headerInner}>
          <View style={{ width: 40 }} />
          <Text style={styles.headerTitle}>DerLeng</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Main')} activeOpacity={0.7}>
            <Icon name="close" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 64 + 32, paddingBottom: insets.bottom + 48 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Success animation ring */}
        <View style={styles.successRing}>
          <View style={styles.successCircle}>
            <Icon name="check-bold" size={44} color="#FFFFFF" />
          </View>
        </View>

        <Text style={styles.successTitle}>Booking Confirmed!</Text>
        <Text style={styles.successSubtitle}>Your trip has been successfully booked.</Text>

        {/* Email notification card */}
        <View style={styles.emailCard}>
          <View style={styles.emailIconBox}>
            <Icon name="mark-email-read" size={28} color={Colors.secondary} />
          </View>
          <View style={styles.emailContent}>
            <Text style={styles.emailTitle}>Confirmation email sent</Text>
            <Text style={styles.emailAddress}>{displayEmail}</Text>
            <Text style={styles.emailNote}>Check your inbox for your e-ticket and boarding details.</Text>
          </View>
        </View>

        {/* Booking summary */}
        <View style={styles.bookingCard}>
          <View style={styles.bookingCardHeader}>
            <Icon name="directions_bus" size={18} color={Colors.primaryContainer} />
            <Text style={styles.bookingCardTitle}>{result?.company ?? 'Bus Operator'}</Text>
            <View style={styles.confirmedBadge}>
              <Text style={styles.confirmedText}>CONFIRMED</Text>
            </View>
          </View>

          <View style={styles.routeRow}>
            <View>
              <Text style={styles.cityName}>{result?.from ?? 'Phnom Penh'}</Text>
              <Text style={styles.cityTime}>{result?.depTime ?? '08:30'}</Text>
            </View>
            <View style={styles.routeMid}>
              <View style={styles.routeLine} />
              <Icon name="directions_bus" size={16} color={Colors.secondary} />
              <View style={styles.routeLine} />
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.cityName}>{result?.to ?? 'Siem Reap'}</Text>
              <Text style={styles.cityTime}>{result?.arrTime ?? '14:00'}</Text>
            </View>
          </View>

          <View style={styles.detailsRow}>
            {[
              { label: 'Passenger', value: passengerName ?? 'Traveler' },
              { label: 'Seat', value: seat ?? '12A' },
              { label: 'Duration', value: result?.duration ?? '5h 30m' },
              { label: 'Amount Paid', value: result?.price ?? '$12' },
            ].map((d) => (
              <View key={d.label} style={styles.detailItem}>
                <Text style={styles.detailLabel}>{d.label}</Text>
                <Text style={[styles.detailValue, d.label === 'Amount Paid' && { color: Colors.secondary }]}>{d.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Go to My Trips CTA */}
        <View style={styles.ctaGroup}>
          <View style={styles.tripPromptBox}>
            <Icon name="info" size={16} color={Colors.secondary} />
            <Text style={styles.tripPromptText}>
              Please check <Text style={styles.tripPromptBold}>My Trips</Text> for full trip details, e-ticket, and boarding information.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.myTripsBtn}
            onPress={() => navigation.navigate('Main', { tab: 'MyTrips' })}
            activeOpacity={0.85}
          >
            <Icon name="directions_bus" size={20} color="#FFFFFF" />
            <Text style={styles.myTripsBtnText}>View in My Trips</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => navigation.navigate('Main')}
            activeOpacity={0.8}
          >
            <Text style={styles.homeBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50 },
  headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, height: 64 },
  headerTitle: { fontSize: FontSize.xl, fontFamily: FontFamily.headlineExtraBold, color: '#FFFFFF', letterSpacing: LetterSpacing.tighter },

  scrollContent: { paddingHorizontal: 24, alignItems: 'center', gap: 20 },

  // Success ring
  successRing: { width: 120, height: 120, borderRadius: 60, backgroundColor: `${Colors.secondary}20`, alignItems: 'center', justifyContent: 'center' },
  successCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.secondary, alignItems: 'center', justifyContent: 'center', shadowColor: Colors.secondary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 8 },
  successTitle: { fontSize: FontSize['3xl'], fontFamily: FontFamily.headlineExtraBold, color: Colors.primary, letterSpacing: LetterSpacing.tighter, textAlign: 'center' },
  successSubtitle: { fontSize: FontSize.md, fontFamily: FontFamily.body, color: Colors.onSurfaceVariant, textAlign: 'center', marginTop: -12 },

  // Email card
  emailCard: { width: '100%', flexDirection: 'row', gap: 16, alignItems: 'flex-start', backgroundColor: `${Colors.secondary}0D`, borderWidth: 1, borderColor: `${Colors.secondary}25`, borderRadius: 16, padding: 18 },
  emailIconBox: { width: 52, height: 52, borderRadius: 12, backgroundColor: `${Colors.secondary}15`, alignItems: 'center', justifyContent: 'center' },
  emailContent: { flex: 1, gap: 3 },
  emailTitle: { fontSize: FontSize.sm, fontFamily: FontFamily.headline, color: Colors.primary },
  emailAddress: { fontSize: FontSize.sm, fontFamily: FontFamily.bodySemiBold, color: Colors.secondary },
  emailNote: { fontSize: FontSize.xs, fontFamily: FontFamily.body, color: Colors.onSurfaceVariant, lineHeight: 17, marginTop: 2 },

  // Booking summary
  bookingCard: { width: '100%', backgroundColor: Colors.surfaceContainerLowest, borderRadius: 16, overflow: 'hidden', shadowColor: Colors.primaryContainer, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.06, shadowRadius: 24, elevation: 4 },
  bookingCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, paddingVertical: 14, backgroundColor: Colors.surfaceContainerLow, borderBottomWidth: 1, borderBottomColor: Colors.surfaceContainerHigh },
  bookingCardTitle: { flex: 1, fontSize: FontSize.sm, fontFamily: FontFamily.headline, color: Colors.primary },
  confirmedBadge: { backgroundColor: `${Colors.secondary}18`, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  confirmedText: { fontSize: 10, fontFamily: FontFamily.bodySemiBold, color: Colors.secondary, letterSpacing: LetterSpacing.wide },

  routeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  cityName: { fontSize: FontSize.xl, fontFamily: FontFamily.headlineExtraBold, color: Colors.primary },
  cityTime: { fontSize: FontSize.sm, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurfaceVariant },
  routeMid: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12 },
  routeLine: { flex: 1, height: 1.5, backgroundColor: Colors.outlineVariant },

  detailsRow: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 0 },
  detailItem: { width: '50%', paddingHorizontal: 20, paddingVertical: 14, borderTopWidth: 1, borderTopColor: Colors.surfaceContainerHigh },
  detailLabel: { fontSize: 10, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: LetterSpacing.widest, marginBottom: 4 },
  detailValue: { fontSize: FontSize.sm, fontFamily: FontFamily.headline, color: Colors.primary },

  // CTA group
  ctaGroup: { width: '100%', gap: 12 },
  tripPromptBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: `${Colors.secondary}0D`, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12 },
  tripPromptText: { flex: 1, fontSize: FontSize.sm, fontFamily: FontFamily.body, color: Colors.onSurfaceVariant, lineHeight: 20 },
  tripPromptBold: { fontFamily: FontFamily.bodySemiBold, color: Colors.secondary },
  myTripsBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: Colors.secondary, borderRadius: 14, paddingVertical: 17, shadowColor: Colors.secondary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  myTripsBtnText: { fontSize: FontSize.md, fontFamily: FontFamily.headline, color: '#FFFFFF' },
  homeBtn: { alignItems: 'center', paddingVertical: 14 },
  homeBtnText: { fontSize: FontSize.sm, fontFamily: FontFamily.bodyMedium, color: Colors.onSurfaceVariant },
});
