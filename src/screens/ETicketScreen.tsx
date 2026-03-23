import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize, LetterSpacing } from '../theme/typography';
import { Icon } from '../components/Icon';

// ─── QR mock ────────────────────────────────────────────────────────────────

const QR_PATTERN = [
  [1,1,1,0,1,0,1,1,1],
  [1,0,1,0,0,0,1,0,1],
  [1,0,1,1,0,1,1,0,1],
  [0,0,0,1,1,0,0,0,0],
  [1,0,1,0,1,0,1,0,1],
  [0,0,0,0,1,0,0,0,0],
  [1,1,1,0,0,1,0,1,0],
  [0,0,1,1,0,0,1,0,1],
  [1,1,1,0,1,1,1,1,0],
];

function QRCode() {
  return (
    <View style={qr.wrapper}>
      {QR_PATTERN.map((row, ri) => (
        <View key={ri} style={qr.row}>
          {row.map((cell, ci) => (
            <View key={ci} style={[qr.cell, cell ? qr.cellOn : qr.cellOff]} />
          ))}
        </View>
      ))}
    </View>
  );
}

const CELL = 11;
const qr = StyleSheet.create({
  wrapper:  { gap: 2 },
  row:      { flexDirection: 'row', gap: 2 },
  cell:     { width: CELL, height: CELL, borderRadius: 2 },
  cellOn:   { backgroundColor: Colors.primary },
  cellOff:  { backgroundColor: 'transparent' },
});

// ─── Screen ──────────────────────────────────────────────────────────────────

interface Props { navigation: any; route: any; }

