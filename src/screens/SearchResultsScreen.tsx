import React, { useState, useRef, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize, LetterSpacing } from '../theme/typography';
import { Icon } from '../components/Icon';
import { useAuth } from '../context/AuthContext';

const SCREEN_W = Dimensions.get('window').width;
const LOAD_DURATION = 3600; // ms

const FILTER_CHIPS = ['Best Value', 'Cheapest', 'Fastest', 'Earliest'];

const RESULTS = [
  {
    id: 1, company: 'Larmo Express', rating: 4.8, reviews: 120,
    price: '$12', priceNum: 12, tag: 'BEST VALUE', tagColor: Colors.secondary,
    depTime: '08:30', arrTime: '14:00', duration: '5h 30m',
    from: 'Phnom Penh', to: 'Siem Reap',
    amenities: 'Free WiFi • AC', amenityIcon: 'wifi',
    seat: 'Instant Booking', highlight: true,
    brandColor: '#1A3C5E',
  },
  {
    id: 2, company: 'Sorya Bus', rating: 4.2, reviews: null,
    price: '$9', priceNum: 9, tag: 'CHEAPEST', tagColor: null,
    depTime: '07:00', arrTime: '13:00', duration: '6h 00m',
    from: 'Phnom Penh', to: 'Siem Reap',
    amenities: '2 stops on route', amenityIcon: 'info',
    seat: 'Standard Seating', highlight: false,
    brandColor: '#C0392B',
  },
  {
    id: 3, company: 'Giant Ibis', rating: 4.9, reviews: null,
    price: '$15', priceNum: 15, tag: 'TOP RATED', tagColor: Colors.secondary,
    depTime: '09:30', arrTime: '14:45', duration: '5h 15m',
    from: 'Phnom Penh', to: 'Siem Reap',
    amenities: 'Individual Outlets', amenityIcon: 'power',
    seat: 'Luxury Sleeper', highlight: false,
    brandColor: '#27AE60',
  },
  {
    id: 4, company: 'Mekong Express', rating: 4.6, reviews: 88,
    price: '$11', priceNum: 11, tag: null, tagColor: null,
    depTime: '10:00', arrTime: '15:30', duration: '5h 30m',
    from: 'Phnom Penh', to: 'Siem Reap',
    amenities: 'Reclining seats', amenityIcon: 'seat',
    seat: 'Semi-Sleeper', highlight: false,
    brandColor: '#8E44AD',
  },
];

interface SearchResultsScreenProps {
  navigation: any;
  route: any;
}

