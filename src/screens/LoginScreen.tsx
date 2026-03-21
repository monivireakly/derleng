import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize, LetterSpacing } from '../theme/typography';
import { Icon } from '../components/Icon';
import { useAuth } from '../context/AuthContext';

interface LoginScreenProps {
  navigation: any;
}

export function LoginScreen({ navigation }: LoginScreenProps) {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }
    setLoading(true);
    setError('');
    setTimeout(() => {
      const result = login(username.trim(), password);
      if (!result.success) {
        setError(result.error ?? 'Login failed.');
        setLoading(false);
      } else {
        setLoading(false);
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
      }
    }, 600);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient
        colors={[Colors.primaryContainer, Colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.hero, { paddingTop: insets.top + 48 }]}
      >
        {navigation.canGoBack() && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { top: insets.top + 12 }]} activeOpacity={0.7}>
            <Icon name="arrow_back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        <View style={styles.logoRow}>
          <Icon name="directions_bus" size={36} color={Colors.secondaryFixed} />
          <Text style={styles.brandName}>DerLeng</Text>
        </View>
        <Text style={styles.heroTagline}>Seamless travel across Cambodia</Text>
      </LinearGradient>

      <ScrollView
        style={styles.formSheet}
        contentContainerStyle={[styles.formContent, { paddingBottom: insets.bottom + 32 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.formTitle}>Welcome back</Text>
        <Text style={styles.formSubtitle}>Sign in to your account</Text>

        {/* Error */}
        {!!error && (
          <View style={styles.errorBanner}>
            <Icon name="info" size={16} color={Colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Username */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Username</Text>
          <View style={styles.inputRow}>
            <Icon name="person" size={20} color={Colors.onSurfaceVariant} />
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter username"
              placeholderTextColor={Colors.onSurfaceVariant}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* Password */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Password</Text>
          <View style={styles.inputRow}>
            <Icon name="lock" size={20} color={Colors.onSurfaceVariant} />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              placeholderTextColor={Colors.onSurfaceVariant}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} activeOpacity={0.7}>
              <Icon name={showPassword ? 'visibility-off' : 'visibility'} size={20} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hint */}
        <View style={styles.hintBox}>
          <Icon name="info" size={14} color={Colors.secondary} />
          <Text style={styles.hintText}>Demo: username <Text style={styles.hintBold}>admin</Text> · password <Text style={styles.hintBold}>admin123</Text></Text>
        </View>

        {/* Login CTA */}
        <TouchableOpacity
          style={[styles.loginBtn, loading && styles.loginBtnLoading]}
          onPress={handleLogin}
          activeOpacity={0.85}
          disabled={loading}
        >
          <Text style={styles.loginBtnText}>{loading ? 'Signing in…' : 'Sign In'}</Text>
        </TouchableOpacity>

        {/* Sign up link */}
        <View style={styles.signupRow}>
          <Text style={styles.signupPrompt}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')} activeOpacity={0.7}>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  hero: { paddingHorizontal: 32, paddingBottom: 40, position: 'relative' },
  backBtn: { position: 'absolute', left: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  brandName: { fontSize: FontSize['4xl'], fontFamily: FontFamily.headlineExtraBold, color: '#FFFFFF', letterSpacing: LetterSpacing.tighter },
  heroTagline: { fontSize: FontSize.md, fontFamily: FontFamily.bodyMedium, color: Colors.onPrimaryContainer },
  formSheet: { flex: 1, backgroundColor: Colors.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -24 },
  formContent: { paddingHorizontal: 32, paddingTop: 36, gap: 20 },
  formTitle: { fontSize: FontSize['3xl'], fontFamily: FontFamily.headlineExtraBold, color: Colors.primary, letterSpacing: LetterSpacing.tighter },
  formSubtitle: { fontSize: FontSize.md, fontFamily: FontFamily.body, color: Colors.onSurfaceVariant, marginTop: -12 },
  errorBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: `${Colors.error}12`, borderWidth: 1, borderColor: `${Colors.error}30`, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 },
  errorText: { flex: 1, fontSize: FontSize.sm, fontFamily: FontFamily.bodyMedium, color: Colors.error },
  fieldGroup: { gap: 8 },
  fieldLabel: { fontSize: 12, fontFamily: FontFamily.bodySemiBold, color: Colors.onSurfaceVariant, letterSpacing: LetterSpacing.wide, textTransform: 'uppercase' },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.surfaceContainerLow, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14 },
  input: { flex: 1, fontSize: FontSize.md, fontFamily: FontFamily.body, color: Colors.onSurface, padding: 0 },
  hintBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: `${Colors.secondary}10`, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 },
  hintText: { fontSize: FontSize.sm, fontFamily: FontFamily.body, color: Colors.onSurfaceVariant },
  hintBold: { fontFamily: FontFamily.bodySemiBold, color: Colors.secondary },
  loginBtn: { backgroundColor: Colors.secondary, borderRadius: 14, paddingVertical: 18, alignItems: 'center', shadowColor: Colors.secondary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6, marginTop: 4 },
  loginBtnLoading: { opacity: 0.7 },
  loginBtnText: { fontSize: FontSize.md, fontFamily: FontFamily.headline, color: '#FFFFFF', letterSpacing: LetterSpacing.tight },
  signupRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  signupPrompt: { fontSize: FontSize.sm, fontFamily: FontFamily.body, color: Colors.onSurfaceVariant },
  signupLink: { fontSize: FontSize.sm, fontFamily: FontFamily.headline, color: Colors.secondary },
});
