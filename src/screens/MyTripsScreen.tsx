import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize, LetterSpacing } from '../theme/typography';
import { Icon } from '../components/Icon';
import { TripsSkeleton } from '../components/Skeleton';

// ─── Data ─────────────────────────────────────────────────────────────────────

const UPCOMING_TRIPS = [
  { id: 'DL-88219', carrier: 'Giant Ibis Transport', route: 'Phnom Penh → Siem Reap', from: 'Phnom Penh', to: 'Siem Reap', date: 'Oct 24, 2023', time: '08:45 AM', arrTime: '02:15 PM', duration: '5h 30m', passenger: 'Moni V.', seat: '12A', class: 'Economy', price: '$12.00', daysAway: 2 },
  { id: 'DL-88450', carrier: 'Larryta Express',      route: 'Siem Reap → Phnom Penh', from: 'Siem Reap', to: 'Phnom Penh', date: 'Oct 28, 2023', time: '02:30 PM', arrTime: '08:00 PM', duration: '5h 30m', passenger: 'Moni V.', seat: '05C', class: 'Economy', price: '$12.00', daysAway: 6 },
];

const PAST_TRIPS = [
  { id: 'DL-77110', carrier: 'Virak Buntham', route: 'Phnom Penh → Sihanoukville', date: 'Sep 12, 2023', status: 'Completed' as const },
  { id: 'DL-77204', carrier: 'Mekong Express', route: 'Siem Reap → Phnom Penh',    date: 'Aug 05, 2023', status: 'Cancelled' as const },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysLabel(n: number): string {
  if (n === 0) return 'Today';
  if (n === 1) return 'Tomorrow';
  return 'In ' + n + ' days';
}

// ─── Screen ───────────────────────────────────────────────────────────────────

interface MyTripsScreenProps { navigation: any; }

export function MyTripsScreen({ navigation }: MyTripsScreenProps) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 64 + 24, paddingBottom: 120, paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>My Trips</Text>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['upcoming', 'past'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'upcoming' ? 'Upcoming' : 'Past'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tripList}>
          {isLoading ? <TripsSkeleton /> : <>

          {/* ── Upcoming ── */}
          {activeTab === 'upcoming' && UPCOMING_TRIPS.map((trip) => (
            <View key={trip.id} style={styles.tripCard}>

              {/* Accent bar */}
              <View style={styles.accentBar} />

              <View style={styles.tripCardBody}>
                {/* Header row */}
                <View style={styles.tripCardHeader}>
                  <View style={styles.tripIconRow}>
                    <View style={styles.tripIcon}>
                      <Icon name="directions_bus" size={20} color={Colors.secondary} />
                    </View>
                    <View style={styles.tripMeta}>
                      <Text style={styles.carrierName} numberOfLines={1}>{trip.carrier}</Text>
                      <Text style={styles.routeText}>{trip.route}</Text>
                    </View>
                  </View>
                  {/* Days-away pill — replaces static "Confirmed" */}
                  <View style={[styles.departurePill, trip.daysAway === 0 && styles.departurePillToday]}>
                    <View style={[styles.departureDot, trip.daysAway === 0 && styles.departureDotToday]} />
                    <Text style={[styles.departureText, trip.daysAway === 0 && styles.departureTextToday]}>
                      {daysLabel(trip.daysAway)}
                    </Text>
                  </View>
                </View>

                {/* Time row */}
                <View style={styles.timeRow}>
                  <View>
                    <Text style={styles.timeValue}>{trip.time}</Text>
                    <Text style={styles.timeCity}>{trip.from}</Text>
                  </View>
                  <View style={styles.timeArc}>
                    <View style={styles.timeLine} />
                    <Icon name="directions_bus" size={14} color={Colors.onSurfaceVariant} />
                    <View style={styles.timeLine} />
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.timeValue}>{trip.arrTime}</Text>
                    <Text style={styles.timeCity}>{trip.to}</Text>
                  </View>
                </View>

                {/* Detail chips */}
                <View style={styles.chipRow}>
                  <View style={styles.chip}>
                    <Icon name="calendar_today" size={13} color={Colors.onSurfaceVariant} />
                    <Text style={styles.chipText}>{trip.date}</Text>
                  </View>
                  <View style={styles.chip}>
                    <Icon name="event_seat" size={13} color={Colors.onSurfaceVariant} />
                    <Text style={styles.chipText}>Seat {trip.seat}</Text>
                  </View>
                </View>
              </View>

              {/* Footer */}
              <View style={styles.tripCardFooter}>
                <Text style={styles.bookingId}>#{trip.id}</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ETicket', { trip })}
                  style={styles.viewTicketBtn}
                  activeOpacity={0.8}
                >
                  <Icon name="confirmation_number" size={14} color={Colors.secondary} />
                  <Text style={styles.viewTicketText}>View Ticket</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* ── Past ── */}
          {!isLoading && activeTab === 'past' && (
            <>
              <Text style={styles.sectionLabel}>Recently Completed</Text>
              {PAST_TRIPS.map((trip) => {
                const isCompleted = trip.status === 'Completed';
                return (
                  <View key={trip.id} style={[styles.tripCard, styles.tripCardPast]}>
                    <View style={[styles.accentBar, isCompleted ? styles.accentBarPast : styles.accentBarCancelled]} />
                    <View style={styles.tripCardBody}>
                      <View style={styles.tripCardHeader}>
                        <View style={styles.tripIconRow}>
                          <View style={[styles.tripIcon, { backgroundColor: Colors.surfaceContainerHigh }]}>
                            <Icon name="directions_bus" size={20} color={Colors.onSurfaceVariant} />
                          </View>
                          <View style={styles.tripMeta}>
                            <Text style={[styles.carrierName, { color: Colors.onSurfaceVariant }]} numberOfLines={1}>
                              {trip.carrier}
                            </Text>
                            <Text style={[styles.routeText, { color: Colors.onSurfaceVariant }]}>{trip.route}</Text>
                          </View>
                        </View>
                        <View style={[styles.pastStatusPill, !isCompleted && styles.pastStatusPillCancelled]}>
                          <Text style={[styles.pastStatusText, !isCompleted && styles.pastStatusTextCancelled]}>
                            {isCompleted ? 'Done' : 'Cancelled'}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.chip}>
                        <Icon name="calendar_today" size={13} color={Colors.onSurfaceVariant} />
                        <Text style={styles.chipText}>{trip.date}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </>
          )}
          </>}
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  pageTitle: { fontSize: FontSize['3xl'], fontFamily: FontFamily.headlineExtraBold, color: Colors.primary, letterSpacing: LetterSpacing.tighter, marginBottom: 24 },

  tabs:          { flexDirection: 'row', backgroundColor: Colors.surfaceContainerLow, borderRadius: 12, padding: 4, marginBottom: 24 },
  tab:           { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  tabActive:     { backgroundColor: Colors.surfaceContainerLowest, shadowColor: Colors.primaryContainer, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  tabText:       { fontSize: FontSize.sm, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurfaceVariant },
  tabTextActive: { color: Colors.primary },

  tripList: { gap: 16 },

  tripCard:     { backgroundColor: Colors.surfaceContainerLowest, borderRadius: 14, overflow: 'hidden', shadowColor: Colors.primaryContainer, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 2 },
  tripCardPast: { opacity: 0.75 },

  accentBar:           { height: 3, backgroundColor: Colors.secondary },
  accentBarPast:       { backgroundColor: Colors.outlineVariant },
  accentBarCancelled:  { backgroundColor: '#D32F2F' },

  tripCardBody:   { padding: 16, gap: 12 },
  tripCardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },

  tripIconRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, minWidth: 0 },
  tripIcon:    { width: 38, height: 38, borderRadius: 8, backgroundColor: Colors.surfaceContainerLow, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  tripMeta:    { flex: 1, minWidth: 0 },
  carrierName: { fontSize: 10, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: LetterSpacing.wide, marginBottom: 2 },
  routeText:   { fontSize: FontSize.md, fontFamily: FontFamily.headline, color: Colors.primary },

  // Departure pill — replaces "Confirmed"
  departurePill:      { flexShrink: 0, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: `${Colors.secondary}15`, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999 },
  departurePillToday: { backgroundColor: `${Colors.secondary}25` },
  departureDot:       { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.secondary },
  departureDotToday:  { backgroundColor: Colors.secondary },
  departureText:      { fontSize: 10, fontFamily: FontFamily.bodySemiBold, color: Colors.secondary, letterSpacing: LetterSpacing.tight },
  departureTextToday: { color: Colors.secondary },

  // Time row
  timeRow:  { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  timeValue:{ fontSize: FontSize.lg, fontFamily: FontFamily.headlineExtraBold, color: Colors.primary },
  timeCity: { fontSize: FontSize.xs, fontFamily: FontFamily.body, color: Colors.onSurfaceVariant, marginTop: 2 },
  timeArc:  { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10 },
  timeLine: { flex: 1, height: 1, backgroundColor: Colors.outlineVariant },

  // Chips
  chipRow:  { flexDirection: 'row', gap: 8 },
  chip:     { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.surfaceContainerLow, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  chipText: { fontSize: FontSize.xs, fontFamily: FontFamily.bodyMedium, color: Colors.onSurfaceVariant },

  // Footer
  tripCardFooter:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: Colors.surfaceContainerLow },
  bookingId:       { fontSize: 11, fontFamily: FontFamily.bodyMedium, color: Colors.onSurfaceVariant, letterSpacing: LetterSpacing.wide },
  viewTicketBtn:   { flexDirection: 'row', alignItems: 'center', gap: 5 },
  viewTicketText:  { fontSize: FontSize.sm, fontFamily: FontFamily.headline, color: Colors.secondary },

  // Past status
  pastStatusPill:          { flexShrink: 0, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999, backgroundColor: Colors.surfaceContainerHigh },
  pastStatusPillCancelled: { backgroundColor: '#FDECEA' },
  pastStatusText:          { fontSize: 10, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurfaceVariant, letterSpacing: LetterSpacing.tight },
  pastStatusTextCancelled: { color: '#C62828' },

  sectionLabel: { fontSize: 11, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: LetterSpacing.widest, marginBottom: 4 },
});