export function SearchResultsScreen({ navigation, route }: SearchResultsScreenProps) {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState('Best Value');
  const { from = 'Phnom Penh', to = 'Siem Reap', date = 'Today' } = route?.params ?? {};
  const { isLoggedIn } = useAuth();

  // Top loading bar state
  const [loadingResult, setLoadingResult] = useState<any>(null);
  const barProgress = useRef(new Animated.Value(0)).current;
  const handleBookNow = useCallback((result: any) => {
    if (loadingResult) return; // already loading

    if (!isLoggedIn) {
      navigation.navigate('Login');
      return;
    }

    setLoadingResult(result);
    barProgress.setValue(0);

    Animated.sequence([
      Animated.timing(barProgress, { toValue: 0.85, duration: LOAD_DURATION * 0.75, useNativeDriver: false }),
      Animated.timing(barProgress, { toValue: 0.95, duration: LOAD_DURATION * 0.2,  useNativeDriver: false }),
      Animated.timing(barProgress, { toValue: 1,    duration: LOAD_DURATION * 0.05, useNativeDriver: false }),
    ]).start(() => {
      setLoadingResult(null);
      barProgress.setValue(0);
      navigation.navigate('ProviderMiniApp', { result });
    });
  }, [loadingResult, isLoggedIn, barProgress, navigation]);

  const barWidth = barProgress.interpolate({ inputRange: [0, 1], outputRange: [0, SCREEN_W] });

  return (
    <View style={styles.container}>
      {/* Top loading bar — sits above everything, just under status bar */}
      {!!loadingResult && (
        <View style={[styles.loadingBarTrack, { top: insets.top }]} pointerEvents="none">
          <Animated.View style={[styles.loadingBarFill, { width: barWidth }]} />
          {/* Glow tip */}
          <Animated.View style={[styles.loadingBarGlow, { left: barWidth }]} />
        </View>
      )}



      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
      >
        {/* Hero header */}
        <LinearGradient
          colors={[Colors.primaryContainer, '#0D2B4A', Colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + 64 + 16 }]}
        >
          {/* Route display */}
          <View style={styles.routeRow}>
            <View style={styles.routeEnd}>
              <Text style={styles.routeCity}>{from}</Text>
              <Text style={styles.routeLabel}>Departure</Text>
            </View>
            <View style={styles.routeMiddle}>
              <Icon name="directions_bus" size={20} color={Colors.secondaryFixed} />
              <View style={styles.routeLine} />
              <Icon name="location-on" size={20} color={Colors.secondaryFixed} />
            </View>
            <View style={[styles.routeEnd, { alignItems: 'flex-end' }]}>
              <Text style={styles.routeCity}>{to}</Text>
              <Text style={styles.routeLabel}>Arrival</Text>
            </View>
          </View>

          {/* Meta row */}
          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <Icon name="calendar-today" size={13} color={Colors.secondaryFixed} />
              <Text style={styles.metaChipText}>{date}</Text>
            </View>
            <View style={styles.metaChip}>
              <Icon name="person" size={13} color={Colors.secondaryFixed} />
              <Text style={styles.metaChipText}>1 Passenger</Text>
            </View>
            <TouchableOpacity style={[styles.metaChip, styles.editChip]} onPress={() => navigation.goBack()} activeOpacity={0.8}>
              <Icon name="edit" size={13} color={Colors.primaryContainer} />
              <Text style={[styles.metaChipText, { color: Colors.primaryContainer }]}>Edit</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.resultCount}>{RESULTS.length} trips found</Text>
        </LinearGradient>

        {/* Sticky filter bar */}
        <View style={styles.filterBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
            {FILTER_CHIPS.map((chip) => (
              <TouchableOpacity
                key={chip}
                style={[styles.chip, activeFilter === chip && styles.chipActive]}
                onPress={() => setActiveFilter(chip)}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, activeFilter === chip && styles.chipTextActive]}>{chip}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.tuneBtn}>
              <Icon name="tune" size={20} color={Colors.primaryContainer} />
            </View>
          </ScrollView>
        </View>

        {/* Results */}
        <View style={styles.resultsList}>
          {RESULTS.map((r) => (
            <View
              key={r.id}
              style={[styles.resultCard, r.highlight && styles.resultCardHighlight]}
            >
              {r.highlight && (
                <View style={styles.bestValueBadge}>
                  <Text style={styles.bestValueText}>{r.tag}</Text>
                </View>
              )}

              <View style={styles.cardPadding}>
                {/* Header */}
                <View style={styles.cardHeader}>
                  <View style={styles.companyRow}>
                    <View style={[styles.companyLogo, { backgroundColor: r.brandColor + '18', borderColor: r.brandColor + '30' }]}>
                      <Icon name="directions_bus" size={26} color={r.brandColor} />
                    </View>
                    <View>
                      <Text style={styles.companyName}>{r.company}</Text>
                      <View style={styles.ratingRow}>
                        <Icon name="star" size={13} color="#F59E0B" />
                        <Text style={styles.ratingText}>{r.rating}</Text>
                        {r.reviews && <Text style={styles.reviewCount}>({r.reviews})</Text>}
                        {!r.highlight && r.tag && r.tagColor && (
                          <View style={[styles.inlineTag, { backgroundColor: `${Colors.secondary}15` }]}>
                            <Text style={[styles.inlineTagText, { color: Colors.secondary }]}>{r.tag}</Text>
                          </View>
                        )}
                        {!r.highlight && r.tag && !r.tagColor && (
                          <View style={[styles.inlineTag, { backgroundColor: Colors.surfaceContainerHigh }]}>
                            <Text style={[styles.inlineTagText, { color: Colors.onSurfaceVariant }]}>{r.tag}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                  <View style={styles.priceBlock}>
                    <Text style={[styles.price, { color: r.highlight ? Colors.secondary : Colors.primaryContainer }]}>{r.price}</Text>
                    <Text style={styles.seatLabel}>{r.seat}</Text>
                  </View>
                </View>

                {/* Trip timeline */}
                <View style={styles.tripRow}>
                  <View style={styles.tripSide}>
                    <Text style={styles.tripTime}>{r.depTime}</Text>
                    <Text style={styles.tripCity}>{r.from}</Text>
                  </View>
                  <View style={styles.tripMiddle}>
                    <Text style={[styles.durationText, { color: r.highlight ? Colors.secondary : Colors.onSurfaceVariant }]}>
                      {r.duration}
                    </Text>
                    <View style={[styles.tripLine, { backgroundColor: r.highlight ? `${Colors.secondary}30` : Colors.outlineVariant }]}>
                      <View style={[styles.tripDot, styles.tripDotLeft, { borderColor: r.highlight ? Colors.secondary : Colors.outlineVariant }]} />
                      <View style={[styles.busBadge, { backgroundColor: Colors.surfaceContainerLowest }]}>
                        <Icon name="directions_bus" size={14} color={r.highlight ? Colors.secondary : Colors.onSurfaceVariant} />
                      </View>
                      <View style={[styles.tripDot, styles.tripDotRight, { borderColor: r.highlight ? Colors.secondary : Colors.outlineVariant }]} />
                    </View>
                  </View>
                  <View style={styles.tripSideRight}>
                    <Text style={styles.tripTime}>{r.arrTime}</Text>
                    <Text style={[styles.tripCity, { textAlign: 'right' }]}>{r.to}</Text>
                  </View>
                </View>

                {/* Footer */}
                <View style={styles.cardFooter}>
                  <View style={styles.amenityRow}>
                    <Icon name={r.amenityIcon} size={15} color={Colors.onSurfaceVariant} />
                    <Text style={styles.amenityText}>{r.amenities}</Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.bookNowBtn,
                      r.highlight && styles.bookNowBtnHighlight,
                      !!loadingResult && loadingResult.id !== r.id && styles.bookNowBtnDimmed,
                    ]}
                    onPress={() => handleBookNow(r)}
                    activeOpacity={0.85}
                    disabled={!!loadingResult}
                  >
                    <Text style={styles.bookNowText}>
                      {loadingResult?.id === r.id ? 'Loading…' : 'Book Now'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}

          <View style={styles.microcopy}>
            <Icon name="lock" size={14} color={Colors.onSurfaceVariant} />
            <Text style={styles.microcopyText}>Secure booking · Instant confirmation</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  scroll: { flex: 1 },

  // Hero
  hero: { paddingHorizontal: 24, paddingBottom: 28 },
  routeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  routeEnd: { flex: 1 },
  routeCity: { fontSize: FontSize['2xl'], fontFamily: FontFamily.headlineExtraBold, color: '#FFFFFF', letterSpacing: LetterSpacing.tighter },
  routeLabel: { fontSize: 11, fontFamily: FontFamily.bodyMedium, color: Colors.onPrimaryContainer, marginTop: 2 },
  routeMiddle: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12 },
  routeLine: { flex: 1, height: 1, backgroundColor: `${Colors.secondaryFixed}50` },
  metaRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  editChip: { backgroundColor: Colors.secondaryFixed },
  metaChipText: { fontSize: FontSize.xs, fontFamily: FontFamily.bodySemiBold, color: Colors.secondaryFixed },
  resultCount: { fontSize: 12, fontFamily: FontFamily.bodySemiBold, color: Colors.onPrimaryContainer, marginTop: 14, letterSpacing: LetterSpacing.wide, textTransform: 'uppercase' },

  // Filter bar
  filterBar: { backgroundColor: Colors.surface, paddingHorizontal: 16, paddingVertical: 12, shadowColor: Colors.primaryContainer, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  filterRow: { gap: 10, alignItems: 'center' },
  chip: { paddingHorizontal: 18, paddingVertical: 9, borderRadius: 20, backgroundColor: Colors.surfaceContainerHigh },
  chipActive: { backgroundColor: Colors.primaryContainer },
  chipText: { fontSize: FontSize.sm, fontFamily: FontFamily.bodySemiBold, color: Colors.primaryContainer },
  chipTextActive: { color: '#FFFFFF' },
  tuneBtn: { backgroundColor: Colors.surfaceContainerLowest, padding: 9, borderRadius: 12, borderWidth: 1, borderColor: Colors.outlineVariant, marginLeft: 4 },

  // Results
  resultsList: { paddingHorizontal: 16, paddingTop: 16, gap: 16 },
  resultCard: { backgroundColor: Colors.surfaceContainerLowest, borderRadius: 16, overflow: 'hidden', shadowColor: Colors.primaryContainer, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 20, elevation: 3 },
  resultCardHighlight: { borderWidth: 2, borderColor: `${Colors.secondary}25` },
  bestValueBadge: { backgroundColor: Colors.secondary, paddingHorizontal: 16, paddingVertical: 5, alignSelf: 'flex-start', borderBottomRightRadius: 12 },
  bestValueText: { fontSize: 10, fontFamily: FontFamily.bodySemiBold, color: '#FFF', letterSpacing: LetterSpacing.widest, textTransform: 'uppercase' },
  cardPadding: { padding: 18 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  companyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  companyLogo: { width: 52, height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  companyName: { fontSize: FontSize.md, fontFamily: FontFamily.headline, color: Colors.primaryContainer },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3, flexWrap: 'wrap' },
  ratingText: { fontSize: 12, fontFamily: FontFamily.headline, color: Colors.primaryContainer },
  reviewCount: { fontSize: 10, fontFamily: FontFamily.bodyMedium, color: Colors.onSurfaceVariant },
  inlineTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  inlineTagText: { fontSize: 9, fontFamily: FontFamily.bodySemiBold, letterSpacing: LetterSpacing.widest, textTransform: 'uppercase' },
  priceBlock: { alignItems: 'flex-end', paddingLeft: 8 },
  price: { fontSize: FontSize['2xl'], fontFamily: FontFamily.headlineExtraBold },
  seatLabel: { fontSize: 9, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: LetterSpacing.tight, marginTop: 2 },

  tripRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  tripSide: { flex: 1 },
  tripSideRight: { flex: 1, alignItems: 'flex-end' },
  tripTime: { fontSize: FontSize.xl, fontFamily: FontFamily.headlineExtraBold, color: Colors.primaryContainer },
  tripCity: { fontSize: 11, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurfaceVariant },
  tripMiddle: { flex: 1, alignItems: 'center', paddingHorizontal: 14, gap: 5 },
  durationText: { fontSize: 10, fontFamily: FontFamily.bodySemiBold, textTransform: 'uppercase', letterSpacing: LetterSpacing.tight },
  tripLine: { width: '100%', height: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  tripDot: { position: 'absolute', width: 8, height: 8, borderRadius: 4, borderWidth: 2, backgroundColor: Colors.surfaceContainerLowest },
  tripDotLeft: { left: 0 },
  tripDotRight: { right: 0 },
  busBadge: { paddingHorizontal: 3 },

  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTopWidth: 1, borderTopColor: Colors.surfaceContainerHigh },
  amenityRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  amenityText: { fontSize: 11, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: LetterSpacing.wide },
  bookNowBtn: { backgroundColor: Colors.primaryContainer, paddingHorizontal: 22, paddingVertical: 11, borderRadius: 14, shadowColor: Colors.primaryContainer, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
  bookNowBtnHighlight: { backgroundColor: Colors.secondary },
  bookNowText: { fontSize: FontSize.sm, fontFamily: FontFamily.headline, color: '#FFFFFF' },

  microcopy: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 24 },
  microcopyText: { fontSize: 11, fontFamily: FontFamily.bodyMedium, color: Colors.onSurfaceVariant },

  // Loading bar
  loadingBarTrack: { position: 'absolute', left: 0, right: 0, height: 3, backgroundColor: 'transparent', zIndex: 999 },
  loadingBarFill: { height: 3, backgroundColor: Colors.secondaryFixed, borderRadius: 2 },
  loadingBarGlow: { position: 'absolute', top: -3, width: 24, height: 9, backgroundColor: Colors.secondaryFixed, borderRadius: 6, opacity: 0.6, transform: [{ scaleY: 0.5 }] },

  // Cancel nav button (fixed top-left)



  bookNowBtnDimmed: { opacity: 0.4 },
});