export function ETicketScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const trip   = route?.params?.trip ?? {
    id:       'DL-88219',
    carrier:  'Giant Ibis Transport',
    from:     'Phnom Penh',
    to:       'Siem Reap',
    depTime:  '08:45 AM',
    arrTime:  '02:15 PM',
    duration: '5h 30m',
    date:     'Oct 24, 2023',
    passenger:'Traveler',
    seat:     '12A',
    class:    'Economy',
    price:    '$12.00',
  };

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <LinearGradient
        colors={[Colors.primaryContainer, Colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.topBar, { paddingTop: insets.top }]}
      >
        <View style={styles.topBarInner}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
            <Icon name="arrow_back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>E-Ticket</Text>
          <TouchableOpacity style={styles.shareBtn} activeOpacity={0.7}>
            <Icon name="ios_share" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 64 + 24, paddingBottom: insets.bottom + 48 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Boarding pass card ── */}
        <View style={styles.pass}>

          {/* Pass header */}
          <LinearGradient
            colors={[Colors.primaryContainer, Colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.passHeader}
          >
            <View style={styles.passHeaderTop}>
              <View style={styles.passLogo}>
                <Icon name="directions_bus" size={16} color={Colors.secondaryFixed} />
                <Text style={styles.passLogoText}>DerLeng</Text>
              </View>
              <View style={styles.passStatusPill}>
                <View style={styles.passStatusDot} />
                <Text style={styles.passStatusText}>CONFIRMED</Text>
              </View>
            </View>

            <Text style={styles.passCarrier}>{trip.carrier}</Text>

            {/* Route arc */}
            <View style={styles.routeRow}>
              <View style={styles.routeCity}>
                <Text style={styles.cityCode}>{trip.from.slice(0, 3).toUpperCase()}</Text>
                <Text style={styles.cityFull}>{trip.from}</Text>
                <Text style={styles.cityTime}>{trip.depTime}</Text>
              </View>

              <View style={styles.routeArc}>
                <View style={styles.arcDot} />
                <View style={styles.arcLine} />
                <Icon name="directions_bus" size={18} color={Colors.secondaryFixed} />
                <View style={styles.arcLine} />
                <View style={styles.arcDot} />
              </View>

              <View style={[styles.routeCity, { alignItems: 'flex-end' }]}>
                <Text style={styles.cityCode}>{trip.to.slice(0, 3).toUpperCase()}</Text>
                <Text style={styles.cityFull}>{trip.to}</Text>
                <Text style={styles.cityTime}>{trip.arrTime}</Text>
              </View>
            </View>

            <Text style={styles.duration}>{trip.duration} · {trip.date}</Text>
          </LinearGradient>

          {/* Tear line */}
          <View style={styles.tearRow}>
            <View style={[styles.tearNotch, { marginLeft: -18 }]} />
            <View style={styles.tearLine} />
            <View style={[styles.tearNotch, { marginRight: -18 }]} />
          </View>

          {/* Pass body — passenger details */}
          <View style={styles.passBody}>
            <View style={styles.detailGrid}>
              {[
                { label: 'Passenger',   value: trip.passenger },
                { label: 'Seat',        value: trip.seat },
                { label: 'Class',       value: trip.class },
                { label: 'Amount Paid', value: trip.price, accent: true },
              ].map((d) => (
                <View key={d.label} style={styles.detailCell}>
                  <Text style={styles.detailLabel}>{d.label.toUpperCase()}</Text>
                  <Text style={[styles.detailValue, d.accent && styles.detailValueAccent]}>
                    {d.value}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.bookingRow}>
              <Text style={styles.bookingLabel}>BOOKING REF</Text>
              <Text style={styles.bookingId}>#{trip.id}</Text>
            </View>
          </View>

          {/* Tear line 2 */}
          <View style={styles.tearRow}>
            <View style={[styles.tearNotch, { marginLeft: -18 }]} />
            <View style={styles.tearLine} />
            <View style={[styles.tearNotch, { marginRight: -18 }]} />
          </View>

          {/* QR section */}
          <View style={styles.qrSection}>
            <Text style={styles.qrHint}>Scan at boarding</Text>
            <QRCode />
            <Text style={styles.qrId}>{trip.id}-{trip.seat}</Text>
          </View>

        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.downloadBtn} activeOpacity={0.85}>
            <Icon name="download" size={20} color={Colors.primaryContainer} />
            <Text style={styles.downloadText}>Save to Device</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.8}>
            <Icon name="share" size={18} color={Colors.onSurfaceVariant} />
            <Text style={styles.secondaryBtnText}>Share</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surfaceContainerLow },

  topBar:      { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50 },
  topBarInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 64 },
  topBarTitle: { fontSize: FontSize.md, fontFamily: FontFamily.headlineExtraBold, color: '#FFFFFF', letterSpacing: LetterSpacing.tight },
  backBtn:     { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  shareBtn:    { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },

  scroll: { paddingHorizontal: 20, gap: 20, alignItems: 'center' },

  // Pass card
  pass: {
    width: '100%',
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.primaryContainer,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },

  // Pass header (gradient)
  passHeader:    { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 24, gap: 4 },
  passHeaderTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  passLogo:      { flexDirection: 'row', alignItems: 'center', gap: 6 },
  passLogoText:  { fontSize: FontSize.sm, fontFamily: FontFamily.headlineExtraBold, color: '#FFFFFF', letterSpacing: LetterSpacing.tight },
  passStatusPill:{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(101,250,222,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(101,250,222,0.3)' },
  passStatusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.secondaryFixed },
  passStatusText:{ fontSize: 10, fontFamily: FontFamily.bodySemiBold, color: Colors.secondaryFixed, letterSpacing: LetterSpacing.widest },
  passCarrier:   { fontSize: FontSize.xs, fontFamily: FontFamily.bodySemiBold, color: 'rgba(255,255,255,0.55)', letterSpacing: LetterSpacing.wide, textTransform: 'uppercase', marginBottom: 16 },

  // Route
  routeRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  routeCity: { gap: 2 },
  cityCode:  { fontSize: FontSize['3xl'], fontFamily: FontFamily.headlineExtraBold, color: '#FFFFFF', letterSpacing: LetterSpacing.tighter },
  cityFull:  { fontSize: FontSize.xs, fontFamily: FontFamily.bodyMedium, color: 'rgba(255,255,255,0.55)' },
  cityTime:  { fontSize: FontSize.md, fontFamily: FontFamily.headline, color: Colors.secondaryFixed, marginTop: 4 },
  routeArc:  { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8 },
  arcDot:    { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.35)' },
  arcLine:   { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.25)' },
  duration:  { fontSize: FontSize.xs, fontFamily: FontFamily.bodyMedium, color: 'rgba(255,255,255,0.5)', textAlign: 'center' },

  // Tear line
  tearRow:   { flexDirection: 'row', alignItems: 'center', marginVertical: 0 },
  tearNotch: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surfaceContainerLow },
  tearLine:  { flex: 1, borderTopWidth: 1.5, borderColor: Colors.surfaceContainerHigh, borderStyle: 'dashed' },

  // Pass body
  passBody:    { paddingHorizontal: 24, paddingVertical: 20 },
  detailGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 0 },
  detailCell:  { width: '50%', paddingVertical: 10 },
  detailLabel: { fontSize: 9, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurfaceVariant, letterSpacing: LetterSpacing.widest, marginBottom: 4 },
  detailValue: { fontSize: FontSize.md, fontFamily: FontFamily.headline, color: Colors.primary },
  detailValueAccent: { color: Colors.secondary },

  bookingRow:  { marginTop: 12, paddingTop: 14, borderTopWidth: 1, borderColor: Colors.surfaceContainerHigh, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bookingLabel:{ fontSize: 9, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurfaceVariant, letterSpacing: LetterSpacing.widest },
  bookingId:   { fontSize: FontSize.md, fontFamily: FontFamily.headlineExtraBold, color: Colors.primary, letterSpacing: LetterSpacing.tight },

  // QR
  qrSection: { paddingVertical: 24, alignItems: 'center', gap: 14, backgroundColor: Colors.surfaceContainerLowest },
  qrHint:    { fontSize: FontSize.xs, fontFamily: FontFamily.bodyMedium, color: Colors.onSurfaceVariant, letterSpacing: LetterSpacing.wide },
  qrId:      { fontSize: FontSize.xs, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurfaceVariant, letterSpacing: LetterSpacing.widest },

  // Actions
  actions:      { width: '100%', gap: 10 },
  downloadBtn:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.primaryContainer, borderRadius: 14, paddingVertical: 16 },
  downloadText: { fontSize: FontSize.md, fontFamily: FontFamily.headline, color: '#FFFFFF' },
  secondaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14 },
  secondaryBtnText: { fontSize: FontSize.sm, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurfaceVariant },
});
