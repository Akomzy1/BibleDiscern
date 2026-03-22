import { COLORS as SHARED_COLORS } from '@librato/shared';

// Re-export shared colors with convenience alias
export const COLORS = SHARED_COLORS;

// Font family names — must match exactly what's loaded in useFonts()
export const FONTS = {
  display: 'PlayfairDisplay_700Bold',
  displayRegular: 'PlayfairDisplay_400Regular',
  displayItalic: 'PlayfairDisplay_400Regular_Italic',
  displaySemiBold: 'PlayfairDisplay_600SemiBold',
  scripture: 'CormorantGaramond_400Regular_Italic',
  scriptureRegular: 'CormorantGaramond_400Regular',
  scriptureSemiBold: 'CormorantGaramond_600SemiBold',
  scriptureSemiBoldItalic: 'CormorantGaramond_600SemiBold_Italic',
  body: 'SourceSans3_400Regular',
  bodySemiBold: 'SourceSans3_600SemiBold',
  bodyBold: 'SourceSans3_700Bold',
} as const;

// 4px base unit spacing scale
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
} as const;

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const SHADOWS = {
  card: {
    shadowColor: SHARED_COLORS.textDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  elevated: {
    shadowColor: SHARED_COLORS.textDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 4,
  },
} as const;

// Reusable text style objects
export const TEXT_STYLES = {
  displayXl: { fontFamily: FONTS.display, fontSize: 36, color: SHARED_COLORS.navy, lineHeight: 44 },
  displayLg: { fontFamily: FONTS.display, fontSize: 28, color: SHARED_COLORS.navy, lineHeight: 36 },
  displayMd: { fontFamily: FONTS.display, fontSize: 24, color: SHARED_COLORS.navy, lineHeight: 32 },
  displaySm: { fontFamily: FONTS.display, fontSize: 20, color: SHARED_COLORS.navy, lineHeight: 28 },

  scriptureLg: { fontFamily: FONTS.scripture, fontSize: 22, color: SHARED_COLORS.navy, lineHeight: 36 },
  scriptureMd: { fontFamily: FONTS.scripture, fontSize: 18, color: SHARED_COLORS.navy, lineHeight: 30 },
  scriptureSm: { fontFamily: FONTS.scripture, fontSize: 16, color: SHARED_COLORS.textMedium, lineHeight: 26 },

  bodyLg: { fontFamily: FONTS.body, fontSize: 17, color: SHARED_COLORS.textDark, lineHeight: 28 },
  bodyMd: { fontFamily: FONTS.body, fontSize: 15, color: SHARED_COLORS.textDark, lineHeight: 24 },
  bodySm: { fontFamily: FONTS.body, fontSize: 13, color: SHARED_COLORS.textMedium, lineHeight: 20 },
  bodyXs: { fontFamily: FONTS.body, fontSize: 11, color: SHARED_COLORS.textLight, lineHeight: 16 },

  labelMd: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: SHARED_COLORS.gold,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
  },
  labelSm: { fontFamily: FONTS.bodySemiBold, fontSize: 11, color: SHARED_COLORS.textLight, letterSpacing: 1 },
} as const;
