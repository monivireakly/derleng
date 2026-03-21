import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize, LetterSpacing } from '../theme/typography';
import { Icon } from '../components/Icon';

const PAYMENT_METHODS = [
  { key: 'aba', label: 'ABA Pay', subtitle: 'Instant confirmation', icon: 'account_balance' },
  { key: 'card', label: 'Credit / Debit Card', subtitle: 'Visa, Mastercard', icon: 'credit_card' },
  { key: 'cash', label: 'Cash on Board', subtitle: 'Pay driver directly', icon: 'payments' },
];

interface CheckoutScreenProps {
  navigation: any;
  route: any;
}

export function CheckoutScreen({ navigation, route }: CheckoutScreenProps) {
  const insets = useSafeAreaInsets();
  const [selectedPayment, setSelectedPayment] = useState('aba');
  const result = route?.params?.result ?? { company: 'Vireak Buntham', price: '$14.50', depTime: '08:30 AM', arrTime: '02:30 PM' };

  return (
    <View style={styles.container}>
      {/* VET-branded header */}
      <View style={[styles.topBar, { paddingTop: insets.top }]}>
        <View style={styles.topBarInner}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Icon name="arrow_back" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>{result.company ?? 'Vireak Buntham'}</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Icon name="help_outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 64 + 24, paddingBottom: 120, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Finalize Your Trip</Text>
        <Text style={styles.pageSubtitle}>Complete your payment to secure your seat from Phnom Penh to Siem Reap.</Text>

        {/* Booking Summary */}
        <View style={styles.bookingCard}>
          <View style={styles.bookingHeader}>
            <View>
              <Text style={styles.fieldLabel}>Route</Text>
              <Text style={styles.routeText}>
                Phnom Penh <Text style={{ color: Colors.vetBrand }}>→</Text> Siem Reap
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.fieldLabel}>Date</Text>
              <Text style={styles.fieldValue}>Oct 24, 2023</Text>
            </View>
          </View>

          <View style={styles.timeGrid}>
            <View>
              <Text style={styles.fieldLabel}>Departure</Text>
              <Text style={styles.timeText}>{result.depTime ?? '08:30 AM'}</Text>
              <Text style={styles.stationText}>Central Station</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.fieldLabel}>Arrival</Text>
              <Text style={styles.timeText}>{result.arrTime ?? '02:30 PM'}</Text>
              <Text style={styles.stationText}>VET Siem Reap Hub</Text>
            </View>
          </View>

          <View style={styles.dashedDivider} />

          <View style={styles.totalRow}>
            <View>
              <Text style={styles.fieldLabel}>Passenger</Text>
              <Text style={styles.fieldValue}>1 Adult (Seat 12A)</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.fieldLabel}>Total Amount</Text>
              <Text style={styles.totalPrice}>{result.price ?? '$14.50'}</Text>
            </View>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentCard}>
          <Text style={styles.paymentTitle}>Select Payment Method</Text>
          <View style={styles.paymentList}>
            {PAYMENT_METHODS.map((method) => {
              const isSelected = selectedPayment === method.key;
              return (
                <TouchableOpacity
                  key={method.key}
                  style={[styles.paymentRow, isSelected && styles.paymentRowSelected]}
                  onPress={() => setSelectedPayment(method.key)}
                  activeOpacity={0.8}
                >
                  <View style={styles.paymentIconBox}>
                    <Icon name={method.icon} size={22} color={isSelected ? Colors.secondary : Colors.onSurfaceVariant} />
                  </View>
                  <View style={styles.paymentInfo}>
                    <Text style={styles.paymentLabel}>{method.label}</Text>
                    <Text style={styles.paymentSubtitle}>{method.subtitle}</Text>
                  </View>
                  {isSelected && <Icon name="check_circle" size={22} color={Colors.secondary} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Confirm CTA */}
      <View style={[styles.ctaBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={styles.confirmBtn} onPress={() => navigation.navigate('Redirecting')} activeOpacity={0.85}>
          <Text style={styles.confirmText}>Confirm & Pay {result.price ?? '$14.50'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  topBar: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50, backgroundColor: Colors.vetBrand, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  topBarInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, height: 64 },
  topBarTitle: { fontSize: FontSize.lg, fontFamily: FontFamily.headlineExtraBold, color: Colors.primary, letterSpacing: LetterSpacing.tight },
  pageTitle: { fontSize: FontSize['2xl'], fontFamily: FontFamily.headlineExtraBold, color: Colors.primary, letterSpacing: LetterSpacing.tighter, marginBottom: 8 },
  pageSubtitle: { fontSize: FontSize.sm, fontFamily: FontFamily.body, color: Colors.onSurfaceVariant, marginBottom: 24, lineHeight: 20 },
  bookingCard: { backgroundColor: Colors.surfaceContainerLowest, borderRadius: 12, padding: 24, borderLeftWidth: 4, borderLeftColor: Colors.vetBrand, shadowColor: Colors.primaryContainer, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, marginBottom: 16 },
  bookingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  fieldLabel: { fontSize: 10, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: LetterSpacing.widest, marginBottom: 4 },
  routeText: { fontSize: FontSize.xl, fontFamily: FontFamily.headline, color: Colors.primary },
  fieldValue: { fontSize: FontSize.sm, fontFamily: FontFamily.bodySemiBold, color: Colors.primary },
  timeGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  timeText: { fontSize: FontSize.lg, fontFamily: FontFamily.headline, color: Colors.primary },
  stationText: { fontSize: FontSize.xs, fontFamily: FontFamily.body, color: Colors.onSurfaceVariant, marginTop: 2 },
  dashedDivider: { height: 1, borderStyle: 'dashed', borderWidth: 1, borderColor: Colors.surfaceContainerHigh, marginBottom: 24 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalPrice: { fontSize: FontSize['2xl'], fontFamily: FontFamily.headlineExtraBold, color: Colors.secondary },
  paymentCard: { backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 12, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', marginBottom: 24 },
  paymentTitle: { fontSize: FontSize.sm, fontFamily: FontFamily.headline, color: Colors.primary, marginBottom: 16 },
  paymentList: { gap: 12 },
  paymentRow: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: Colors.surfaceContainerLowest, borderRadius: 8, gap: 16, opacity: 0.85 },
  paymentRowSelected: { opacity: 1, borderWidth: 2, borderColor: Colors.secondary },
  paymentIconBox: { width: 40, height: 40, backgroundColor: Colors.surfaceContainer, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  paymentInfo: { flex: 1 },
  paymentLabel: { fontSize: FontSize.sm, fontFamily: FontFamily.headline, color: Colors.primary },
  paymentSubtitle: { fontSize: FontSize.xs, fontFamily: FontFamily.body, color: Colors.onSurfaceVariant, fontStyle: 'italic' },
  ctaBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.surfaceContainerLowest, paddingHorizontal: 24, paddingTop: 16, shadowColor: Colors.primaryContainer, shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 8 },
  confirmBtn: { backgroundColor: Colors.secondary, borderRadius: 12, paddingVertical: 18, alignItems: 'center', shadowColor: Colors.secondary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  confirmText: { fontSize: FontSize.md, fontFamily: FontFamily.headline, color: '#FFFFFF', letterSpacing: LetterSpacing.tight },
});
