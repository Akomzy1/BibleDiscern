import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  Pressable,
  ViewStyle,
} from 'react-native';
import { COLORS, FONTS, BORDER_RADIUS, SPACING } from '@/constants/theme';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helper?: string;
  secureToggle?: boolean;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  helper,
  secureToggle,
  containerStyle,
  secureTextEntry,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secureTextEntry ?? false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputWrapper,
          focused && styles.inputWrapperFocused,
          !!error && styles.inputWrapperError,
        ]}
      >
        <TextInput
          style={[styles.input, props.multiline && styles.multiline]}
          placeholderTextColor={COLORS.textLight}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          secureTextEntry={hidden}
          accessibilityLabel={label}
          {...props}
        />
        {secureToggle && (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            style={styles.eyeButton}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
          >
            <Text style={styles.eyeIcon}>{hidden ? '👁' : '🙈'}</Text>
          </Pressable>
        )}
      </View>

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : helper ? (
        <Text style={styles.helper}>{helper}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: SPACING.xs },
  label: { fontFamily: FONTS.bodySemiBold, fontSize: 13, color: COLORS.textMedium },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.parchment,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
    minHeight: 48,
  },
  inputWrapperFocused: { borderColor: COLORS.gold },
  inputWrapperError: { borderLeftWidth: 3, borderLeftColor: COLORS.error },

  input: {
    flex: 1,
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.textDark,
    paddingVertical: SPACING.md,
  },
  multiline: {
    minHeight: 120,
    textAlignVertical: 'top',
    paddingTop: SPACING.md,
  },

  eyeButton: { padding: SPACING.sm },
  eyeIcon: { fontSize: 16 },

  error: { fontFamily: FONTS.body, fontSize: 12, color: COLORS.error },
  helper: { fontFamily: FONTS.body, fontSize: 12, color: COLORS.textLight },
});
