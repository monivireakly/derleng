import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize, LetterSpacing } from '../theme/typography';
import { Icon } from '../components/Icon';

interface RedirectingScreenProps {
  navigation: any;
}

export function RedirectingScreen({ navigation }: RedirectingScreenProps) {
  const insets = useSafeAreaInsets();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.12, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    Animated.timing(progress, { toValue: 1, duration: 3000, useNativeDriver: false }).start(() => {
      navigation.replace('TicketSuccess');
    });
  }, []);

  const progressWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <Animated.View style={[styles.outerRing, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.innerRing}>
            <Icon name="directions_bus" size={48} color={Colors.primary} />
          </View>
        </Animated.View>

        <Text style={styles.title}>Connecting to partner…</Text>
        <Text style={styles.subtitle}>Securing your seat on{'\n'}Phnom Penh → Siem Reap</Text>

        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
        <Text style={styles.progressLabel}>Verifying availability & pricing</Text>

        <View style={styles.steps}>
          {[
            { icon: 'lock', text: 'Secure SSL connection established' },
            { icon: 'inventory_2', text: 'Checking seat availability' },
            { icon: 'price_check', text: 'Confirming live pricing' },
          ].map((step, i) => (
            <View key={i} style={styles.step}>
              <Icon name={step.icon} size={18} color={Colors.secondaryFixed} />
              <Text style={styles.stepText}>{step.text}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primaryContainer },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 16 },
  outerRing: { width: 120, height: 120, borderRadius: 60, backgroundColor: `${Colors.secondaryFixed}20`, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  innerRing: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.secondaryFixed, alignItems: 'center', justifyContent: 'center', shadowColor: Colors.secondaryFixed, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
  title: { fontSize: FontSize['2xl'], fontFamily: FontFamily.headlineExtraBold, color: '#FFFFFF', letterSpacing: LetterSpacing.tighter, textAlign: 'center' },
  subtitle: { fontSize: FontSize.md, fontFamily: FontFamily.bodyMedium, color: Colors.onPrimaryContainer, textAlign: 'center', lineHeight: 24 },
  progressTrack: { width: '100%', height: 6, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 3, overflow: 'hidden', marginTop: 8 },
  progressFill: { height: '100%', backgroundColor: Colors.secondaryFixed, borderRadius: 3 },
  progressLabel: { fontSize: FontSize.xs, fontFamily: FontFamily.bodyMedium, color: Colors.onPrimaryContainer, letterSpacing: LetterSpacing.wide },
  steps: { marginTop: 24, gap: 12, width: '100%' },
  step: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepText: { fontSize: FontSize.sm, fontFamily: FontFamily.bodyMedium, color: Colors.onPrimaryContainer },
});
