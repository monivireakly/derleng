import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  ImageSourcePropType,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize, LetterSpacing } from '../theme/typography';
import { Icon } from '../components/Icon';

interface ServiceTile {
  key: string;
  label: string;
  icon: string;
  available: boolean;
}

const SERVICES: ServiceTile[] = [
  { key: 'bus', label: 'Bus', icon: 'directions_bus', available: true },
  { key: 'flight', label: 'Flights', icon: 'flight', available: false },
  { key: 'hotel', label: 'Hotels', icon: 'hotel', available: false },
  { key: 'fun', label: 'Fun', icon: 'local_activity', available: false },
];

const DATE_OPTIONS = ['Now', 'Pick Date'];

const POPULAR_ROUTES: { from: string; to: string; badge?: string; price: string; subtitle?: string; large: boolean; image: ImageSourcePropType }[] = [
  { from: 'Phnom Penh', to: 'Siem Reap', badge: 'Daily Departures', price: '$12.00', subtitle: 'Travel to the heart of Khmer history', large: true,  image: require('../../assets/images/siem-reap.jpg') },
  { from: 'Sihanoukville', to: 'Koh Rong', badge: 'Ferry & Speedboat', price: '$25.00', large: false, image: require('../../assets/images/koh-rong.jpg') },
  { from: 'Phnom Penh', to: 'Kep',    price: '$10.50', large: false, image: require('../../assets/images/kep.jpg') },
  { from: 'Phnom Penh', to: 'Kampot', price: '$9.00',  large: false, image: require('../../assets/images/kampot.jpg') },
];

interface HomeScreenProps {
  navigation: any;
}

