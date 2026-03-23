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

  // Build the trip object that ETicketScreen expects
  const trip = {
    id:        result?.id        ?? 'DL-88219',
    carrier:   result?.company   ?? 'Bus Operator',
    from:      result?.from      ?? 'Phnom Penh',
    to:        result?.to        ?? 'Siem Reap',
    depTime:   result?.depTime   ?? '08:45 AM',
    arrTime:   result?.arrTime   ?? '02:15 PM',
    duration:  result?.duration  ?? '5h 30m',
    date:      result?.date      ?? 'Oct 24, 2023',
    passenger: passengerName     ?? 'Traveler',
    seat:      seat              ?? '12A',
    class:     result?.class     ?? 'Economy',
    price:     result?.price     ?? '$12.00',
  };

  const goToTicket = () => {
    // Replace so pressing back from E-Ticket returns to Home, not here
    navigation.replace('ETicket', { trip });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
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
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 64 + 40, paddingBottom: insets.bottom + 48 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Celebration */}
        <View style={styles.successRing}>
          <View style={styles.successCircle}>
            <Icon name="check-bold" size={44} color="#FFFFFF" />
          </View>
        </View>
        <Text style={styles.successTitle}>Booking Confirmed!</Text>
        <Text style={styles.successSubtitle}>Your trip has been successfully booked.</Text>

        {/* Email notice */}
        <View style={styles.emailCard}>
          <View style={styles.emailIconBox}>
            <Icon name="mark-email-read" size={26} color={Colors.secondary} />
          </View>
          <View style={styles.emailContent}>
            <Text style={styles.emailTitle}>Confirmation email sent</Text>
            <Text style={styles.emailAddress}>{email ?? 'your email address'}</Text>
            <Text style={styles.emailNote}>Your e-ticket is attached to the email.</Text>
          </View>
        </View>

        {/* Compact trip strip */}
        <View style={styles.tripStrip}>
          <View style={styles.tripStripLeft}>
            <View style={styles.tripStripIcon}>
              <Icon name="directions_bus" size={16} color={Colors.secondary} />
            </View>
            <View style={styles.tripStripInfo}>
              <Text style={styles.tripStripCarrier} numberOfLines={1}>{trip.carrier}</Text>
              <Text style={styles.tripStripRoute}>{trip.from} → {trip.to}</Text>
              <Text style={styles.tripStripMeta}>{trip.date} · {trip.depTime}</Text>
            </View>
          </View>
          <Text style={styles.tripStripPrice}>{trip.price}</Text>
        </View>

        {/* CTAs */}
        <View style={styles.ctaGroup}>
          <TouchableOpacity style={styles.ticketBtn} onPress={goToTicket} activeOpacity={0.85}>
            <Icon name="confirmation_number" size={20} color="#FFFFFF" />
            <Text style={styles.ticketBtnText}>View E-Ticket</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('Main')} activeOpacity={0.8}>
            <Text style={styles.homeBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },

  header:      { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50 },
  headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, height: 64 },
  headerTitle: { fontSize: FontSize.xl, fontFamily: FontFamily.headlineExtraBold, color: '#FFFFFF', letterSpacing: LetterSpacing.tighter },

  scroll: { paddingHorizontal: 24, alignItems: 'center', gap: 20 },

  // Celebration
  successRing:    { width: 120, height: 120, borderRadius: 60, backgroundColor: `${Colors.secondary}20`, alignItems: 'center', justifyContent: 'center' },
  successCircle:  { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.secondary, alignItems: 'center', justifyContent: 'center', shadowColor: Colors.secondary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 8 },
  successTitle:   { fontSize: FontSize['3xl'], fontFamily: FontFamily.headlineExtraBold, color: Colors.primary, letterSpacing: LetterSpacing.tighter, textAlign: 'center' },
  successSubtitle:{ fontSize: FontSize.md, fontFamily: FontFamily.body, color: Colors.onSurfaceVariant, textAlign: 'center', marginTop: -12 },

  // Email card
  emailCard:    { width: '100%', flexDirection: 'row', gap: 14, alignItems: 'flex-start', backgroundColor: `${Colors.secondary}0D`, borderWidth: 1, borderColor: `${Colors.secondary}25`, borderRadius: 16, padding: 16 },
  emailIconBox: { width: 46, height: 46, borderRadius: 10, backgroundColor: `${Colors.secondary}15`, alignItems: 'center', justifyContent: 'center' },
  emailContent: { flex: 1, gap: 2 },
  emailTitle:   { fontSize: FontSize.sm, fontFamily: FontFamily.headline, color: Colors.primary },
  emailAddress: { fontSize: FontSize.sm, fontFamily: FontFamily.bodySemiBold, color: Colors.secondary },
  emailNote:    { fontSize: FontSize.xs, fontFamily: FontFamily.body, color: Colors.onSurfaceVariant, marginTop: 2 },

  // Trip strip — compact, non-redundant summary
  tripStrip:       { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.surfaceContainerLowest, borderRadius: 14, padding: 16, shadowColor: Colors.primaryContainer, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 16, elevation: 2 },
  tripStripLeft:   { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, minWidth: 0 },
  tripStripIcon:   { width: 36, height: 36, borderRadius: 8, backgroundColor: Colors.surfaceContainerLow, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  tripStripInfo:   { flex: 1, minWidth: 0, gap: 2 },
  tripStripCarrier:{ fontSize: 10, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: LetterSpacing.wide },
  tripStripRoute:  { fontSize: FontSize.md, fontFamily: FontFamily.headline, color: Colors.primary },
  tripStripMeta:   { fontSize: FontSize.xs, fontFamily: FontFamily.body, color: Colors.onSurfaceVariant },
  tripStripPrice:  { fontSize: FontSize.lg, fontFamily: FontFamily.headlineExtraBold, color: Colors.secondary, marginLeft: 12 },

  // CTAs
  ctaGroup:      { width: '100%', gap: 10, marginTop: 4 },
  ticketBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: Colors.secondary, borderRadius: 14, paddingVertical: 17, shadowColor: Colors.secondary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  ticketBtnText: { fontSize: FontSize.md, fontFamily: FontFamily.headline, color: '#FFFFFF' },
  homeBtn:       { alignItems: 'center', paddingVertical: 14 },
  homeBtnText:   { fontSize: FontSize.sm, fontFamily: FontFamily.bodyMedium, color: Colors.onSurfaceVariant },
});
