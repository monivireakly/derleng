import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';
import { Icon } from './Icon';

export type TabName = 'Explore' | 'MyTrips' | 'Tickets' | 'Profile';

interface Tab {
  name: TabName;
  label: string;
  icon: string;
}

const TABS: Tab[] = [
  { name: 'Explore',   label: 'Explore',    icon: 'search' },
  { name: 'MyTrips',   label: 'My Trips',   icon: 'luggage' },
  { name: 'Tickets',   label: 'Bookings',   icon: 'receipt' },
  { name: 'Profile',   label: 'Profile',    icon: 'person' },
];

interface BottomTabBarProps {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
}

export function BottomTabBar({ activeTab, onTabPress }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {TABS.map((tab) => {
        const isActive = tab.name === activeTab;
        return (
          <TouchableOpacity
            key={tab.name}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onTabPress(tab.name)}
            activeOpacity={0.7}
          >
            <Icon
              name={tab.icon}
              size={24}
              color={isActive ? Colors.secondary : Colors.navInactive}
            />
            <Text style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingTop: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: Colors.primaryContainer,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 50,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 2,
    minHeight: 48,
  },
  tabActive: {
    backgroundColor: `${Colors.secondaryFixed}1A`,
  },
  label: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bodyMedium,
  },
  labelActive: { color: Colors.secondary },
  labelInactive: { color: Colors.navInactive },
});
