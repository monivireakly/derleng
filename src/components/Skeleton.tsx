import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';

const W = Dimensions.get('window').width;

// ─── Hook: one loop drives all Bones in a skeleton group ─────────────────────

export function useShimmer() {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: 1100,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return anim.interpolate({ inputRange: [0, 1], outputRange: [-W, W] });
}

// ─── Bone: a single skeleton placeholder rectangle ───────────────────────────

interface BoneProps {
  tx: Animated.AnimatedInterpolation<number>;
  w?: number | `${number}%`;
  h?: number;
  radius?: number;
  style?: object;
}

export function Bone({ tx, w = '100%', h = 14, radius = 7, style }: BoneProps) {
  return (
    <View
      style={[
        {
          width: w as any,
          height: h,
          borderRadius: radius,
          backgroundColor: Colors.surfaceContainerHigh,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          { transform: [{ translateX: tx }] },
        ]}
      >
        <LinearGradient
          colors={[
            'transparent',
            'rgba(255,255,255,0.16)',
            'rgba(255,255,255,0.26)',
            'rgba(255,255,255,0.16)',
            'transparent',
          ]}
          locations={[0, 0.3, 0.5, 0.7, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>
    </View>
  );
}

// ─── SearchResults skeleton ───────────────────────────────────────────────────

export function SearchResultsSkeleton() {
  const tx = useShimmer();
  return (
    <View style={sk.resultsList}>
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={sk.resultCard}>
          <View style={sk.cardPad}>
            {/* Header: logo + name + price */}
            <View style={sk.row}>
              <Bone tx={tx} w={52} h={52} radius={12} />
              <View style={[sk.col, { flex: 1, marginLeft: 12 }]}>
                <Bone tx={tx} w="60%" h={14} radius={7} />
                <Bone tx={tx} w="40%" h={10} radius={5} style={{ marginTop: 7 }} />
              </View>
              <View style={[sk.col, { alignItems: 'flex-end', gap: 6 }]}>
                <Bone tx={tx} w={48} h={22} radius={6} />
                <Bone tx={tx} w={64} h={10} radius={5} />
              </View>
            </View>

            {/* Timeline */}
            <View style={[sk.row, { marginTop: 20, alignItems: 'center' }]}>
              <View style={sk.col}>
                <Bone tx={tx} w={52} h={22} radius={6} />
                <Bone tx={tx} w={40} h={10} radius={5} style={{ marginTop: 5 }} />
              </View>
              <View style={[sk.col, { flex: 1, alignItems: 'center', gap: 6, paddingHorizontal: 12 }]}>
                <Bone tx={tx} w={48} h={10} radius={5} />
                <Bone tx={tx} w="90%" h={4} radius={2} />
              </View>
              <View style={[sk.col, { alignItems: 'flex-end' }]}>
                <Bone tx={tx} w={52} h={22} radius={6} />
                <Bone tx={tx} w={40} h={10} radius={5} style={{ marginTop: 5 }} />
              </View>
            </View>

            {/* Footer */}
            <View style={[sk.row, { marginTop: 18, paddingTop: 14, borderTopWidth: 1, borderTopColor: Colors.surfaceContainerHigh }]}>
              <Bone tx={tx} w="45%" h={12} radius={6} />
              <Bone tx={tx} w={88} h={36} radius={12} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

// ─── MyTrips skeleton ─────────────────────────────────────────────────────────

export function TripsSkeleton() {
  const tx = useShimmer();
  return (
    <View style={{ gap: 16 }}>
      {[0, 1].map((i) => (
        <View key={i} style={sk.tripCard}>
          {/* Accent bar */}
          <View style={sk.accentBar} />

          <View style={sk.cardPad}>
            {/* Header: icon + meta + pill */}
            <View style={sk.row}>
              <Bone tx={tx} w={38} h={38} radius={8} style={{ flexShrink: 0 }} />
              <View style={[sk.col, { flex: 1, marginLeft: 10 }]}>
                <Bone tx={tx} w="40%" h={10} radius={5} />
                <Bone tx={tx} w="70%" h={16} radius={7} style={{ marginTop: 5 }} />
              </View>
              <Bone tx={tx} w={72} h={24} radius={12} />
            </View>

            {/* Time row */}
            <View style={[sk.row, { marginTop: 12, alignItems: 'center' }]}>
              <View style={sk.col}>
                <Bone tx={tx} w={56} h={22} radius={6} />
                <Bone tx={tx} w={44} h={10} radius={5} style={{ marginTop: 4 }} />
              </View>
              <View style={{ flex: 1, paddingHorizontal: 12 }}>
                <Bone tx={tx} w="100%" h={4} radius={2} />
              </View>
              <View style={[sk.col, { alignItems: 'flex-end' }]}>
                <Bone tx={tx} w={56} h={22} radius={6} />
                <Bone tx={tx} w={44} h={10} radius={5} style={{ marginTop: 4 }} />
              </View>
            </View>

            {/* Chip row */}
            <View style={[sk.row, { gap: 8, marginTop: 10 }]}>
              <Bone tx={tx} w={110} h={28} radius={8} />
              <Bone tx={tx} w={90}  h={28} radius={8} />
            </View>
          </View>

          {/* Footer */}
          <View style={sk.tripFooter}>
            <Bone tx={tx} w={100} h={11} radius={5} />
            <Bone tx={tx} w={88}  h={11} radius={5} />
          </View>
        </View>
      ))}
    </View>
  );
}

// ─── Purchases skeleton ───────────────────────────────────────────────────────

export function PurchasesSkeleton() {
  const tx = useShimmer();
  return (
    <View style={{ gap: 14 }}>
      {/* Summary card skeleton */}
      <View style={sk.summaryCard}>
        {[0, 1, 2].map((i) => (
          <React.Fragment key={i}>
            {i > 0 && <View style={sk.summaryDivider} />}
            <View style={[sk.col, { flex: 1, alignItems: 'center', gap: 8 }]}>
              <Bone tx={tx} w={40} h={24} radius={6} />
              <Bone tx={tx} w={56} h={10} radius={5} />
            </View>
          </React.Fragment>
        ))}
      </View>

      {/* Purchase cards */}
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={sk.purchaseCard}>
          <View style={sk.colorBar} />
          <View style={[sk.cardPad, { flex: 1, gap: 10 }]}>
            {/* Top */}
            <View style={sk.row}>
              <Bone tx={tx} w={40} h={40} radius={10} style={{ flexShrink: 0 }} />
              <View style={[sk.col, { flex: 1, marginLeft: 10 }]}>
                <Bone tx={tx} w="55%" h={13} radius={6} />
                <Bone tx={tx} w="40%" h={10} radius={5} style={{ marginTop: 5 }} />
              </View>
              <View style={[sk.col, { alignItems: 'flex-end', gap: 6 }]}>
                <Bone tx={tx} w={52} h={18} radius={5} />
                <Bone tx={tx} w={64} h={18} radius={9} />
              </View>
            </View>
            {/* Route */}
            <Bone tx={tx} w="75%" h={12} radius={6} />
            {/* Meta */}
            <View style={[sk.row, { gap: 20 }]}>
              <Bone tx={tx} w={110} h={10} radius={5} />
              <Bone tx={tx} w={70}  h={10} radius={5} />
            </View>
            {/* Footer */}
            <View style={[sk.row, { paddingTop: 8, borderTopWidth: 1, borderTopColor: Colors.surfaceContainerHigh }]}>
              <Bone tx={tx} w={110} h={10} radius={5} />
              <Bone tx={tx} w={80}  h={10} radius={5} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

// ─── Shared skeleton styles ───────────────────────────────────────────────────

const sk = StyleSheet.create({
  col: { flexDirection: 'column' },
  row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },

  // SearchResults
  resultsList: { paddingHorizontal: 16, paddingTop: 16, gap: 16 },
  resultCard:  { backgroundColor: Colors.surfaceContainerLowest, borderRadius: 16, overflow: 'hidden', shadowColor: Colors.primaryContainer, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 20, elevation: 3 },
  cardPad:     { padding: 18 },

  // MyTrips
  tripCard:   { backgroundColor: Colors.surfaceContainerLowest, borderRadius: 14, overflow: 'hidden', shadowColor: Colors.primaryContainer, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 2 },
  accentBar:  { height: 3, backgroundColor: Colors.surfaceContainerHigh },
  tripFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: Colors.surfaceContainerLow },

  // Purchases
  summaryCard:    { flexDirection: 'row', backgroundColor: Colors.primaryContainer, borderRadius: 16, padding: 20, alignItems: 'center' },
  summaryDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.15)' },
  purchaseCard:   { flexDirection: 'row', backgroundColor: Colors.surfaceContainerLowest, borderRadius: 14, overflow: 'hidden', shadowColor: Colors.primaryContainer, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2 },
  colorBar:       { width: 4, backgroundColor: Colors.surfaceContainerHigh },
});
