import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize, LetterSpacing } from '../theme/typography';
import { Icon } from './Icon';

interface TopAppBarProps {
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
  onMenuPress?: () => void;
  rightElement?: React.ReactNode;
}

export function TopAppBar({ showBack, onBack, title = 'DerLeng', onMenuPress, rightElement }: TopAppBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.inner}>
        <View style={styles.left}>
          {showBack ? (
            <TouchableOpacity onPress={onBack} style={styles.iconBtn} activeOpacity={0.7}>
              <Icon name="arrow_back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ) : onMenuPress ? (
            <TouchableOpacity onPress={onMenuPress} style={styles.iconBtn} activeOpacity={0.7}>
              <Icon name="menu" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ) : null}
          <Text style={styles.logoText}>{title}</Text>
        </View>
        {rightElement ? <View style={styles.right}>{rightElement}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryContainer,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    height: 64,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.headlineExtraBold,
    color: '#FFFFFF',
    letterSpacing: LetterSpacing.tighter,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
