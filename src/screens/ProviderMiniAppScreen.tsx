import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize, LetterSpacing } from '../theme/typography';
import { Icon } from '../components/Icon';

type Step = 'passenger' | 'payment';

const PAYMENT_METHODS = [
  { key: 'aba',  label: 'ABA Pay',           subtitle: 'Instant scan & pay',    icon: 'account-balance' },
  { key: 'card', label: 'Credit / Debit Card', subtitle: 'Visa · Mastercard',   icon: 'credit-card' },
  { key: 'wing', label: 'Wing Money',          subtitle: 'Mobile wallet',        icon: 'payment' },
];

const SEATS = ['12A', '12B', '13A', '13B', '14A', '14B', '15A', '15B', '16A', '16B'];

const PROVIDER_BRANDS: Record<string, { primary: string; accent: string; textColor: string }> = {
  'Larmo Express':  { primary: '#1A3C5E', accent: '#2980B9', textColor: '#FFFFFF' },
  'Sorya Bus':      { primary: '#C0392B', accent: '#E74C3C', textColor: '#FFFFFF' },
  'Giant Ibis':     { primary: '#27AE60', accent: '#2ECC71', textColor: '#FFFFFF' },
  'Mekong Express': { primary: '#8E44AD', accent: '#9B59B6', textColor: '#FFFFFF' },
};
const DEFAULT_BRAND = { primary: Colors.primaryContainer, accent: '#2D5986', textColor: '#FFFFFF' };

const PRICE_LOCK_SECONDS = 20 * 60; // 20 minutes

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

interface ProviderMiniAppScreenProps {
  navigation: any;
  route: any;
}

