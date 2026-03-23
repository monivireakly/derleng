import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize, LetterSpacing } from '../theme/typography';
import { Icon } from '../components/Icon';

// ─── Config ──────────────────────────────────────────────────────────────────

type ServiceKey = 'bus' | 'flight' | 'hotel';
type TripType   = 'one-way' | 'round-trip' | 'multi-city';

interface ServiceConfig {
  icon: string;
  headline: string;
  subheadline: string;
  showTripType: boolean;
  tripTypes: TripType[];
  fromLabel: string;
  showToField: boolean;
  departureDateLabel: string;
  returnDateLabel: string;
  alwaysShowReturn: boolean;
  searchLabel: string;
}

const SERVICE_CONFIG: Record<ServiceKey, ServiceConfig> = {
  bus: {
    icon: 'directions_bus',
    headline: 'Bus',
    subheadline: 'Buses across Cambodia',
    showTripType: true,
    tripTypes: ['one-way', 'round-trip'],
    fromLabel: 'From',
    showToField: true,
    departureDateLabel: 'Departure',
    returnDateLabel: 'Return',
    alwaysShowReturn: false,
    searchLabel: 'Search Buses',
  },
  flight: {
    icon: 'flight',
    headline: 'Flights',
    subheadline: 'Flights across Southeast Asia',
    showTripType: true,
    tripTypes: ['one-way', 'round-trip', 'multi-city'],
    fromLabel: 'From',
    showToField: true,
    departureDateLabel: 'Departure',
    returnDateLabel: 'Return',
    alwaysShowReturn: false,
    searchLabel: 'Search Flights',
  },
  hotel: {
    icon: 'hotel',
    headline: 'Hotels',
    subheadline: 'Hotels & guesthouses',
    showTripType: false,
    tripTypes: [],
    fromLabel: 'Destination',
    showToField: false,
    departureDateLabel: 'Check-in',
    returnDateLabel: 'Check-out',
    alwaysShowReturn: true,
    searchLabel: 'Search Hotels',
  },
};

// ─── City autocomplete data ───────────────────────────────────────────────────

interface CitySuggestion {
  name: string;
  sub: string;
  lat: number;
  lng: number;
}

const CITY_SUGGESTIONS: CitySuggestion[] = [
  { name: 'Phnom Penh',     sub: 'Capital · Cambodia',    lat: 11.57, lng: 104.92 },
  { name: 'Siem Reap',      sub: 'Angkor Wat · Cambodia', lat: 13.36, lng: 103.86 },
  { name: 'Sihanoukville',  sub: 'Beach · Cambodia',      lat: 10.63, lng: 103.52 },
  { name: 'Kampot',         sub: 'Cambodia',              lat: 10.61, lng: 104.18 },
  { name: 'Kep',            sub: 'Cambodia',              lat: 10.49, lng: 104.30 },
  { name: 'Battambang',     sub: 'Cambodia',              lat: 13.10, lng: 103.20 },
  { name: 'Kratie',         sub: 'Cambodia',              lat: 12.49, lng: 106.02 },
  { name: 'Koh Kong',       sub: 'Cambodia',              lat: 11.61, lng: 102.98 },
  { name: 'Kampong Cham',   sub: 'Cambodia',              lat: 11.99, lng: 105.46 },
  { name: 'Koh Rong',       sub: 'Island · Cambodia',     lat: 10.73, lng: 103.25 },
  { name: 'Bangkok',        sub: 'Thailand',              lat: 13.76, lng: 100.50 },
  { name: 'Ho Chi Minh',    sub: 'Vietnam',               lat: 10.82, lng: 106.66 },
  { name: 'Hanoi',          sub: 'Vietnam',               lat: 21.03, lng: 105.85 },
  { name: 'Vientiane',      sub: 'Laos',                  lat: 17.97, lng: 102.63 },
];

// Module-level session store — persists across re-renders, clears on app restart
const _recentCities: CitySuggestion[] = [];

function recordRecentCity(city: CitySuggestion) {
  const idx = _recentCities.findIndex((c) => c.name === city.name);
  if (idx !== -1) _recentCities.splice(idx, 1);
  _recentCities.unshift(city);
  if (_recentCities.length > 5) _recentCities.length = 5;
}

const TRIP_TYPE_LABELS: Record<TripType, string> = {
  'one-way':    'One Way',
  'round-trip': 'Round Trip',
  'multi-city': 'Multi-city',
};

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeDate(offsetDays: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offsetDays);
  return d;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

