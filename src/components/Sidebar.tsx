import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated,
  Dimensions, TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize, LetterSpacing } from '../theme/typography';
import { Icon } from './Icon';
import { useAuth } from '../context/AuthContext';
import type { TabName } from './BottomTabBar';

const { width: SCREEN_W } = Dimensions.get('window');
const DRAWER_W = Math.min(SCREEN_W * 0.82, 320);

interface NavItem {
  tab: TabName;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { tab: 'Explore', label: 'Explore', icon: 'search' },
  { tab: 'MyTrips', label: 'My Trips', icon: 'luggage' },
  { tab: 'Tickets', label: 'Bookings', icon: 'receipt' },
  { tab: 'Profile', label: 'Profile', icon: 'person' },
];

interface SidebarProps {
  isOpen: boolean;
  activeTab: TabName;
  onClose: () => void;
  onNavigate: (tab: TabName) => void;
}

export function Sidebar({ isOpen, activeTab, onClose, onNavigate }: SidebarProps) {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const slideAnim = useRef(new Animated.Value(-DRAWER_W)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: isOpen ? 0 : -DRAWER_W,
        useNativeDriver: true,
        bounciness: 0,
        speed: 20,
      }),
      Animated.timing(overlayAnim, {
        toValue: isOpen ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOpen]);

  return (
    <View style={[StyleSheet.absoluteFillObject, { zIndex: 200 }]} pointerEvents={isOpen ? 'auto' : 'none'}>
      {/* Overlay */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: overlayAnim }]} />
      </TouchableWithoutFeedback>

      {/* Drawer */}
      <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }], paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        {/* Profile header */}
        <LinearGradient
          colors={[Colors.primaryContainer, Colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.drawerHeader}
        >
          <View style={styles.drawerAvatar}>
            <Icon name="person" size={36} color={Colors.secondary} />
          </View>
          <Text style={styles.drawerName}>{user?.displayName ?? 'Traveler'}</Text>
          <Text style={styles.drawerRole}>Explorer Level · Premium</Text>
          <View style={styles.pointsRow}>
            <Icon name="stars" size={14} color={Colors.secondaryFixed} />
            <Text style={styles.pointsText}>125 pts</Text>
          </View>
        </LinearGradient>

        {/* Nav items */}
        <View style={styles.navSection}>
          <Text style={styles.navSectionLabel}>Navigation</Text>
          {NAV_ITEMS.map((item) => {
            const isActive = item.tab === activeTab;
            return (
              <TouchableOpacity
                key={item.tab}
                style={[styles.navItem, isActive && styles.navItemActive]}
                onPress={() => { onNavigate(item.tab); onClose(); }}
                activeOpacity={0.75}
              >
                <Icon
                  name={item.icon}
                  size={22}
                  color={isActive ? Colors.secondary : Colors.onSurfaceVariant}
                />
                <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                  {item.label}
                </Text>
                {isActive && <View style={styles.activeIndicator} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Settings & Logout */}
        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.75}>
            <Icon name="settings" size={22} color={Colors.onSurfaceVariant} />
            <Text style={styles.navLabel}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.75}>
            <Icon name="help_outline" size={22} color={Colors.onSurfaceVariant} />
            <Text style={styles.navLabel}>Help Center</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navItem, styles.logoutItem]}
            onPress={() => { onClose(); logout(); }}
            activeOpacity={0.75}
          >
            <Icon name="logout" size={22} color={Colors.error} />
            <Text style={[styles.navLabel, styles.logoutLabel]}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Brand footer */}
        <View style={styles.drawerFooter}>
          <Icon name="directions_bus" size={16} color={Colors.outlineVariant} />
          <Text style={styles.footerText}>DerLeng v1.0 · Cambodia</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,6,21,0.55)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_W,
    backgroundColor: Colors.surfaceContainerLowest,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
  drawerHeader: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
    gap: 6,
  },
  drawerAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: Colors.secondaryFixed,
  },
  drawerName: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.headlineExtraBold,
    color: '#FFFFFF',
    letterSpacing: LetterSpacing.tighter,
  },
  drawerRole: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bodyMedium,
    color: Colors.onPrimaryContainer,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  pointsText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.secondaryFixed,
  },

  navSection: { paddingHorizontal: 12, paddingTop: 20, gap: 2 },
  navSectionLabel: {
    fontSize: 11,
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: LetterSpacing.widest,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 12,
    position: 'relative',
  },
  navItemActive: {
    backgroundColor: `${Colors.secondary}12`,
  },
  navLabel: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bodyMedium,
    color: Colors.onSurfaceVariant,
    flex: 1,
  },
  navLabelActive: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.secondary,
  },
  activeIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    backgroundColor: Colors.secondary,
  },

  divider: { height: 1, backgroundColor: Colors.surfaceContainerHigh, marginHorizontal: 24, marginVertical: 8 },

  bottomSection: { paddingHorizontal: 12, gap: 2 },
  logoutItem: {},
  logoutLabel: { color: Colors.error },

  drawerFooter: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.body,
    color: Colors.outlineVariant,
  },
});
