export const FontFamily = {
  headline: 'PlusJakartaSans_700Bold',
  headlineSemiBold: 'PlusJakartaSans_600SemiBold',
  headlineExtraBold: 'PlusJakartaSans_800ExtraBold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
} as const;

export const FontSize = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  display: 40,
} as const;

export const LetterSpacing = {
  tight: -0.5,
  tighter: -0.8,
  widest: 1.5,
  wide: 0.8,
  normal: 0,
} as const;