export function HomeScreen({ navigation }: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  const [selectedService, setSelectedService] = useState('bus');
  const [from, setFrom] = useState('Phnom Penh');
  const [to, setTo] = useState('Siem Reap');
  const [selectedDate, setSelectedDate] = useState('Now');
  const [pickedDate, setPickedDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [calMonth, setCalMonth] = useState(() => {
    const d = new Date(); return { year: d.getFullYear(), month: d.getMonth() };
  });

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today); maxDate.setDate(today.getDate() + 60);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const selectDay = (d: Date) => {
    setPickedDate(d);
    setShowPicker(false);
  };

  // Build calendar as weeks (arrays of 7) for row-based layout
  const buildWeeks = () => {
    const { year, month } = calMonth;
    const offset = (new Date(year, month, 1).getDay() + 6) % 7; // Mon-start
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = Array(offset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);
    const weeks: (Date | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
    return weeks;
  };

  const canGoPrev = () => {
    return calMonth.year > today.getFullYear() || calMonth.month > today.getMonth();
  };
  const canGoNext = () => {
    const max = new Date(maxDate);
    const lastOfNext = new Date(calMonth.year, calMonth.month + 2, 0);
    return lastOfNext >= max;
  };
  const goMonth = (delta: number) => {
    setCalMonth(({ year, month }) => {
      const d = new Date(year, month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const handleSearch = () => {
    navigation.navigate('SearchResults', { from, to, date: selectedDate });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingTop: insets.top + 64, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <LinearGradient
          colors={[Colors.primaryContainer, Colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Text style={styles.heroTitle}>Where to next?</Text>
          <Text style={styles.heroSubtitle}>Discover seamless travel across Cambodia</Text>

          {/* Service Tiles */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.servicesScroll}
            contentContainerStyle={styles.servicesContent}
          >
            {SERVICES.map((s) => {
              const isActive = s.available && selectedService === s.key;
              return (
                <TouchableOpacity
                  key={s.key}
                  style={[
                    styles.serviceTile,
                    isActive ? styles.serviceTileActive
                      : s.available ? styles.serviceTileEnabled
                      : styles.serviceTileDisabled,
                  ]}
                  onPress={() => s.available && setSelectedService(s.key)}
                  activeOpacity={s.available ? 0.8 : 1}
                >
                  <Icon
                    name={s.icon}
                    size={26}
                    color={isActive ? Colors.primaryContainer : s.available ? '#FFFFFF' : 'rgba(255,255,255,0.3)'}
                  />
                  <Text style={[styles.serviceLabel, isActive ? styles.serviceLabelActive : s.available ? styles.serviceLabelEnabled : styles.serviceLabelDisabled]}>
                    {s.label}
                  </Text>
                  {!s.available && (
                    <View style={styles.soonBadge}>
                      <Text style={styles.soonText}>SOON</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Search Box */}
          <View style={styles.searchBox}>
            {/* From / To */}
            <View style={styles.locationRow}>
              <View style={styles.locationField}>
                <Text style={styles.locationLabel}>FROM</Text>
                <View style={styles.locationInputRow}>
                  <Icon name="location_on" size={20} color={Colors.secondary} />
                  <TextInput
                    style={styles.locationInput}
                    value={from}
                    onChangeText={setFrom}
                    placeholderTextColor={Colors.onSurfaceVariant}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.swapBtn}
                onPress={() => { const tmp = from; setFrom(to); setTo(tmp); }}
                activeOpacity={0.8}
              >
                <Icon name="swap_horiz" size={20} color="#FFFFFF" />
              </TouchableOpacity>

              <View style={styles.locationField}>
                <Text style={styles.locationLabel}>TO</Text>
                <View style={styles.locationInputRow}>
                  <Icon name="travel_explore" size={20} color={Colors.secondary} />
                  <TextInput
                    style={styles.locationInput}
                    value={to}
                    onChangeText={setTo}
                    placeholderTextColor={Colors.onSurfaceVariant}
                  />
                </View>
              </View>
            </View>

            {/* Date */}
            <View>
              <Text style={styles.fieldLabel}>Departure Date</Text>
              <View style={styles.dateRow}>
                {DATE_OPTIONS.map((d) => {
                  const isPickDate = d === 'Pick Date';
                  const isActive = isPickDate ? !!pickedDate : selectedDate === d && !pickedDate;
                  return (
                    <TouchableOpacity
                      key={d}
                      style={[styles.dateChip, isActive && styles.dateChipActive]}
                      onPress={() => {
                        if (isPickDate) { setShowPicker(true); }
                        else { setSelectedDate(d); setPickedDate(null); }
                      }}
                      activeOpacity={0.8}
                    >
                      <Icon name="calendar_today" size={14} color={isActive ? '#fff' : Colors.onSurface} />
                      <Text style={[styles.dateChipText, isActive && styles.dateChipTextActive]}>
                        {isPickDate && pickedDate
                          ? pickedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                          : d}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Custom calendar modal */}
              <Modal transparent animationType="slide" visible={showPicker} onRequestClose={() => setShowPicker(false)}>
                <TouchableOpacity style={styles.calOverlay} activeOpacity={1} onPress={() => setShowPicker(false)} />
                <View style={styles.calSheet}>
                  {/* Header */}
                  <View style={styles.calHeader}>
                    <Text style={styles.calTitle}>Select Departure Date</Text>
                    <TouchableOpacity onPress={() => setShowPicker(false)} style={styles.calClose}>
                      <Icon name="close" size={20} color={Colors.onSurfaceVariant} />
                    </TouchableOpacity>
                  </View>

                  {/* Month navigation */}
                  <View style={styles.calMonthRow}>
                    <TouchableOpacity
                      onPress={() => goMonth(-1)}
                      disabled={!canGoPrev()}
                      style={[styles.calNavBtn, !canGoPrev() && { opacity: 0.25 }]}
                    >
                      <Icon name="chevron_left" size={22} color={Colors.primaryContainer} />
                    </TouchableOpacity>
                    <Text style={styles.calMonthLabel}>
                      {MONTH_NAMES[calMonth.month]} {calMonth.year}
                    </Text>
                    <TouchableOpacity
                      onPress={() => goMonth(1)}
                      disabled={!canGoNext()}
                      style={[styles.calNavBtn, !canGoNext() && { opacity: 0.25 }]}
                    >
                      <Icon name="chevron_right" size={22} color={Colors.primaryContainer} />
                    </TouchableOpacity>
                  </View>

                  {/* Day-of-week labels + grid share the same padded container */}
                  <View style={styles.calBody}>
                    <View style={styles.calWeekRow}>
                      {['M','T','W','T','F','S','S'].map((d, i) => (
                        <Text key={i} style={[styles.calDow, i >= 5 && styles.calDowWeekend]}>{d}</Text>
                      ))}
                    </View>

                    {buildWeeks().map((week, wi) => (
                      <View key={wi} style={styles.calWeekRow}>
                        {week.map((day, di) => {
                          if (!day) return <View key={di} style={styles.calCell} />;
                          const isPast = day < today;
                          const isBeyond = day > maxDate;
                          const disabled = isPast || isBeyond;
                          const isToday = isSameDay(day, today);
                          const isSelected = pickedDate ? isSameDay(day, pickedDate) : false;
                          const isWeekend = di >= 5;
                          return (
                            <TouchableOpacity
                              key={di}
                              style={[styles.calCell, isSelected && styles.calCellSelected]}
                              onPress={() => !disabled && selectDay(day)}
                              activeOpacity={disabled ? 1 : 0.75}
                              disabled={disabled}
                            >
                              <Text style={[
                                styles.calDayText,
                                isWeekend && !disabled && styles.calDayWeekend,
                                isToday && !isSelected && styles.calDayToday,
                                isSelected && styles.calDaySelected,
                                disabled && styles.calDayDisabled,
                              ]}>
                                {day.getDate()}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    ))}
                  </View>
                </View>
              </Modal>
            </View>

            {/* Travelers */}
            <View>
              <Text style={styles.fieldLabel}>Travelers</Text>
              <View style={styles.travelersRow}>
                <Icon name="group" size={20} color={Colors.onSurfaceVariant} />
                <Text style={styles.travelersText}>1 Adult, Economy</Text>
                <Icon name="expand_more" size={20} color={Colors.onSurfaceVariant} />
              </View>
            </View>

            {/* CTA */}
            <TouchableOpacity style={styles.searchBtn} onPress={handleSearch} activeOpacity={0.85}>
              <Icon name="search" size={22} color="#FFFFFF" />
              <Text style={styles.searchBtnText}>Search Trips</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Content */}
        <View style={styles.content}>
          {/* Recent Searches */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              <TouchableOpacity>
                <Text style={styles.sectionAction}>Clear all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {[
                { from: 'PP', to: 'Siem Reap', meta: 'Oct 24 • 1 Adult', active: true },
                { from: 'Sihanoukville', to: 'Koh Rong', meta: 'Oct 28 • 2 Adults', active: false },
              ].map((r, i) => (
                <View key={i} style={[styles.recentCard, r.active && styles.recentCardActive]}>
                  <View style={styles.recentIcon}>
                    <Icon name="history" size={22} color={Colors.onPrimaryContainer} />
                  </View>
                  <View>
                    <Text style={styles.recentRoute}>{r.from} → {r.to}</Text>
                    <Text style={styles.recentMeta}>{r.meta}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Popular Routes */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { fontSize: FontSize['2xl'] }]}>Popular Routes</Text>
            </View>
            <View style={styles.routeGrid}>
              {POPULAR_ROUTES.map((r, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.routeCard}
                  activeOpacity={0.9}
                >
                  <Image source={r.image} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,6,21,0.88)']}
                    style={StyleSheet.absoluteFillObject}
                    start={{ x: 0, y: 0.25 }}
                    end={{ x: 0, y: 1 }}
                  />
                  <View style={styles.routeCardContent}>
                    {r.badge && (
                      <View style={styles.routeBadge}>
                        <Text style={styles.routeBadgeText}>{r.badge}</Text>
                      </View>
                    )}
                    <Text style={styles.routeTitle}>{r.from} to {r.to}</Text>
                    {r.subtitle && <Text style={styles.routeSubtitle}>{r.subtitle}</Text>}
                    <Text style={styles.routePrice}>{r.price}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  scroll: { flex: 1 },
  hero: { paddingHorizontal: 24, paddingTop: 48, paddingBottom: 80, overflow: 'hidden' },
  heroTitle: { fontSize: FontSize['4xl'], fontFamily: FontFamily.headlineExtraBold, color: '#FFFFFF', letterSpacing: LetterSpacing.tighter, marginBottom: 4 },
  heroSubtitle: { fontSize: FontSize.base, fontFamily: FontFamily.bodyMedium, color: Colors.onPrimaryContainer, marginBottom: 24 },
  servicesScroll: { marginBottom: 24 },
  servicesContent: { gap: 12, paddingRight: 24 },
  serviceTile: { width: 80, height: 80, borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 4, overflow: 'hidden' },
  serviceTileActive: { backgroundColor: Colors.secondaryFixed },
  serviceTileEnabled: { backgroundColor: 'rgba(255,255,255,0.15)' },
  serviceTileDisabled: { backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  serviceLabel: { fontSize: 11, fontFamily: FontFamily.bodySemiBold, letterSpacing: LetterSpacing.widest, textTransform: 'uppercase' },
  serviceLabelActive: { color: Colors.primaryContainer },
  serviceLabelEnabled: { color: '#FFFFFF' },
  serviceLabelDisabled: { color: 'rgba(255,255,255,0.3)' },
  soonBadge: { position: 'absolute', top: 4, right: 4, backgroundColor: Colors.secondary, paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4 },
  soonText: { fontSize: 7, fontFamily: FontFamily.bodySemiBold, color: '#fff', letterSpacing: 0.5 },
  searchBox: { backgroundColor: Colors.surfaceContainerLowest, borderRadius: 28, padding: 20, gap: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 24, elevation: 10 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  locationField: { flex: 1, backgroundColor: Colors.surfaceContainerLow, borderRadius: 12, paddingHorizontal: 12, paddingTop: 8, paddingBottom: 10 },
  locationLabel: { fontSize: 10, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurfaceVariant, letterSpacing: LetterSpacing.widest, marginBottom: 4 },
  locationInputRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationInput: { flex: 1, fontSize: FontSize.base, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurface, padding: 0 },
  swapBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.secondary, alignItems: 'center', justifyContent: 'center', shadowColor: Colors.secondary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  fieldLabel: { fontSize: 12, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurfaceVariant, marginBottom: 8, marginLeft: 4 },
  dateRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  dateChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: Colors.surfaceContainerHigh },
  dateChipActive: { backgroundColor: Colors.primaryContainer },
  dateChipText: { fontSize: FontSize.sm, fontFamily: FontFamily.bodyMedium, color: Colors.onSurface },
  dateChipTextActive: { color: '#FFFFFF' },
  // Calendar modal
  calOverlay: { flex: 1, backgroundColor: 'rgba(0,6,21,0.5)' },
  calSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 36 },
  calHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  calTitle: { fontSize: FontSize.lg, fontFamily: FontFamily.headlineExtraBold, color: Colors.primary, letterSpacing: LetterSpacing.tighter },
  calClose: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.surfaceContainerHigh, borderRadius: 16 },
  calMonthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  calNavBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 18, backgroundColor: Colors.surfaceContainerLow },
  calMonthLabel: { fontSize: FontSize.md, fontFamily: FontFamily.headline, color: Colors.primary },
  calBody: { paddingHorizontal: 16, paddingBottom: 8 },
  calWeekRow: { flexDirection: 'row' },
  calDow: { flex: 1, textAlign: 'center', fontSize: 11, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurfaceVariant, paddingVertical: 8 },
  calDowWeekend: { color: Colors.secondary },
  calCell: { flex: 1, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22 },
  calCellSelected: { backgroundColor: Colors.primaryContainer },
  calDayText: { fontSize: FontSize.sm, fontFamily: FontFamily.bodyMedium, color: Colors.onSurface },
  calDayWeekend: { color: Colors.secondary },
  calDayToday: { color: Colors.secondary, fontFamily: FontFamily.headline },
  calDaySelected: { color: '#FFFFFF', fontFamily: FontFamily.bodySemiBold },
  calDayDisabled: { color: Colors.outlineVariant },
  travelersRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceContainerLow, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  travelersText: { flex: 1, fontSize: FontSize.sm, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurface },
  searchBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.secondary, borderRadius: 12, paddingVertical: 16, shadowColor: Colors.secondary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 6 },
  searchBtnText: { fontSize: FontSize.md, fontFamily: FontFamily.headlineSemiBold, color: '#FFFFFF', letterSpacing: LetterSpacing.tight },
  content: { paddingHorizontal: 24, paddingTop: 32 },
  section: { marginBottom: 48 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: FontSize.lg, fontFamily: FontFamily.headline, color: Colors.onSurface, letterSpacing: LetterSpacing.tight },
  sectionAction: { fontSize: FontSize.sm, fontFamily: FontFamily.bodySemiBold, color: Colors.secondary },
  recentCard: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: Colors.surfaceContainerLowest, padding: 16, borderRadius: 12, minWidth: 240, borderLeftWidth: 4, borderLeftColor: Colors.outlineVariant, shadowColor: Colors.primaryContainer, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  recentCardActive: { borderLeftColor: Colors.secondary },
  recentIcon: { backgroundColor: Colors.surfaceContainerLow, padding: 8, borderRadius: 8 },
  recentRoute: { fontSize: FontSize.sm, fontFamily: FontFamily.headline, color: Colors.onSurface },
  recentMeta: { fontSize: FontSize.xs, fontFamily: FontFamily.body, color: Colors.onSurfaceVariant, marginTop: 2 },
  routeGrid: { gap: 16 },
  routeCard: { borderRadius: 16, overflow: 'hidden', backgroundColor: Colors.primaryContainer, justifyContent: 'flex-end', height: 200 },
  routeCardContent: { padding: 20 },
  routeBadge: { alignSelf: 'flex-start', backgroundColor: Colors.secondaryFixed, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, marginBottom: 8 },
  routeBadgeText: { fontSize: 10, fontFamily: FontFamily.bodySemiBold, color: Colors.primaryContainer, letterSpacing: LetterSpacing.widest, textTransform: 'uppercase' },
  routeTitle: { fontSize: FontSize.xl, fontFamily: FontFamily.headline, color: '#FFFFFF', marginBottom: 4 },
  routeSubtitle: { fontSize: FontSize.sm, fontFamily: FontFamily.body, color: Colors.onPrimaryContainer, marginBottom: 4 },
  routePrice: { fontSize: FontSize['2xl'], fontFamily: FontFamily.headline, color: Colors.secondaryFixed, fontWeight: '700' },
});
