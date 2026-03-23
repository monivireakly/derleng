import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

type MIName = ComponentProps<typeof MaterialIcons>['name'];
type MCIName = ComponentProps<typeof MaterialCommunityIcons>['name'];

// Icons that must come from MaterialCommunityIcons
const MCI_ICONS: Record<string, MCIName> = {
  directions_bus: 'bus-side',
  confirmation_number: 'ticket-confirmation-outline',
  bus: 'bus-side',
  ticket: 'ticket-confirmation-outline',
  seat: 'seat',
  'check-bold': 'check-bold',
  'party-popper': 'party-popper',
  shopping_bag: 'shopping',
};

// Underscore → hyphen + special-case remaps for MaterialIcons
const MI_MAP: Record<string, MIName> = {
  arrow_back: 'arrow-back',
  location_on: 'location-on',
  swap_horiz: 'swap-horiz',
  calendar_today: 'calendar-today',
  expand_more: 'expand-more',
  chevron_right: 'chevron-right',
  chevron_left: 'chevron-left',
  check_circle: 'check-circle',
  more_vert: 'more-vert',
  account_balance: 'account-balance',
  credit_card: 'credit-card',
  card_membership: 'card-membership',
  card_travel: 'card-travel',
  help_outline: 'help-outline',
  help_center: 'help',
  travel_explore: 'explore',
  local_activity: 'local-activity',
  inventory_2: 'inventory',
  price_check: 'receipt',
  check_box: 'check-box',
  arrow_forward: 'arrow-forward',
  arrow_back_ios: 'arrow-back-ios',
  sync_alt: 'autorenew',
  touch_app: 'touch-app',
  expand_less: 'expand-less',
  swap_vert: 'swap-vert',
  radio_button_checked: 'radio-button-checked',
  history: 'history',
  north_east: 'north-east',
  map: 'map',
  north: 'north',
};

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

export function Icon({ name, size = 24, color = '#000' }: IconProps) {
  // Check if this icon should come from MaterialCommunityIcons
  if (MCI_ICONS[name]) {
    return <MaterialCommunityIcons name={MCI_ICONS[name]} size={size} color={color} />;
  }

  // Remap or pass-through to MaterialIcons
  const miName = (MI_MAP[name] ?? name) as MIName;
  return <MaterialIcons name={miName} size={size} color={color} />;
}
