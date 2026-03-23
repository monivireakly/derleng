import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize, LetterSpacing } from '../theme/typography';
import { Icon } from '../components/Icon';

const { width: W } = Dimensions.get('window');

// ─── Slide definitions ────────────────────────────────────────────────────────

interface Slide {
  icon: string;
  gradientA: string;
  gradientB: string;
  headline: string;
  body: string;
}

const SLIDES: Slide[] = [
  {
    icon: 'search',
    gradientA: Colors.primaryContainer,
    gradientB: Colors.primary,
    headline: 'Discover your next journey',
    body: 'Search buses, flights, and hotels across Cambodia and Southeast Asia — all in one place.',
  },
  {
    icon: 'confirmation_number',
    gradientA: '#006B5C',
    gradientB: '#003D35',
    headline: 'Book in a few taps',
    body: 'Compare prices, pick your seat, and confirm your booking without leaving the app.',
  },
  {
    icon: 'qr_code_scanner',
    gradientA: '#1A3A5C',
    gradientB: Colors.primary,
    headline: 'Your ticket, always with you',
    body: "Your e-ticket lives on your phone. Scan it at boarding and you're ready to go.",
  },
];

// ─── Animated slide content ───────────────────────────────────────────────────

interface SlideContentProps {
  slide: Slide;
  isActive: boolean;
}

function SlideContent({ slide, isActive }: SlideContentProps) {
  // Entrance
  const illusScale   = useRef(new Animated.Value(0.82)).current;
  const illusFade    = useRef(new Animated.Value(0)).current;
  const textFade     = useRef(new Animated.Value(0)).current;
  const textSlide    = useRef(new Animated.Value(28)).current;
  const tagFade      = useRef(new Animated.Value(0)).current;
  // Continuous
  const floatY       = useRef(new Animated.Value(0)).current;
  const ringScale    = useRef(new Animated.Value(1)).current;
  const dot1Fade     = useRef(new Animated.Value(0)).current;
  const dot2Fade     = useRef(new Animated.Value(0)).current;
  const dot3Fade     = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isActive) return;

    // Reset entrance values
    illusScale.setValue(0.82);
    illusFade.setValue(0);
    textFade.setValue(0);
    textSlide.setValue(28);
    tagFade.setValue(0);

    // ── Entrance sequence ──────────────────────────────────────────────────
    Animated.sequence([
      // 1. Illustration springs in
      Animated.parallel([
        Animated.spring(illusScale, { toValue: 1, tension: 65, friction: 9, useNativeDriver: true }),
        Animated.timing(illusFade, { toValue: 1, duration: 350, useNativeDriver: true }),
      ]),
      // 2. Tag (permission only) fades in
      Animated.timing(tagFade, { toValue: 1, duration: 250, delay: 0, useNativeDriver: true }),
      // 3. Text slides up
      Animated.parallel([
        Animated.timing(textFade,  { toValue: 1, duration: 320, useNativeDriver: true }),
        Animated.spring(textSlide, { toValue: 0, tension: 80, friction: 11, useNativeDriver: true }),
      ]),
      // 4. Decorative dots stagger in
      Animated.stagger(80, [
        Animated.timing(dot1Fade, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(dot2Fade, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(dot3Fade, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]),
    ]).start();

    // ── Float loop — gentle vertical bob ──────────────────────────────────
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, { toValue: -12, duration: 2200, useNativeDriver: true }),
        Animated.timing(floatY, { toValue: 0,   duration: 2200, useNativeDriver: true }),
      ])
    );
    floatLoop.start();

    // ── Ring pulse loop — slow breathing ─────────────────────────────────
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(ringScale, { toValue: 1.07, duration: 1800, useNativeDriver: true }),
        Animated.timing(ringScale, { toValue: 1.0,  duration: 1800, useNativeDriver: true }),
      ])
    );
    pulseLoop.start();

    return () => {
      floatLoop.stop();
      pulseLoop.stop();
      floatY.setValue(0);
      ringScale.setValue(1);
    };
  }, [isActive]);

  return (
    <View style={sc.root}>
      {/* ── Illustration ── */}
      <Animated.View style={[sc.illusWrap, { opacity: illusFade, transform: [{ scale: illusScale }] }]}>
        <View style={sc.rings}>
          {/* Outer rings that pulse */}
          <Animated.View style={[sc.ring3, { transform: [{ scale: ringScale }] }]} />
          <Animated.View style={[sc.ring2, { transform: [{ scale: ringScale }] }]} />
          <Animated.View style={sc.ring1} />

          {/* Floating main circle */}
          <Animated.View style={{ transform: [{ translateY: floatY }] }}>
            <LinearGradient
              colors={[slide.gradientA, slide.gradientB]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={sc.circle}
            >
              <Icon name={slide.icon} size={56} color={Colors.secondaryFixed} />
            </LinearGradient>
          </Animated.View>

          {/* Decorative dots */}
          <Animated.View style={[sc.dot, sc.dot1, { opacity: dot1Fade }]} />
          <Animated.View style={[sc.dot, sc.dot2, { opacity: dot2Fade }]} />
          <Animated.View style={[sc.dot, sc.dot3, { opacity: dot3Fade }]} />
        </View>
      </Animated.View>

      {/* ── Text block ── */}
      <Animated.View style={[sc.textBlock, { opacity: textFade, transform: [{ translateY: textSlide }] }]}>
        <Text style={sc.headline}>{slide.headline}</Text>
        <Text style={sc.body}>{slide.body}</Text>
      </Animated.View>
    </View>
  );
}