const DAY_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function formatDateWithDay(d: Date): string {
  return DAY_SHORT[d.getDay()] + ', ' + d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate()
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

interface Props { navigation: any; route: any; }

export function ServiceSearchScreen({ navigation, route }: Props) {
  const insets        = useSafeAreaInsets();
  const service: ServiceKey = route.params?.service ?? 'bus';
  const config        = SERVICE_CONFIG[service];

  const [tripType,       setTripType]       = useState<TripType>('one-way');
  const [from,           setFrom]           = useState('Phnom Penh');
  const [to,             setTo]             = useState('Siem Reap');
  const [depDate,        setDepDate]        = useState<Date>(() => makeDate(1));
  const [retDate,        setRetDate]        = useState<Date>(() => makeDate(4));
  const [activeCalendar, setActiveCalendar] = useState<'dep' | 'ret' | null>(null);
  const [calMonthDep,    setCalMonthDep]    = useState(() => {
    const d = makeDate(1); return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [calMonthRet,    setCalMonthRet]    = useState(() => {
    const d = makeDate(4); return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [destFocused,    setDestFocused]    = useState(false);
  const [fromFocused,    setFromFocused]    = useState(false);
  const [toFocused,      setToFocused]      = useState(false);
  const [showTravelers,  setShowTravelers]  = useState(false);
  const [adults,         setAdults]         = useState(1);
  const [children,       setChildren]       = useState(0);
  const [seatClass,      setSeatClass]      = useState<'Economy' | 'Business'>('Economy');

  // Swap animation
  const swapDeg   = useRef(new Animated.Value(0)).current;
  const swapAccum = useRef(0);

  const handleSwap = () => {
    swapAccum.current += 180;
    Animated.spring(swapDeg, {
      toValue: swapAccum.current,
      useNativeDriver: true,
      tension: 120,
      friction: 6,
    }).start();
    const prev = from;
    setFrom(to);
    setTo(prev);
  };

  const swapRotateStyle = {
    transform: [{
      rotate: swapDeg.interpolate({
        inputRange: [0, 360],
        outputRange: ['0deg', '360deg'],
        extrapolate: 'extend',
      }),
    }],
  };

  // City suggestion dropdown renderer
  const renderCitySuggestions = (
    query: string,
    onSelect: (city: CitySuggestion) => void,
  ) => {
    const q = query.toLowerCase();
    const recents = _recentCities.filter(
      (c) => q.length === 0 || c.name.toLowerCase().includes(q)
    );
    const rest = CITY_SUGGESTIONS.filter(
      (c) => (q.length === 0 || c.name.toLowerCase().includes(q)) &&
              !recents.find((r) => r.name === c.name)
    );
    const items: Array<CitySuggestion & { isRecent: boolean }> = [
      ...recents.map((c) => ({ ...c, isRecent: true })),
      ...rest.map((c) => ({ ...c, isRecent: false })),
    ];
    return (
      <View style={styles.suggestions}>
        {items.length === 0 ? (
          <View style={styles.suggestionRow}>
            <Text style={styles.suggestionSub}>No results for "{query}"</Text>
          </View>
        ) : items.map((s, i) => (
          <TouchableOpacity
            key={i}
            style={styles.suggestionRow}
            onPress={() => { recordRecentCity(s); onSelect(s); }}
            activeOpacity={0.7}
          >
            <View style={styles.suggestionIcon}>
              <Icon name={s.isRecent ? 'history' : 'location_on'} size={16} color={s.isRecent ? Colors.onSurfaceVariant : Colors.secondary} />
            </View>
            <View style={styles.suggestionInfo}>
              <Text style={styles.suggestionName}>{s.name}</Text>
              <Text style={styles.suggestionSub}>{s.sub}</Text>
            </View>
            {s.isRecent && <Icon name="north_east" size={14} color={Colors.onSurfaceVariant} />}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const today    = makeDate(0);
  // Cap: last day of the same calendar month, 12 months from now (e.g. Mar 2026 → Mar 2027)
  const capYear  = today.getFullYear() + 1;
  const capMonth = today.getMonth();
  const maxDate  = new Date(capYear, capMonth + 1, 0); // last day of cap month
  const showReturn = config.alwaysShowReturn || tripType === 'round-trip';

  // All navigable months: current month → cap month (13 months total)
  const allMonths = (() => {
    const months: { year: number; month: number }[] = [];
    let y = today.getFullYear(), m = today.getMonth();
    while (y < capYear || (y === capYear && m <= capMonth)) {
      months.push({ year: y, month: m });
      m++; if (m > 11) { m = 0; y++; }
    }
    return months;
  })();
  const monthIndex = (cm: { year: number; month: number }) =>
    allMonths.findIndex(mo => mo.year === cm.year && mo.month === cm.month);

  // Refs + state for sliding calendars
  // Width needs to be state (not just a ref) so measuring it triggers a re-render
  // that gives month pages their correct dimensions.
  const calDepRef   = useRef<ScrollView>(null);
  const calRetRef   = useRef<ScrollView>(null);
  const [calDepWidth, setCalDepWidth] = useState(0);
  const [calRetWidth, setCalRetWidth] = useState(0);

  // After width is measured (state update re-renders), scroll to the current month
  useEffect(() => {
    if (calDepWidth > 0) {
      const idx = monthIndex(calMonthDep);
      calDepRef.current?.scrollTo({ x: idx * calDepWidth, animated: false });
    }
  }, [calDepWidth]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (calRetWidth > 0) {
      const idx = monthIndex(calMonthRet);
      calRetRef.current?.scrollTo({ x: idx * calRetWidth, animated: false });
    }
  }, [calRetWidth]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Helpers ───────────────────────────────────────────────────────────────

  const travelersLabel = (): string => {
    const a = adults + (adults > 1 ? ' Adults' : ' Adult');
    const c = children > 0 ? (', ' + children + (children > 1 ? ' Children' : ' Child')) : '';
    return a + c + ', ' + seatClass;
  };

  const buildWeeks = (cm: { year: number; month: number }) => {
    const offset = (new Date(cm.year, cm.month, 1).getDay() + 6) % 7;
    const days   = new Date(cm.year, cm.month + 1, 0).getDate();
    const cells: (Date | null)[] = Array(offset).fill(null);
    for (let d = 1; d <= days; d++) cells.push(new Date(cm.year, cm.month, d));
    while (cells.length % 7 !== 0) cells.push(null);
    const weeks: (Date | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
    return weeks;
  };

  const canGoPrev = (cm: { year: number; month: number }) =>
    cm.year > today.getFullYear() || (cm.year === today.getFullYear() && cm.month > today.getMonth());
  const canGoNext = (cm: { year: number; month: number }) =>
    cm.year < capYear || (cm.year === capYear && cm.month < capMonth);
  const advance = (cm: { year: number; month: number }, delta: number) => {
    const d = new Date(cm.year, cm.month + delta, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  };

  const handleSearch = () => {
    navigation.navigate('SearchResults', { from, to, date: formatDate(depDate) });
  };

  // ── Inline sliding calendar ───────────────────────────────────────────────

  const renderMonthGrid = (
    mo: { year: number; month: number },
    width: number,
    selectedDate: Date,
    onSelect: (d: Date) => void,
    onDone: () => void,
  ) => (
    <View style={{ width }}>
      <View style={styles.calBody}>
        {buildWeeks(mo).map((week, wi) => (
          <View key={wi} style={styles.calWeekRow}>
            {week.map((day, di) => {
              if (!day) return <View key={di} style={styles.calCell} />;
              const disabled   = day < today || day > maxDate;
              const isToday    = isSameDay(day, today);
              const isSelected = isSameDay(day, selectedDate);
              const inRange    = showReturn && day > depDate && day < retDate;
              return (
                <TouchableOpacity
                  key={di}
                  style={[
                    styles.calCell,
                    isSelected && styles.calCellSelected,
                    !isSelected && inRange && styles.calCellInRange,
                  ]}
                  onPress={() => { if (!disabled) { onSelect(day); onDone(); } }}
                  disabled={disabled}
                  activeOpacity={disabled ? 1 : 0.75}
                >
                  <Text style={[
                    styles.calDayText,
                    di >= 5 && !disabled && styles.calDayWeekend,
                    isToday && !isSelected && styles.calDayToday,
                    isSelected && styles.calDaySelected,
                    !isSelected && inRange && styles.calDayInRange,
                    disabled && styles.calDayDisabled,
                  ]}>
                    {String(day.getDate())}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );

  const renderCal = (
    cm: { year: number; month: number },
    setCm: (v: { year: number; month: number }) => void,
    selectedDate: Date,
    onSelect: (d: Date) => void,
    scrollRef: React.RefObject<ScrollView | null>,
    width: number,
    setWidth: (w: number) => void,
    onDone: () => void,
  ) => {
    const scrollToMonth = (target: { year: number; month: number }, animated = true) => {
      const idx = monthIndex(target);
      if (width > 0 && idx >= 0) {
        scrollRef.current?.scrollTo({ x: idx * width, animated });
      }
    };
    const goPrev = () => { if (canGoPrev(cm)) { const t = advance(cm, -1); setCm(t); scrollToMonth(t); } };
    const goNext = () => { if (canGoNext(cm)) { const t = advance(cm, 1);  setCm(t); scrollToMonth(t); } };

    return (
      <View style={styles.inlineCal}>
        {/* Month nav header */}
        <View style={styles.calMonthRow}>
          <TouchableOpacity onPress={goPrev} disabled={!canGoPrev(cm)} style={[styles.calNavBtn, !canGoPrev(cm) && { opacity: 0.25 }]}>
            <Icon name="chevron_left" size={22} color={Colors.primaryContainer} />
          </TouchableOpacity>
          <Text style={styles.calMonthLabel}>{MONTH_NAMES[cm.month] + ' ' + String(cm.year)}</Text>
          <TouchableOpacity onPress={goNext} disabled={!canGoNext(cm)} style={[styles.calNavBtn, !canGoNext(cm) && { opacity: 0.25 }]}>
            <Icon name="chevron_right" size={22} color={Colors.primaryContainer} />
          </TouchableOpacity>
        </View>

        {/* Day-of-week header */}
        <View style={styles.calWeekRow}>
          {['M','T','W','T','F','S','S'].map((d, i) => (
            <Text key={i} style={[styles.calDow, i >= 5 && styles.calDowWeekend]}>{d}</Text>
          ))}
        </View>

        {/* Paginated month pages */}
        <View
          onLayout={(e) => {
            const w = e.nativeEvent.layout.width;
            if (w > 0 && w !== width) setWidth(w);
          }}
        >
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            decelerationRate="fast"
            onMomentumScrollEnd={(e) => {
              if (width === 0) return;
              const idx = Math.round(e.nativeEvent.contentOffset.x / width);
              if (allMonths[idx]) setCm(allMonths[idx]);
            }}
          >
            {allMonths.map((mo, i) => (
              <View key={i} style={width > 0 ? { width } : { width: 1 }}>
                {width > 0 && renderMonthGrid(mo, width, selectedDate, onSelect, onDone)}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      {/* ── Gradient hero — same tokens as HomeScreen ── */}
      <LinearGradient
        colors={[Colors.primaryContainer, Colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.hero, { paddingTop: insets.top + 16 }]}
      >
        {/* Back */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Icon name="arrow_back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Service identity */}
        <View style={styles.heroIdentity}>
          <View style={styles.heroIconBadge}>
            <Icon name={config.icon} size={26} color={Colors.secondaryFixed} />
          </View>
          <Text style={styles.heroTitle}>{config.headline}</Text>
          <Text style={styles.heroSubtitle}>{config.subheadline}</Text>
        </View>
      </LinearGradient>

      {/* ── Form card — floats over gradient, same as HomeScreen searchBox ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.searchBox}>
          {/* Trip type toggle — Bus & Flight only */}
          {config.showTripType && (
            <View style={styles.tripTypeRow}>
              {config.tripTypes.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.tripTypeChip, tripType === t && styles.tripTypeChipActive]}
                  onPress={() => { setTripType(t); setActiveCalendar(null); }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tripTypeText, tripType === t && styles.tripTypeTextActive]}>
                    {TRIP_TYPE_LABELS[t]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Destination search — Hotel only */}
          {service === 'hotel' && (
            <View style={styles.destSection}>
              <Text style={styles.fieldLabel}>Where are you going?</Text>
              <View style={[styles.destSearchBar, destFocused && styles.destSearchBarFocused]}>
                <Icon name="search" size={20} color={destFocused ? Colors.secondary : Colors.onSurfaceVariant} />
                <TextInput
                  style={styles.destInput}
                  value={from}
                  onChangeText={(t) => { setFrom(t); setDestFocused(true); }}
                  placeholder="Search destinations"
                  placeholderTextColor={Colors.onSurfaceVariant}
                  onFocus={() => setDestFocused(true)}
                  onBlur={() => setTimeout(() => setDestFocused(false), 150)}
                  returnKeyType="search"
                />
                {from.length > 0 && (
                  <TouchableOpacity onPress={() => setFrom('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Icon name="close" size={18} color={Colors.onSurfaceVariant} />
                  </TouchableOpacity>
                )}
              </View>

              {/* Suggestions dropdown */}
              {destFocused && renderCitySuggestions(from, (city) => {
                setFrom(city.name);
                setDestFocused(false);
              })}
            </View>
          )}

          {/* Location stack — Bus & Flight only */}
          {service !== 'hotel' && (
            <View style={styles.locationStack}>

              {/* FROM field */}
              <View style={[styles.locationFieldStacked, styles.locationFieldTop, fromFocused && styles.locationFieldFocused]}>
                <Text style={styles.locationLabel}>{config.fromLabel.toUpperCase()}</Text>
                <View style={styles.locationInputRow}>
                  <Icon name="radio_button_checked" size={16} color={fromFocused ? Colors.secondary : Colors.onSurfaceVariant} />
                  <TextInput
                    style={styles.locationInput}
                    value={from}
                    onChangeText={(t) => { setFrom(t); setFromFocused(true); }}
                    placeholder="City or station"
                    placeholderTextColor={Colors.onSurfaceVariant}
                    onFocus={() => setFromFocused(true)}
                    onBlur={() => setTimeout(() => setFromFocused(false), 150)}
                    returnKeyType="next"
                  />
                </View>
              </View>

              {/* FROM dropdown */}
              {fromFocused && renderCitySuggestions(from, (city) => {
                setFrom(city.name);
                setFromFocused(false);
              })}

              {/* Swap divider */}
              {config.showToField && (
                <View style={styles.swapDividerRow}>
                  <View style={styles.swapDividerLine} />
                  <TouchableOpacity style={styles.swapBtn} onPress={handleSwap} activeOpacity={0.8}>
                    <Animated.View style={swapRotateStyle}>
                      <Icon name="swap_vert" size={20} color="#FFFFFF" />
                    </Animated.View>
                  </TouchableOpacity>
                  <View style={styles.swapDividerLine} />
                </View>
              )}

              {/* TO field */}
              {config.showToField && (
                <>
                  <View style={[styles.locationFieldStacked, styles.locationFieldBottom, toFocused && styles.locationFieldFocused]}>
                    <Text style={styles.locationLabel}>TO</Text>
                    <View style={styles.locationInputRow}>
                      <Icon name="travel_explore" size={16} color={toFocused ? Colors.secondary : Colors.onSurfaceVariant} />
                      <TextInput
                        style={styles.locationInput}
                        value={to}
                        onChangeText={(t) => { setTo(t); setToFocused(true); }}
                        placeholder="City or station"
                        placeholderTextColor={Colors.onSurfaceVariant}
                        onFocus={() => setToFocused(true)}
                        onBlur={() => setTimeout(() => setToFocused(false), 150)}
                        returnKeyType="done"
                      />
                    </View>
                  </View>

                  {/* TO dropdown */}
                  {toFocused && renderCitySuggestions(to, (city) => {
                    setTo(city.name);
                    setToFocused(false);
                  })}
                </>
              )}

            </View>
          )}

          {/* Date chips */}
          <View style={styles.dateSection}>
            <Text style={styles.fieldLabel}>
              {showReturn ? 'Dates' : config.departureDateLabel}
            </Text>

            {/* Hotel: two chips side by side (check-in / check-out) */}
            {config.alwaysShowReturn ? (
              <View style={styles.dateChipRow}>
                <TouchableOpacity
                  style={[styles.dateChip, styles.dateChipHalf, activeCalendar === 'dep' && styles.dateChipActive]}
                  onPress={() => setActiveCalendar(activeCalendar === 'dep' ? null : 'dep')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.dateChipLabel, activeCalendar === 'dep' && styles.dateChipLabelActive]}>
                    {config.departureDateLabel.toUpperCase()}
                  </Text>
                  <Text style={[styles.dateChipValue, activeCalendar === 'dep' && styles.dateChipValueActive]}>
                    {formatDate(depDate)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.dateChip, styles.dateChipHalf, activeCalendar === 'ret' && styles.dateChipActive]}
                  onPress={() => setActiveCalendar(activeCalendar === 'ret' ? null : 'ret')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.dateChipLabel, activeCalendar === 'ret' && styles.dateChipLabelActive]}>
                    {config.returnDateLabel.toUpperCase()}
                  </Text>
                  <Text style={[styles.dateChipValue, activeCalendar === 'ret' && styles.dateChipValueActive]}>
                    {formatDate(retDate)}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : showReturn ? (
              /* Round-trip: single combined chip */
              <TouchableOpacity
                style={[styles.dateChip, activeCalendar !== null && styles.dateChipActive]}
                onPress={() => setActiveCalendar(activeCalendar !== null ? null : 'dep')}
                activeOpacity={0.8}
              >
                <View style={styles.dateChipIconRow}>
                  <Icon name="calendar_today" size={14} color={activeCalendar !== null ? Colors.secondaryFixed : Colors.onSurfaceVariant} />
                  <Text style={[styles.dateChipValue, activeCalendar !== null && styles.dateChipValueActive]}>
                    {formatDateWithDay(depDate)}{'  →  '}{formatDateWithDay(retDate)}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              /* One-way: single chip with calendar icon */
              <TouchableOpacity
                style={[styles.dateChip, activeCalendar === 'dep' && styles.dateChipActive]}
                onPress={() => setActiveCalendar(activeCalendar === 'dep' ? null : 'dep')}
                activeOpacity={0.8}
              >
                <View style={styles.dateChipIconRow}>
                  <Icon name="calendar_today" size={14} color={activeCalendar === 'dep' ? Colors.secondaryFixed : Colors.onSurfaceVariant} />
                  <Text style={[styles.dateChipValue, activeCalendar === 'dep' && styles.dateChipValueActive]}>
                    {formatDateWithDay(depDate)}
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {/* Inline calendar */}
            {activeCalendar === 'dep' && renderCal(calMonthDep, setCalMonthDep, depDate, (d) => {
              setDepDate(d);
              if (showReturn && d >= retDate) {
                const next = new Date(d);
                next.setDate(d.getDate() + 1);
                setRetDate(next);
              }
            }, calDepRef, calDepWidth, setCalDepWidth,
              showReturn && !config.alwaysShowReturn
                ? () => setActiveCalendar('ret')
                : () => setActiveCalendar(null)
            )}
            {activeCalendar === 'ret' && renderCal(calMonthRet, setCalMonthRet, retDate, (d) => {
              if (d > depDate) setRetDate(d);
            }, calRetRef, calRetWidth, setCalRetWidth, () => setActiveCalendar(null))}

            {activeCalendar === null && (
              <Text style={styles.dateHint}>Tap a date to edit</Text>
            )}
          </View>

          {/* Travelers — Bus & Flight only */}
          {service !== 'hotel' && (
            <View>
              <Text style={styles.fieldLabel}>Travelers</Text>
              <TouchableOpacity
                style={styles.travelersRow}
                onPress={() => setShowTravelers(true)}
                activeOpacity={0.8}
              >
                <Icon name="group" size={20} color={Colors.onSurfaceVariant} />
                <Text style={styles.travelersText}>{travelersLabel()}</Text>
                <Icon name="expand_more" size={20} color={Colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>
          )}

          {/* Search CTA */}
          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch} activeOpacity={0.85}>
            <Icon name="search" size={22} color="#FFFFFF" />
            <Text style={styles.searchBtnText}>{config.searchLabel}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ── Travelers modal ── */}
      <Modal
        transparent
        animationType="slide"
        visible={showTravelers}
        onRequestClose={() => setShowTravelers(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowTravelers(false)} />
        <View style={styles.travSheet}>
          <View style={styles.travHeader}>
            <Text style={styles.travTitle}>Travelers</Text>
            <TouchableOpacity onPress={() => setShowTravelers(false)} style={styles.travClose}>
              <Icon name="close" size={20} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          <View style={styles.travSection}>
            {/* Adults */}
            <View style={styles.travRow}>
              <View style={styles.travLabelGroup}>
                <Text style={styles.travLabel}>Adults</Text>
                <Text style={styles.travSublabel}>Age 12+</Text>
              </View>
              <View style={styles.travStepper}>
                <TouchableOpacity
                  style={[styles.travStepBtn, adults <= 1 && styles.travStepBtnOff]}
                  onPress={() => setAdults((n) => Math.max(1, n - 1))}
                  disabled={adults <= 1}
                >
                  <Icon name="remove" size={18} color={adults <= 1 ? Colors.outlineVariant : Colors.primaryContainer} />
                </TouchableOpacity>
                <Text style={styles.travCount}>{String(adults)}</Text>
                <TouchableOpacity
                  style={[styles.travStepBtn, adults >= 9 && styles.travStepBtnOff]}
                  onPress={() => setAdults((n) => Math.min(9, n + 1))}
                  disabled={adults >= 9}
                >
                  <Icon name="add" size={18} color={adults >= 9 ? Colors.outlineVariant : Colors.primaryContainer} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.travDivider} />
            {/* Children */}
            <View style={styles.travRow}>
              <View style={styles.travLabelGroup}>
                <Text style={styles.travLabel}>Children</Text>
                <Text style={styles.travSublabel}>Age 2–11</Text>
              </View>
              <View style={styles.travStepper}>
                <TouchableOpacity
                  style={[styles.travStepBtn, children <= 0 && styles.travStepBtnOff]}
                  onPress={() => setChildren((n) => Math.max(0, n - 1))}
                  disabled={children <= 0}
                >
                  <Icon name="remove" size={18} color={children <= 0 ? Colors.outlineVariant : Colors.primaryContainer} />
                </TouchableOpacity>
                <Text style={styles.travCount}>{String(children)}</Text>
                <TouchableOpacity
                  style={[styles.travStepBtn, children >= 8 && styles.travStepBtnOff]}
                  onPress={() => setChildren((n) => Math.min(8, n + 1))}
                  disabled={children >= 8}
                >
                  <Icon name="add" size={18} color={children >= 8 ? Colors.outlineVariant : Colors.primaryContainer} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Seat class */}
          <View style={styles.classSection}>
            <Text style={styles.classSectionLabel}>Seat Class</Text>
            <View style={styles.classRow}>
              {(['Economy', 'Business'] as const).map((cls) => {
                const active = seatClass === cls;
                return (
                  <TouchableOpacity
                    key={cls}
                    style={[styles.classChip, active && styles.classChipActive]}
                    onPress={() => setSeatClass(cls)}
                    activeOpacity={0.8}
                  >
                    <Icon
                      name={cls === 'Economy' ? 'airline_seat_recline_normal' : 'airline_seat_flat'}
                      size={18}
                      color={active ? '#FFFFFF' : Colors.onSurface}
                    />
                    <Text style={[styles.classChipText, active && styles.classChipTextActive]}>{cls}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <TouchableOpacity style={styles.travConfirmBtn} onPress={() => setShowTravelers(false)} activeOpacity={0.85}>
            <Text style={styles.travConfirmText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

// ─── Styles — mirrors HomeScreen tokens exactly ───────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },

  // Hero — same gradient + typography as HomeScreen
  hero: {
    paddingHorizontal: 24,
    paddingBottom: 72,
    overflow: 'hidden',
  },
  backBtn: {
    width: 40, height: 40,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  heroIdentity: { gap: 6 },
  heroIconBadge: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
    borderWidth: 1.5, borderColor: Colors.secondaryFixed,
  },
  heroTitle: {
    fontSize: FontSize['3xl'],
    fontFamily: FontFamily.headlineExtraBold,
    color: '#FFFFFF',
    letterSpacing: LetterSpacing.tighter,
  },
  heroSubtitle: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bodyMedium,
    color: Colors.onPrimaryContainer,
  },

  // Scroll — floats the card over the gradient
  scroll: { flex: 1, marginTop: -44 },
  scrollContent: { paddingHorizontal: 20 },

  // Search card — same as HomeScreen searchBox
  searchBox: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 28,
    padding: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },

  // Trip type
  tripTypeRow:        { flexDirection: 'row', gap: 6 },
  tripTypeChip:       { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 10, backgroundColor: Colors.surfaceContainerHigh },
  tripTypeChipActive: { backgroundColor: Colors.primaryContainer },
  tripTypeText:       { fontSize: FontSize.sm, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurfaceVariant },
  tripTypeTextActive: { color: '#FFFFFF' },

  // Destination search — Hotel
  destSection:          { gap: 8 },
  destSearchBar:        { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.surfaceContainerLow, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13, borderWidth: 1.5, borderColor: 'transparent' },
  destSearchBarFocused: { borderColor: Colors.secondary, backgroundColor: Colors.surfaceContainerLowest },
  destInput:            { flex: 1, fontSize: FontSize.base, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurface, padding: 0 },
  suggestions:          { backgroundColor: Colors.surfaceContainerLowest, borderRadius: 14, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  suggestionRow:        { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  suggestionIcon:       { width: 32, height: 32, borderRadius: 8, backgroundColor: Colors.surfaceContainerLow, alignItems: 'center', justifyContent: 'center' },
  suggestionInfo:       { flex: 1 },
  suggestionName:       { fontSize: FontSize.sm, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurface },
  suggestionSub:        { fontSize: FontSize.xs, fontFamily: FontFamily.body, color: Colors.onSurfaceVariant, marginTop: 1 },

  // Location stacked layout
  locationStack:         { gap: 0 },
  locationFieldStacked:  { backgroundColor: Colors.surfaceContainerLow, paddingHorizontal: 14, paddingTop: 10, paddingBottom: 12, borderWidth: 1.5, borderColor: 'transparent' },
  locationFieldTop:      { borderTopLeftRadius: 14, borderTopRightRadius: 14 },
  locationFieldBottom:   { borderBottomLeftRadius: 14, borderBottomRightRadius: 14 },
  locationFieldFocused:  { borderColor: Colors.secondary, backgroundColor: Colors.surfaceContainerLowest },
  locationLabel:         { fontSize: 10, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurfaceVariant, letterSpacing: LetterSpacing.widest, marginBottom: 4 },
  locationInputRow:      { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationInput:         { flex: 1, fontSize: FontSize.base, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurface, padding: 0 },

  // Swap divider row
  swapDividerRow:  { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 1, backgroundColor: Colors.surfaceContainerLow },
  swapDividerLine: { flex: 1, height: 1, backgroundColor: Colors.surfaceContainerHigh },
  swapBtn:         { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.secondary, alignItems: 'center', justifyContent: 'center', marginHorizontal: 10, shadowColor: Colors.secondary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },

  // Date section
  fieldLabel:  { fontSize: 12, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurfaceVariant, marginLeft: 2 },
  dateSection: { gap: 10 },
  dateChipRow:     { flexDirection: 'row', gap: 8 },
  dateChipIconRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dateChip:    { flex: 1, backgroundColor: Colors.surfaceContainerLow, borderRadius: 14, paddingHorizontal: 14, paddingTop: 10, paddingBottom: 12 },
  dateChipHalf:{ flex: 1 },
  dateChipActive:      { backgroundColor: Colors.primaryContainer },
  dateChipLabel:       { fontSize: 10, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurfaceVariant, letterSpacing: LetterSpacing.widest, marginBottom: 4 },
  dateChipLabelActive: { color: Colors.secondaryFixed },
  dateChipValue:       { fontSize: FontSize.base, fontFamily: FontFamily.headline, color: Colors.onSurface },
  dateChipValueActive: { color: '#FFFFFF' },
  dateHint:    { fontSize: FontSize.xs, fontFamily: FontFamily.body, color: Colors.onSurfaceVariant, textAlign: 'center' },

  // Inline calendar
  inlineCal:    { backgroundColor: Colors.surfaceContainerLow, borderRadius: 16, paddingTop: 4, paddingBottom: 8 },
  calMonthRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 10 },
  calNavBtn:    { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 18, backgroundColor: Colors.surfaceContainerLowest },
  calMonthLabel:{ fontSize: FontSize.md, fontFamily: FontFamily.headline, color: Colors.primary },
  calBody:      { paddingHorizontal: 4 },
  calWeekRow:   { flexDirection: 'row' },
  calDow:       { flex: 1, textAlign: 'center', fontSize: 11, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurfaceVariant, paddingVertical: 6 },
  calDowWeekend:{ color: Colors.secondary },
  calCell:      { flex: 1, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 21 },
  calCellSelected: { backgroundColor: Colors.primaryContainer },
  calCellInRange:  { backgroundColor: Colors.surfaceContainerHigh },
  calDayText:      { fontSize: FontSize.sm, fontFamily: FontFamily.bodyMedium, color: Colors.onSurface },
  calDayWeekend:   { color: Colors.secondary },
  calDayToday:     { color: Colors.secondary, fontFamily: FontFamily.headline },
  calDaySelected:  { color: '#FFFFFF', fontFamily: FontFamily.bodySemiBold },
  calDayInRange:   { color: Colors.primaryContainer, fontFamily: FontFamily.bodySemiBold },
  calDayDisabled:  { color: Colors.outlineVariant },

  // Travelers row
  travelersRow:  { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceContainerLow, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  travelersText: { flex: 1, fontSize: FontSize.sm, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurface },

  // Search button — identical to HomeScreen
  searchBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.secondary, borderRadius: 12, paddingVertical: 16, shadowColor: Colors.secondary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 6 },
  searchBtnText: { fontSize: FontSize.md, fontFamily: FontFamily.headlineSemiBold, color: '#FFFFFF', letterSpacing: LetterSpacing.tight },

  // Modal overlay
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,6,21,0.5)' },

  // Travelers sheet
  travSheet:     { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 36 },
  travHeader:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  travTitle:     { fontSize: FontSize.lg, fontFamily: FontFamily.headlineExtraBold, color: Colors.primary, letterSpacing: LetterSpacing.tighter },
  travClose:     { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.surfaceContainerHigh, borderRadius: 16 },
  travSection:   { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 8 },
  travRow:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  travLabelGroup:{ gap: 2 },
  travLabel:     { fontSize: FontSize.md, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurface },
  travSublabel:  { fontSize: FontSize.xs, fontFamily: FontFamily.body, color: Colors.onSurfaceVariant },
  travDivider:   { height: 1, backgroundColor: Colors.surfaceContainerHigh },
  travStepper:   { flexDirection: 'row', alignItems: 'center', gap: 16 },
  travStepBtn:   { width: 36, height: 36, borderRadius: 18, borderWidth: 1.5, borderColor: Colors.primaryContainer, alignItems: 'center', justifyContent: 'center' },
  travStepBtnOff:{ borderColor: Colors.outlineVariant },
  travCount:     { fontSize: FontSize.lg, fontFamily: FontFamily.headline, color: Colors.onSurface, minWidth: 24, textAlign: 'center' },
  classSection:      { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  classSectionLabel: { fontSize: 12, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurfaceVariant, marginBottom: 12 },
  classRow:          { flexDirection: 'row', gap: 12 },
  classChip:         { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 12, backgroundColor: Colors.surfaceContainerHigh },
  classChipActive:   { backgroundColor: Colors.primaryContainer },
  classChipText:     { fontSize: FontSize.sm, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurface },
  classChipTextActive: { color: '#FFFFFF' },
  travConfirmBtn:  { marginHorizontal: 20, marginTop: 20, marginBottom: 8, backgroundColor: Colors.secondary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', shadowColor: Colors.secondary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 6 },
  travConfirmText: { fontSize: FontSize.md, fontFamily: FontFamily.headlineSemiBold, color: '#FFFFFF', letterSpacing: LetterSpacing.tight },

});
