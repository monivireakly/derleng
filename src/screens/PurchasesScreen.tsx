import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize, LetterSpacing } from '../theme/typography';
import { Icon } from '../components/Icon';

const PURCHASES = [
  {
    id: 'ORD-10291',
    company: 'Giant Ibis',
    brandColor: '#27AE60',
    route: 'Phnom Penh → Siem Reap',
    date: 'Oct 24, 2023',
    purchasedOn: 'Oct 22, 2023',
    seat: 'A12',
    price: '$15.00',
    status: 'Completed',
    statusColor: Colors.secondary,
  },
  {
    id: 'ORD-10044',
    company: 'Larmo Express',
    brandColor: '#1A3C5E',
    route: 'Siem Reap → Phnom Penh',
    date: 'Oct 28, 2023',
    purchasedOn: 'Oct 25, 2023',
    seat: 'B04',
    price: '$12.00',
    status: 'Upcoming',
    statusColor: Colors.primaryContainer,
  },
  {
    id: 'ORD-09877',
    company: 'Mekong Express',
    brandColor: '#8E44AD',
    route: 'Phnom Penh → Kampot',
    date: 'Sep 14, 2023',
    purchasedOn: 'Sep 12, 2023',
    seat: 'C07',
    price: '$9.00',
    status: 'Completed',
    statusColor: Colors.secondary,
  },
  {
    id: 'ORD-09543',
    company: 'Sorya Bus',
    brandColor: '#C0392B',
    route: 'Phnom Penh → Sihanoukville',
    date: 'Aug 05, 2023',
    purchasedOn: 'Aug 03, 2023',
    seat: 'A02',
    price: '$8.00',
    status: 'Refunded',
    statusColor: Colors.error,
  },
];

const TOTAL_SPENT = PURCHASES
  .filter(p => p.status !== 'Refunded')
  .reduce((sum, p) => sum + parseFloat(p.price.replace('$', '')), 0);

interface PurchasesScreenProps {
  navigation: any;
}

export function PurchasesScreen({ navigation }: PurchasesScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 64 + 20, paddingBottom: 120, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Bookings</Text>
        <Text style={styles.pageSubtitle}>Your complete booking history</Text>

        {/* Spend summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNum}>{PURCHASES.length}</Text>
            <Text style={styles.summaryLabel}>Total Trips</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNum}>${TOTAL_SPENT.toFixed(0)}</Text>
            <Text style={styles.summaryLabel}>Total Spent</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNum}>{PURCHASES.filter(p => p.status === 'Completed').length}</Text>
            <Text style={styles.summaryLabel}>Completed</Text>
          </View>
        </View>

        {/* Purchase list */}
        <View style={styles.list}>
          {PURCHASES.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={styles.purchaseCard}
              activeOpacity={0.92}
              onPress={() => navigation.navigate('TicketSuccess', {
                passengerName: 'Admin User',
                email: 'admin@derleng.com',
                seat: p.seat,
                result: {
                  company: p.company,
                  from: p.route.split(' → ')[0],
                  to: p.route.split(' → ')[1],
                  price: p.price,
                  depTime: '08:30',
                  arrTime: '14:00',
                  duration: '5h 30m',
                },
              })}
            >
              {/* Left color bar */}
              <View style={[styles.colorBar, { backgroundColor: p.brandColor }]} />

              <View style={styles.cardContent}>
                <View style={styles.cardTop}>
                  <View style={styles.companyRow}>
                    <View style={[styles.companyDot, { backgroundColor: p.brandColor + '22', borderColor: p.brandColor + '44' }]}>
                      <Icon name="directions_bus" size={18} color={p.brandColor} />
                    </View>
                    <View>
                      <Text style={styles.companyName}>{p.company}</Text>
                      <Text style={styles.orderId}>Order #{p.id}</Text>
                    </View>
                  </View>
                  <View>
                    <Text style={styles.priceText}>{p.price}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: p.statusColor + '18' }]}>
                      <Text style={[styles.statusText, { color: p.statusColor }]}>{p.status}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.routeRow}>
                  <Icon name="directions_bus" size={14} color={Colors.onSurfaceVariant} />
                  <Text style={styles.routeText}>{p.route}</Text>
                </View>

                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Icon name="calendar-today" size={13} color={Colors.onSurfaceVariant} />
                    <Text style={styles.metaText}>Travel: {p.date}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Icon name="seat" size={13} color={Colors.onSurfaceVariant} />
                    <Text style={styles.metaText}>Seat {p.seat}</Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.purchasedOn}>Purchased {p.purchasedOn}</Text>
                  <View style={styles.viewRow}>
                    <Text style={styles.viewText}>View details</Text>
                    <Icon name="chevron_right" size={16} color={Colors.secondary} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  pageTitle: { fontSize: FontSize['3xl'], fontFamily: FontFamily.headlineExtraBold, color: Colors.primary, letterSpacing: LetterSpacing.tighter },
  pageSubtitle: { fontSize: FontSize.sm, fontFamily: FontFamily.body, color: Colors.onSurfaceVariant, marginTop: 4, marginBottom: 20 },

  summaryCard: { flexDirection: 'row', backgroundColor: Colors.primaryContainer, borderRadius: 16, padding: 20, marginBottom: 24, alignItems: 'center' },
  summaryItem: { flex: 1, alignItems: 'center', gap: 4 },
  summaryNum: { fontSize: FontSize['2xl'], fontFamily: FontFamily.headlineExtraBold, color: Colors.secondaryFixed },
  summaryLabel: { fontSize: 11, fontFamily: FontFamily.bodyMedium, color: Colors.onPrimaryContainer, textTransform: 'uppercase', letterSpacing: LetterSpacing.wide },
  summaryDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.15)' },

  list: { gap: 14 },
  purchaseCard: { flexDirection: 'row', backgroundColor: Colors.surfaceContainerLowest, borderRadius: 14, overflow: 'hidden', shadowColor: Colors.primaryContainer, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2 },
  colorBar: { width: 4 },
  cardContent: { flex: 1, padding: 16, gap: 10 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  companyRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  companyDot: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  companyName: { fontSize: FontSize.sm, fontFamily: FontFamily.headline, color: Colors.primary },
  orderId: { fontSize: FontSize.xs, fontFamily: FontFamily.body, color: Colors.onSurfaceVariant, marginTop: 2 },
  priceText: { fontSize: FontSize.lg, fontFamily: FontFamily.headlineExtraBold, color: Colors.primary, textAlign: 'right' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, marginTop: 4, alignSelf: 'flex-end' },
  statusText: { fontSize: 10, fontFamily: FontFamily.bodySemiBold, textTransform: 'uppercase', letterSpacing: LetterSpacing.tight },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  routeText: { fontSize: FontSize.sm, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurface },
  metaRow: { flexDirection: 'row', gap: 20 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: FontSize.xs, fontFamily: FontFamily.bodyMedium, color: Colors.onSurfaceVariant },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTopWidth: 1, borderTopColor: Colors.surfaceContainerHigh },
  purchasedOn: { fontSize: FontSize.xs, fontFamily: FontFamily.body, color: Colors.onSurfaceVariant },
  viewRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  viewText: { fontSize: FontSize.xs, fontFamily: FontFamily.bodySemiBold, color: Colors.secondary },
});
