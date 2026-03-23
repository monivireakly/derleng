import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize, LetterSpacing } from '../theme/typography';
import { Icon } from '../components/Icon';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ServiceTile {
  key: string;
  label: string;
  icon: string;
  searchable: boolean;
}

interface RecentSearch {
  from: string;
  to: string;
  meta: string;
  active: boolean;
  service: 'bus' | 'flight' | 'hotel';
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICES: ServiceTile[] = [
  { key: 'bus',    label: 'Bus',     icon: 'directions_bus', searchable: true  },
  { key: 'flight', label: 'Flights', icon: 'flight',         searchable: true  },
  { key: 'hotel',  label: 'Hotels',  icon: 'hotel',          searchable: true  },
  { key: 'fun',    label: 'Fun',     icon: 'local_activity', searchable: false },
];

const INITIAL_RECENT: RecentSearch[] = [
  { from: 'PP', to: 'Siem Reap',  meta: 'Oct 24 • 1 Adult',  active: true,  service: 'bus'   },
  { from: 'Sihanoukville', to: 'Koh Rong', meta: 'Oct 28 • 2 Adults', active: false, service: 'bus' },
];

const POPULAR_ROUTES: {
  from: string; to: string; badge?: string; price: string;
  subtitle?: string; image: ImageSourcePropType;
  service: 'bus' | 'flight' | 'hotel';
}[] = [
  { from: 'Phnom Penh',    to: 'Siem Reap', badge: 'Daily Departures', price: '$12.00', subtitle: 'Travel to the heart of Khmer history', image: require('../../assets/images/siem-reap.jpg'), service: 'bus'    },
  { from: 'Sihanoukville', to: 'Koh Rong',  badge: 'Ferry & Speedboat', price: '$25.00', image: require('../../assets/images/koh-rong.jpg'),  service: 'flight' },
  { from: 'Phnom Penh',    to: 'Kep',       price: '$10.50', image: require('../../assets/images/kep.jpg'),     service: 'bus'    },
  { from: 'Phnom Penh',    to: 'Kampot',    price: '$9.00',  image: require('../../assets/images/kampot.jpg'),  service: 'bus'    },
];

const PROMOS: { tag: string; title: string; body: string; gradient: [string, string] }[] = [
  { tag: 'NEW USER',       title: '10% off your first bus booking',   body: 'Use code DERLENG10 at checkout',           gradient: [Colors.primaryContainer, '#1A3A5C'] },
  { tag: 'FLASH DEAL',     title: 'Phnom Penh → Siem Reap from $8',   body: 'Today only — limited seats available',      gradient: ['#006B5C', '#004D42']              },
  { tag: 'HOTELS',         title: 'Free breakfast on select stays',   body: 'Book 2+ nights and save on your morning',  gradient: ['#1A2B4A', Colors.primaryContainer] },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

// ─── Screen ───────────────────────────────────────────────────────────────────

interface HomeScreenProps { navigation: any; }

export function HomeScreen({ navigation }: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  const [lastService,   setLastService]   = useState('bus');
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(INITIAL_RECENT);

  const openService = (s: ServiceTile) => {
    if (!s.searchable) return;
    setLastService(s.key);
    navigation.navigate('ServiceSearch', {
      service: s.key as 'bus' | 'flight' | 'hotel',
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingTop: insets.top + 64, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero ── */}
        <LinearGradient
          colors={[Colors.primaryContainer, Colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Text style={styles.heroTitle}>{greeting()} 👋</Text>
          <Text style={styles.heroSubtitle}>Discover seamless travel across Cambodia</Text>

          {/* Service tiles */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.servicesScroll}
            contentContainerStyle={styles.servicesContent}
          >
            {SERVICES.map((s) => {
              const isActive = s.key === lastService && s.searchable;
              return (
                <TouchableOpacity
                  key={s.key}
                  style={[
                    styles.serviceTile,
                    isActive ? styles.serviceTileActive
                      : s.searchable ? styles.serviceTileEnabled
                      : styles.serviceTileDisabled,
                  ]}
                  onPress={() => openService(s)}
                  activeOpacity={s.searchable ? 0.8 : 1}
                >
                  <Icon
                    name={s.icon}
                    size={26}
                    color={isActive ? Colors.primaryContainer : s.searchable ? '#FFFFFF' : 'rgba(255,255,255,0.3)'}
                  />
                  <Text style={[
                    styles.serviceLabel,
                    isActive ? styles.serviceLabelActive
                      : s.searchable ? styles.serviceLabelEnabled
                      : styles.serviceLabelDisabled,
                  ]}>
                    {s.label}
                  </Text>
                  {!s.searchable && (
                    <View style={styles.soonBadge}><Text style={styles.soonText}>SOON</Text></View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.heroCta}>
            <Icon name="touch_app" size={15} color="rgba(255,255,255,0.5)" />
            <Text style={styles.heroCtaText}>Tap a service to start searching</Text>
          </View>
        </LinearGradient>

        {/* ── Content ── */}
        <View style={styles.content}>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <TouchableOpacity onPress={() => setRecentSearches([])}>
                  <Text style={styles.sectionAction}>Clear all</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                {recentSearches.map((r, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[styles.recentCard, r.active && styles.recentCardActive]}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('ServiceSearch', { service: r.service })}
                  >
                    <View style={styles.recentIcon}>
                      <Icon name="history" size={22} color={Colors.onPrimaryContainer} />
                    </View>
                    <View>
                      <Text style={styles.recentRoute}>{r.from} → {r.to}</Text>
                      <Text style={styles.recentMeta}>{r.meta}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Promotions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Deals & Offers</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {PROMOS.map((p, i) => (
                <LinearGradient
                  key={i}
                  colors={p.gradient as [string, string]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.promoCard}
                >
                  <View style={styles.promoTag}>
                    <Text style={styles.promoTagText}>{p.tag}</Text>
                  </View>
                  <Text style={styles.promoTitle}>{p.title}</Text>
                  <Text style={styles.promoBody}>{p.body}</Text>
                </LinearGradient>
              ))}
            </ScrollView>
          </View>

          {/* Popular Routes */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Routes</Text>
            </View>
            <View style={styles.routeGrid}>
              {POPULAR_ROUTES.map((r, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.routeCard}
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate('ServiceSearch', { service: r.service })}
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
  container:    { flex: 1, backgroundColor: Colors.surface },
  scroll:       { flex: 1 },

  hero:         { paddingHorizontal: 24, paddingTop: 48, paddingBottom: 48, overflow: 'hidden' },
  heroTitle:    { fontSize: FontSize['4xl'], fontFamily: FontFamily.headlineExtraBold, color: '#FFFFFF', letterSpacing: LetterSpacing.tighter, marginBottom: 4 },
  heroSubtitle: { fontSize: FontSize.base, fontFamily: FontFamily.bodyMedium, color: Colors.onPrimaryContainer, marginBottom: 24 },
  heroCta:      { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16 },
  heroCtaText:  { fontSize: FontSize.xs, fontFamily: FontFamily.body, color: 'rgba(255,255,255,0.5)' },

  servicesScroll:        { marginBottom: 0 },
  servicesContent:       { gap: 12, paddingRight: 24 },
  serviceTile:           { width: 80, height: 80, borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 4, overflow: 'hidden' },
  serviceTileActive:     { backgroundColor: Colors.secondaryFixed },
  serviceTileEnabled:    { backgroundColor: 'rgba(255,255,255,0.15)' },
  serviceTileDisabled:   { backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  serviceLabel:          { fontSize: 11, fontFamily: FontFamily.bodySemiBold, letterSpacing: LetterSpacing.widest, textTransform: 'uppercase' },
  serviceLabelActive:    { color: Colors.primaryContainer },
  serviceLabelEnabled:   { color: '#FFFFFF' },
  serviceLabelDisabled:  { color: 'rgba(255,255,255,0.3)' },
  soonBadge:             { position: 'absolute', top: 4, right: 4, backgroundColor: Colors.secondary, paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4 },
  soonText:              { fontSize: 7, fontFamily: FontFamily.bodySemiBold, color: '#fff', letterSpacing: 0.5 },

  content:        { paddingHorizontal: 24, paddingTop: 32 },
  section:        { marginBottom: 48 },
  sectionHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle:   { fontSize: FontSize['2xl'], fontFamily: FontFamily.headline, color: Colors.onSurface, letterSpacing: LetterSpacing.tight },
  sectionAction:  { fontSize: FontSize.sm, fontFamily: FontFamily.bodySemiBold, color: Colors.secondary },

  recentCard:       { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: Colors.surfaceContainerLowest, padding: 16, borderRadius: 12, minWidth: 240, borderLeftWidth: 4, borderLeftColor: Colors.outlineVariant, shadowColor: Colors.primaryContainer, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  recentCardActive: { borderLeftColor: Colors.secondary },
  recentIcon:       { backgroundColor: Colors.surfaceContainerLow, padding: 8, borderRadius: 8 },
  recentRoute:      { fontSize: FontSize.sm, fontFamily: FontFamily.headline, color: Colors.onSurface },
  recentMeta:       { fontSize: FontSize.xs, fontFamily: FontFamily.body, color: Colors.onSurfaceVariant, marginTop: 2 },

  promoCard:        { width: 280, borderRadius: 16, padding: 20, gap: 6, justifyContent: 'flex-end' },
  promoTag:         { alignSelf: 'flex-start', backgroundColor: 'rgba(101,250,222,0.2)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginBottom: 4 },
  promoTagText:     { fontSize: 9, fontFamily: FontFamily.bodySemiBold, color: Colors.secondaryFixed, letterSpacing: LetterSpacing.widest },
  promoTitle:       { fontSize: FontSize.md, fontFamily: FontFamily.headlineExtraBold, color: '#FFFFFF', letterSpacing: LetterSpacing.tight },
  promoBody:        { fontSize: FontSize.xs, fontFamily: FontFamily.body, color: 'rgba(255,255,255,0.6)', marginTop: 2 },

  routeGrid:        { gap: 16 },
  routeCard:        { borderRadius: 16, overflow: 'hidden', backgroundColor: Colors.primaryContainer, justifyContent: 'flex-end', height: 200 },
  routeCardContent: { padding: 20 },
  routeBadge:       { alignSelf: 'flex-start', backgroundColor: Colors.secondaryFixed, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, marginBottom: 8 },
  routeBadgeText:   { fontSize: 10, fontFamily: FontFamily.bodySemiBold, color: Colors.primaryContainer, letterSpacing: LetterSpacing.widest, textTransform: 'uppercase' },
  routeTitle:       { fontSize: FontSize.xl, fontFamily: FontFamily.headline, color: '#FFFFFF', marginBottom: 4 },
  routeSubtitle:    { fontSize: FontSize.sm, fontFamily: FontFamily.body, color: Colors.onPrimaryContainer, marginBottom: 4 },
  routePrice:       { fontSize: FontSize['2xl'], fontFamily: FontFamily.headline, color: Colors.secondaryFixed, fontWeight: '700' },
});
