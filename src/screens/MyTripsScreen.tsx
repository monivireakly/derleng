import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize, LetterSpacing } from '../theme/typography';
import { Icon } from '../components/Icon';

const UPCOMING_TRIPS = [
  { id: 'DL-88219', carrier: 'Giant Ibis Transport', route: 'Phnom Penh → Siem Reap', date: 'Oct 24, 2023', time: '08:45 AM', status: 'Confirmed' },
  { id: 'DL-88450', carrier: 'Larryta Express', route: 'Siem Reap → Phnom Penh', date: 'Oct 28, 2023', time: '02:30 PM', status: 'Confirmed' },
];

const PAST_TRIPS = [
  { id: 'DL-77110', carrier: 'Virak Buntham', route: 'Phnom Penh → Sihanoukville', date: 'Sep 12, 2023', status: 'Completed' },
  { id: 'DL-77204', carrier: 'Mekong Express', route: 'Siem Reap → Phnom Penh', date: 'Aug 05, 2023', status: 'Cancelled' },
];

interface MyTripsScreenProps {
  navigation: any;
}

export function MyTripsScreen({ navigation }: MyTripsScreenProps) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 64 + 24, paddingBottom: 120, paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>My Trips</Text>

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
          {activeTab === 'upcoming' ? (
            UPCOMING_TRIPS.map((trip) => (
              <View key={trip.id} style={styles.tripCard}>
                <View style={styles.tripCardBody}>
                  <View style={styles.tripCardHeader}>
                    <View style={styles.tripIconRow}>
                      <View style={styles.tripIcon}>
                        <Icon name="directions_bus" size={22} color={Colors.secondary} />
                      </View>
                      <View>
                        <Text style={styles.carrierName}>{trip.carrier}</Text>
                        <Text style={styles.routeText}>{trip.route}</Text>
                      </View>
                    </View>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>{trip.status}</Text>
                    </View>
                  </View>
                  <View style={styles.tripMeta}>
                    <View style={styles.metaItem}>
                      <Icon name="calendar_today" size={16} color={Colors.onSurfaceVariant} />
                      <Text style={styles.metaText}>{trip.date}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Icon name="schedule" size={16} color={Colors.onSurfaceVariant} />
                      <Text style={styles.metaText}>{trip.time}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.tripCardFooter}>
                  <Text style={styles.bookingId}>Booking ID: #{trip.id}</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('TicketSuccess')}>
                    <Text style={styles.viewTicketBtn}>View Ticket</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <>
              <Text style={styles.sectionLabel}>Recently Completed</Text>
              {PAST_TRIPS.map((trip) => (
                <View key={trip.id} style={[styles.tripCard, styles.tripCardPast]}>
                  <View style={styles.tripCardBody}>
                    <View style={styles.tripCardHeader}>
                      <View style={styles.tripIconRow}>
                        <View style={[styles.tripIcon, { backgroundColor: Colors.surfaceContainerHighest }]}>
                          <Icon name="directions_bus" size={22} color={Colors.onSurfaceVariant} />
                        </View>
                        <View>
                          <Text style={[styles.carrierName, { color: Colors.onSurfaceVariant }]}>{trip.carrier}</Text>
                          <Text style={[styles.routeText, { color: Colors.onSurfaceVariant }]}>{trip.route}</Text>
                        </View>
                      </View>
                      <View style={[styles.statusBadge, styles.statusBadgePast]}>
                        <Text style={[styles.statusText, styles.statusTextPast]}>{trip.status}</Text>
                      </View>
                    </View>
                    <View style={styles.metaItem}>
                      <Icon name="event" size={16} color={Colors.onSurfaceVariant} />
                      <Text style={styles.metaText}>{trip.date}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  pageTitle: { fontSize: FontSize['3xl'], fontFamily: FontFamily.headlineExtraBold, color: Colors.primary, letterSpacing: LetterSpacing.tighter, marginBottom: 24 },
  tabs: { flexDirection: 'row', backgroundColor: Colors.surfaceContainer, borderRadius: 12, padding: 4, marginBottom: 24 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  tabActive: { backgroundColor: Colors.surfaceContainerLowest, shadowColor: Colors.primaryContainer, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: FontSize.sm, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurfaceVariant },
  tabTextActive: { color: Colors.primary },
  tripList: { gap: 20 },
  tripCard: { backgroundColor: Colors.surfaceContainerLowest, borderRadius: 12, overflow: 'hidden', shadowColor: Colors.primaryContainer, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 20, elevation: 2 },
  tripCardPast: { opacity: 0.8 },
  tripCardBody: { padding: 20 },
  tripCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  tripIconRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  tripIcon: { width: 40, height: 40, borderRadius: 8, backgroundColor: Colors.surfaceContainer, alignItems: 'center', justifyContent: 'center' },
  carrierName: { fontSize: 11, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: LetterSpacing.wide, marginBottom: 2 },
  routeText: { fontSize: FontSize.lg, fontFamily: FontFamily.headline, color: Colors.primary },
  statusBadge: { backgroundColor: `${Colors.secondary}1A`, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999 },
  statusBadgePast: { backgroundColor: `${Colors.outlineVariant}33` },
  statusText: { fontSize: 11, fontFamily: FontFamily.bodySemiBold, color: Colors.secondary, textTransform: 'uppercase', letterSpacing: LetterSpacing.tight },
  statusTextPast: { color: Colors.onSurfaceVariant },
  tripMeta: { flexDirection: 'row', gap: 24, paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: `${Colors.outlineVariant}33` },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: { fontSize: FontSize.sm, fontFamily: FontFamily.bodyMedium, color: Colors.onSurface },
  tripCardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: Colors.surfaceContainerHigh },
  bookingId: { fontSize: 12, fontFamily: FontFamily.bodyMedium, color: Colors.onSurfaceVariant },
  viewTicketBtn: { fontSize: FontSize.sm, fontFamily: FontFamily.headline, color: Colors.secondary },
  sectionLabel: { fontSize: 12, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: LetterSpacing.widest, marginBottom: 8, marginTop: 8 },
});