export function ProviderMiniAppScreen({ navigation, route }: ProviderMiniAppScreenProps) {
  const insets = useSafeAreaInsets();
  const result = route?.params?.result ?? {};
  const brand = PROVIDER_BRANDS[result.company] ?? DEFAULT_BRAND;

  const [step, setStep] = useState<Step>('passenger');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [phone, setPhone]         = useState('');
  const [selectedSeat, setSelectedSeat]       = useState('12A');
  const [selectedPayment, setSelectedPayment] = useState('aba');
  const [processing, setProcessing] = useState(false);
  const [fieldError, setFieldError] = useState('');

  // 20-minute price lock countdown
  const [timeLeft, setTimeLeft] = useState(PRICE_LOCK_SECONDS);

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(id); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const timerExpired = timeLeft === 0;
  const timerUrgent  = timeLeft <= 300; // last 5 minutes

  const validatePassenger = () => {
    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      setFieldError('Please fill in all required fields.');
      return false;
    }
    setFieldError('');
    return true;
  };

  const handlePay = () => {
    if (timerExpired) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      navigation.replace('TicketSuccess', {
        passengerName: `${firstName} ${lastName}`,
        seat: selectedSeat,
        result,
      });
    }, 1800);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Provider-branded header */}
      <View style={[styles.header, { backgroundColor: brand.primary, paddingTop: insets.top }]}>
        <View style={styles.headerInner}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backBtn}>
            <Icon name="arrow_back" size={22} color={brand.textColor} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <View style={[styles.providerBadge, { backgroundColor: brand.accent }]}>
              <Icon name="directions_bus" size={16} color={brand.textColor} />
            </View>
            <Text style={[styles.providerName, { color: brand.textColor }]}>{result.company ?? 'Provider'}</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Route summary strip */}
        <View style={styles.routeStrip}>
          <Text style={[styles.stripCity, { color: brand.textColor }]}>{result.from ?? 'Phnom Penh'}</Text>
          <View style={styles.stripMiddle}>
            <View style={[styles.stripLine, { backgroundColor: brand.textColor + '40' }]} />
            <Icon name="directions_bus" size={14} color={brand.textColor + 'AA'} />
            <View style={[styles.stripLine, { backgroundColor: brand.textColor + '40' }]} />
          </View>
          <Text style={[styles.stripCity, { color: brand.textColor }]}>{result.to ?? 'Siem Reap'}</Text>
        </View>
        <View style={styles.tripMeta}>
          <Text style={[styles.tripMetaText, { color: brand.textColor + 'CC' }]}>
            {result.depTime ?? '08:30'} → {result.arrTime ?? '14:00'} · {result.duration ?? '5h 30m'}
          </Text>
          <Text style={[styles.tripMetaPrice, { color: brand.textColor }]}>{result.price ?? '$12'}</Text>
        </View>

        {/* Price lock timer */}
        <View style={[styles.priceLockBar, { backgroundColor: timerUrgent ? 'rgba(220,53,69,0.25)' : 'rgba(0,0,0,0.2)' }]}>
          <Icon name="lock" size={13} color={timerUrgent ? '#FF8A8A' : brand.textColor + 'CC'} />
          <Text style={[styles.priceLockLabel, { color: timerUrgent ? '#FF8A8A' : brand.textColor + 'BB' }]}>
            {timerExpired ? 'Price expired — please search again' : 'Price locked for'}
          </Text>
          {!timerExpired && (
            <Text style={[styles.priceLockTimer, { color: timerUrgent ? '#FF6B6B' : brand.textColor }]}>
              {formatTime(timeLeft)}
            </Text>
          )}
        </View>
      </View>

      {/* Step indicator */}
      <View style={styles.stepBar}>
        {(['passenger', 'payment'] as Step[]).map((s, i) => (
          <View key={s} style={styles.stepItem}>
            <View style={[styles.stepCircle, step === s && styles.stepCircleActive, i === 0 && step === 'payment' && styles.stepCircleDone]}>
              {i === 0 && step === 'payment'
                ? <Icon name="done" size={14} color="#FFFFFF" />
                : <Text style={[styles.stepNum, step === s && styles.stepNumActive]}>{i + 1}</Text>
              }
            </View>
            <Text style={[styles.stepLabel, step === s && styles.stepLabelActive]}>
              {s === 'passenger' ? 'Passenger' : 'Payment'}
            </Text>
            {i === 0 && <View style={[styles.stepConnector, step === 'payment' && styles.stepConnectorDone]} />}
          </View>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {step === 'passenger' ? (
          <>
            {!!fieldError && (
              <View style={styles.errorBanner}>
                <Icon name="info" size={15} color={Colors.error} />
                <Text style={styles.errorText}>{fieldError}</Text>
              </View>
            )}

            {/* — Passenger Details — */}
            <View style={styles.formSection}>
              <View style={styles.formSectionHeader}>
                <Icon name="person" size={16} color={brand.primary} />
                <Text style={styles.formSectionTitle}>Passenger Details</Text>
              </View>

              <View style={styles.fieldRow}>
                <View style={[styles.fieldGroup, { flex: 1 }]}>
                  <Text style={styles.fieldLabel}>First Name <Text style={styles.required}>*</Text></Text>
                  <View style={styles.inputBox}>
                    <TextInput style={styles.input} value={firstName} onChangeText={setFirstName}
                      placeholder="e.g. Dara" placeholderTextColor={Colors.onSurfaceVariant} autoCapitalize="words" />
                  </View>
                </View>
                <View style={[styles.fieldGroup, { flex: 1 }]}>
                  <Text style={styles.fieldLabel}>Last Name <Text style={styles.required}>*</Text></Text>
                  <View style={styles.inputBox}>
                    <TextInput style={styles.input} value={lastName} onChangeText={setLastName}
                      placeholder="e.g. Sokha" placeholderTextColor={Colors.onSurfaceVariant} autoCapitalize="words" />
                  </View>
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Phone Number <Text style={styles.required}>*</Text></Text>
                <View style={styles.inputBox}>
                  <Text style={styles.phonePre}>🇰🇭 +855</Text>
                  <View style={styles.inputDivider} />
                  <TextInput style={styles.input} value={phone} onChangeText={setPhone}
                    placeholder="12 345 678" placeholderTextColor={Colors.onSurfaceVariant} keyboardType="phone-pad" />
                </View>
              </View>
            </View>

            {/* — Seat Selection — */}
            <View style={styles.formSection}>
              <View style={styles.formSectionHeader}>
                <Icon name="seat" size={16} color={brand.primary} />
                <Text style={styles.formSectionTitle}>Seat Selection</Text>
              </View>

              <View style={styles.seatMapLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: Colors.surfaceContainerHigh }]} />
                  <Text style={styles.legendText}>Available</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: brand.primary }]} />
                  <Text style={styles.legendText}>Selected</Text>
                </View>
              </View>
              <View style={styles.seatGrid}>
                {SEATS.map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.seatBtn, selectedSeat === s && { backgroundColor: brand.primary, borderColor: brand.primary }]}
                    onPress={() => setSelectedSeat(s)}
                    activeOpacity={0.75}
                  >
                    <Icon name="seat" size={18} color={selectedSeat === s ? '#FFFFFF' : Colors.onSurfaceVariant} />
                    <Text style={[styles.seatLabel, selectedSeat === s && styles.seatLabelActive]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Policy note */}
            <View style={styles.policyNote}>
              <Icon name="info" size={14} color={Colors.onSurfaceVariant} />
              <Text style={styles.policyText}>
                Ticket is <Text style={styles.policyBold}>non-refundable</Text> and valid only for the selected date and route.
              </Text>
            </View>
          </>
        ) : (
          <>
            {/* Booking summary */}
            <View style={[styles.summaryCard, { borderLeftColor: brand.primary }]}>
              <Text style={styles.summaryTitle}>Booking Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Passenger</Text>
                <Text style={styles.summaryVal}>{firstName} {lastName}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Route</Text>
                <Text style={styles.summaryVal}>{result.from} → {result.to}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Departure</Text>
                <Text style={styles.summaryVal}>{result.depTime}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Seat</Text>
                <Text style={styles.summaryVal}>{selectedSeat}</Text>
              </View>
              <View style={[styles.summaryRow, { marginTop: 8 }]}>
                <Text style={styles.summaryKey}>Total</Text>
                <Text style={[styles.summaryTotal, { color: brand.primary }]}>{result.price}</Text>
              </View>
            </View>

            {timerUrgent && !timerExpired && (
              <View style={styles.urgentBanner}>
                <Icon name="schedule" size={16} color="#C0392B" />
                <Text style={styles.urgentText}>Price expires in <Text style={styles.urgentBold}>{formatTime(timeLeft)}</Text> — complete payment now</Text>
              </View>
            )}

            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={styles.paymentList}>
              {PAYMENT_METHODS.map((m) => {
                const isSelected = selectedPayment === m.key;
                return (
                  <TouchableOpacity
                    key={m.key}
                    style={[styles.paymentRow, isSelected && { borderColor: brand.primary, borderWidth: 2 }]}
                    onPress={() => setSelectedPayment(m.key)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.payIconBox, isSelected && { backgroundColor: brand.primary + '18' }]}>
                      <Icon name={m.icon} size={22} color={isSelected ? brand.primary : Colors.onSurfaceVariant} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.payLabel}>{m.label}</Text>
                      <Text style={styles.paySubtitle}>{m.subtitle}</Text>
                    </View>
                    {isSelected && <Icon name="check-circle" size={22} color={brand.primary} />}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.secureNote}>
              <Icon name="lock" size={14} color={Colors.onSurfaceVariant} />
              <Text style={styles.secureText}>Your payment is secured with 256-bit SSL encryption</Text>
            </View>
          </>
        )}
      </ScrollView>

      {/* CTA bar */}
      <View style={[styles.ctaBar, { paddingBottom: Math.max(insets.bottom, 16), backgroundColor: brand.primary }]}>
        {step === 'passenger' ? (
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => { if (validatePassenger()) setStep('payment'); }}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaBtnText}>Continue to Payment</Text>
            <Icon name="arrow_forward" size={20} color={brand.primary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.ctaBtn, (processing || timerExpired) && { opacity: 0.6 }]}
            onPress={handlePay}
            activeOpacity={0.85}
            disabled={processing || timerExpired}
          >
            <Text style={styles.ctaBtnText}>
              {timerExpired ? 'Price Expired' : processing ? 'Processing payment…' : `Pay ${result.price ?? '$12'} Now`}
            </Text>
            {!processing && !timerExpired && <Icon name="lock" size={18} color={brand.primary} />}
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },

  // Header
  header: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 64 },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  providerBadge: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  providerName: { fontSize: FontSize.lg, fontFamily: FontFamily.headlineExtraBold, letterSpacing: LetterSpacing.tight },
  routeStrip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingTop: 4, paddingBottom: 4, gap: 8 },
  stripCity: { fontSize: FontSize.md, fontFamily: FontFamily.headline, letterSpacing: LetterSpacing.tight },
  stripMiddle: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4 },
  stripLine: { flex: 1, height: 1 },
  tripMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingBottom: 10 },
  tripMetaText: { fontSize: 12, fontFamily: FontFamily.bodyMedium },
  tripMetaPrice: { fontSize: FontSize.xl, fontFamily: FontFamily.headlineExtraBold },

  // Price lock timer
  priceLockBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 20 },
  priceLockLabel: { fontSize: 12, fontFamily: FontFamily.bodyMedium },
  priceLockTimer: { fontSize: 13, fontFamily: FontFamily.headlineExtraBold, letterSpacing: 0.5 },

  // Steps
  stepBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, paddingHorizontal: 40, backgroundColor: Colors.surfaceContainerLowest, gap: 0 },
  stepItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center' },
  stepCircleActive: { backgroundColor: Colors.secondary },
  stepCircleDone: { backgroundColor: Colors.secondary },
  stepNum: { fontSize: 12, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurfaceVariant },
  stepNumActive: { color: '#FFFFFF' },
  stepLabel: { fontSize: 12, fontFamily: FontFamily.bodyMedium, color: Colors.onSurfaceVariant },
  stepLabelActive: { fontFamily: FontFamily.bodySemiBold, color: Colors.secondary },
  stepConnector: { width: 48, height: 2, backgroundColor: Colors.surfaceContainerHigh, marginHorizontal: 8 },
  stepConnectorDone: { backgroundColor: Colors.secondary },

  // Scroll
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, gap: 16 },
  sectionTitle: { fontSize: FontSize.lg, fontFamily: FontFamily.headline, color: Colors.primary, letterSpacing: LetterSpacing.tight },

  // Form sections
  formSection: { backgroundColor: Colors.surfaceContainerLowest, borderRadius: 16, padding: 18, gap: 16, shadowColor: Colors.primaryContainer, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  formSectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  formSectionTitle: { fontSize: FontSize.base, fontFamily: FontFamily.headline, color: Colors.primary },

  // Error
  errorBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: `${Colors.error}12`, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 },
  errorText: { flex: 1, fontSize: FontSize.sm, fontFamily: FontFamily.bodyMedium, color: Colors.error },

  // Fields
  fieldRow: { flexDirection: 'row', gap: 12 },
  fieldGroup: { gap: 7 },
  fieldLabel: { fontSize: 11, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: LetterSpacing.wide },
  required: { color: Colors.error },
  fieldHint: { fontSize: FontSize.xs, fontFamily: FontFamily.body, color: Colors.onSurfaceVariant, marginTop: 2 },
  inputBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.surfaceContainerLow, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13 },
  input: { flex: 1, fontSize: FontSize.base, fontFamily: FontFamily.body, color: Colors.onSurface, padding: 0 },
  phonePre: { fontSize: FontSize.base, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurface },
  inputDivider: { width: 1, height: 20, backgroundColor: Colors.outlineVariant },

  // Gender
  genderRow: { flexDirection: 'row', gap: 12 },
  genderBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 12, backgroundColor: Colors.surfaceContainerLow, borderWidth: 1, borderColor: Colors.outlineVariant },
  genderLabel: { fontSize: FontSize.sm, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurfaceVariant },
  genderLabelActive: { color: '#FFFFFF' },

  // Nationality chips
  nationalityRow: { gap: 8, paddingVertical: 2 },
  nationalityChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.surfaceContainerLow, borderWidth: 1, borderColor: Colors.outlineVariant },
  nationalityText: { fontSize: FontSize.sm, fontFamily: FontFamily.bodyMedium, color: Colors.onSurfaceVariant },
  nationalityTextActive: { color: '#FFFFFF', fontFamily: FontFamily.bodySemiBold },

  // Seat
  seatMap: { gap: 12 },
  seatMapLegend: { flexDirection: 'row', gap: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: FontSize.xs, fontFamily: FontFamily.bodyMedium, color: Colors.onSurfaceVariant },
  seatGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  seatBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, backgroundColor: Colors.surfaceContainerHigh, borderWidth: 1, borderColor: 'transparent' },
  seatLabel: { fontSize: FontSize.sm, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurfaceVariant },
  seatLabelActive: { color: '#FFFFFF' },

  // Policy note
  policyNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: Colors.surfaceContainerLow, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12 },
  policyText: { flex: 1, fontSize: FontSize.xs, fontFamily: FontFamily.body, color: Colors.onSurfaceVariant, lineHeight: 18 },
  policyBold: { fontFamily: FontFamily.bodySemiBold, color: Colors.onSurface },

  // Summary card
  summaryCard: { backgroundColor: Colors.surfaceContainerLowest, borderRadius: 12, padding: 20, borderLeftWidth: 4, gap: 10, shadowColor: Colors.primaryContainer, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  summaryTitle: { fontSize: FontSize.sm, fontFamily: FontFamily.headline, color: Colors.onSurfaceVariant, marginBottom: 4 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryKey: { fontSize: FontSize.sm, fontFamily: FontFamily.body, color: Colors.onSurfaceVariant },
  summaryVal: { fontSize: FontSize.sm, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurface },
  summaryTotal: { fontSize: FontSize['2xl'], fontFamily: FontFamily.headlineExtraBold },

  // Urgent banner
  urgentBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FDF0F0', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: '#F5C6C6' },
  urgentText: { flex: 1, fontSize: FontSize.sm, fontFamily: FontFamily.bodyMedium, color: '#C0392B' },
  urgentBold: { fontFamily: FontFamily.headline },

  // Payment
  paymentList: { gap: 12 },
  paymentRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, backgroundColor: Colors.surfaceContainerLowest, borderRadius: 12, borderWidth: 1, borderColor: Colors.surfaceContainerHigh },
  payIconBox: { width: 44, height: 44, borderRadius: 10, backgroundColor: Colors.surfaceContainer, alignItems: 'center', justifyContent: 'center' },
  payLabel: { fontSize: FontSize.sm, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurface },
  paySubtitle: { fontSize: FontSize.xs, fontFamily: FontFamily.body, color: Colors.onSurfaceVariant, marginTop: 2 },
  secureNote: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: 4 },
  secureText: { fontSize: FontSize.xs, fontFamily: FontFamily.body, color: Colors.onSurfaceVariant, flex: 1 },

  // CTA
  ctaBar: { paddingHorizontal: 20, paddingTop: 14 },
  ctaBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#FFFFFF', borderRadius: 14, paddingVertical: 17 },
  ctaBtnText: { fontSize: FontSize.md, fontFamily: FontFamily.headline, color: Colors.primaryContainer, letterSpacing: LetterSpacing.tight },
});