const sc = StyleSheet.create({
  root:      { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 40, paddingHorizontal: 32 },

  illusWrap: { alignItems: 'center', justifyContent: 'center' },
  rings:     { width: 260, height: 260, alignItems: 'center', justifyContent: 'center' },
  ring3:     { position: 'absolute', width: 240, height: 240, borderRadius: 120, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  ring2:     { position: 'absolute', width: 192, height: 192, borderRadius: 96,  borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' },
  ring1:     { position: 'absolute', width: 148, height: 148, borderRadius: 74,  borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)' },

  circle: { width: 116, height: 116, borderRadius: 58, alignItems: 'center', justifyContent: 'center', shadowColor: Colors.secondaryFixed, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 28, elevation: 14 },

  dot:  { position: 'absolute', borderRadius: 999 },
  dot1: { top: 28,  right: 44, width: 10, height: 10, backgroundColor: Colors.secondaryFixed, opacity: 0.5 },
  dot2: { top: 68,  left: 32,  width: 6,  height: 6,  backgroundColor: '#FFFFFF',             opacity: 0.2 },
  dot3: { bottom: 36, right: 28, width: 8, height: 8, backgroundColor: Colors.secondaryFixed, opacity: 0.35 },

  textBlock: { alignItems: 'center', gap: 14 },

  headline: { fontSize: FontSize['3xl'], fontFamily: FontFamily.headlineExtraBold, color: '#FFFFFF', textAlign: 'center', letterSpacing: LetterSpacing.tighter, lineHeight: 36 },
  body:     { fontSize: FontSize.md, fontFamily: FontFamily.bodyMedium, color: 'rgba(255,255,255,0.62)', textAlign: 'center', lineHeight: 26 },
});

// ─── Animated dot indicator ───────────────────────────────────────────────────

function AnimatedDot({ active, past, onPress }: { active: boolean; past: boolean; onPress: () => void }) {
  const widthAnim = useRef(new Animated.Value(active ? 24 : 6)).current;
  const opacityAnim = useRef(new Animated.Value(active ? 1 : past ? 0.45 : 0.25)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(widthAnim,   { toValue: active ? 24 : 6,                       useNativeDriver: false, tension: 80, friction: 10 }),
      Animated.timing(opacityAnim, { toValue: active ? 1 : past ? 0.45 : 0.25, duration: 300, useNativeDriver: false }),
    ]).start();
  }, [active, past]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
      <Animated.View style={[dots.dot, { width: widthAnim, opacity: opacityAnim }]} />
    </TouchableOpacity>
  );
}

const dots = StyleSheet.create({
  dot: { height: 6, borderRadius: 3, backgroundColor: Colors.secondaryFixed },
});

// ─── Screen ───────────────────────────────────────────────────────────────────

interface Props { onDone: () => void; }

export function OnboardingScreen({ onDone }: Props) {
  const insets    = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const isLast = activeIdx === SLIDES.length - 1;

  const goTo = (idx: number) => {
    scrollRef.current?.scrollTo({ x: idx * W, animated: true });
    setActiveIdx(idx);
  };

  const handleNext = () => { isLast ? onDone() : goTo(activeIdx + 1); };

  // Fade for skip button
  const skipFade = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.timing(skipFade, {
      toValue: isLast ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isLast]);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 24 }]}>

      {/* Skip */}
      <Animated.View style={[styles.skipWrap, { top: insets.top + 16, opacity: skipFade }]} pointerEvents={isLast ? 'none' : 'auto'}>
        <TouchableOpacity style={styles.skipBtn} onPress={onDone} activeOpacity={0.7}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Carousel */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        decelerationRate="fast"
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / W);
          setActiveIdx(idx);
        }}
        style={styles.scroll}
      >
        {SLIDES.map((s, i) => (
          <LinearGradient
            key={i}
            colors={[s.gradientA, s.gradientB]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.slide, { paddingTop: insets.top + 48 }]}
          >
            <SlideContent slide={s} isActive={activeIdx === i} />
          </LinearGradient>
        ))}
      </ScrollView>

      {/* Bottom controls */}
      <View style={styles.controls}>
        {/* Dot indicators */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <AnimatedDot
              key={i}
              active={activeIdx === i}
              past={activeIdx > i}
              onPress={() => goTo(i)}
            />
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.85}>
          <Text style={styles.nextBtnText}>{isLast ? 'Get Started' : 'Next'}</Text>
          {!isLast && <Icon name="arrow_forward" size={20} color={Colors.primaryContainer} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },

  skipWrap: { position: 'absolute', right: 24, zIndex: 10 },
  skipBtn:  { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.12)' },
  skipText: { fontSize: FontSize.sm, fontFamily: FontFamily.bodySemiBold, color: 'rgba(255,255,255,0.7)' },

  scroll: { flex: 1 },
  slide:  { width: W, flex: 1, paddingBottom: 24 },

  controls: { paddingHorizontal: 24, paddingTop: 16, gap: 20 },

  dotsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },

  nextBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.secondaryFixed, borderRadius: 14, paddingVertical: 17, shadowColor: Colors.secondaryFixed, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
  nextBtnText: { fontSize: FontSize.md, fontFamily: FontFamily.headline, color: Colors.primaryContainer },
});
