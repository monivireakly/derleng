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

interface SignupScreenProps {
  navigation: any;
}

export function SignupScreen({ navigation }: SignupScreenProps) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    // Demo: redirect to login after "signup"
    setError('');
    navigation.navigate('Login');
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
        style={[styles.hero, { paddingTop: insets.top + 32 }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Icon name="arrow_back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.logoRow}>
          <Icon name="directions_bus" size={32} color={Colors.secondaryFixed} />
          <Text style={styles.brandName}>DerLeng</Text>
        </View>
        <Text style={styles.heroTagline}>Join millions of travelers</Text>
      </LinearGradient>

      <ScrollView
        style={styles.formSheet}
        contentContainerStyle={[styles.formContent, { paddingBottom: insets.bottom + 32 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.formTitle}>Create account</Text>
        <Text style={styles.formSubtitle}>It's free and takes under a minute</Text>

        {!!error && (
          <View style={styles.errorBanner}>
            <Icon name="info" size={16} color={Colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {[
          { label: 'Full Name', value: name, onChange: setName, placeholder: 'Your full name', icon: 'person', secure: false },
          { label: 'Email', value: email, onChange: setEmail, placeholder: 'your@email.com', icon: 'mail', secure: false },
        ].map((field) => (
          <View key={field.label} style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            <View style={styles.inputRow}>
              <Icon name={field.icon} size={20} color={Colors.onSurfaceVariant} />
              <TextInput
                style={styles.input}
                value={field.value}
                onChangeText={field.onChange}
                placeholder={field.placeholder}
                placeholderTextColor={Colors.onSurfaceVariant}
                autoCapitalize={field.label === 'Email' ? 'none' : 'words'}
                autoCorrect={false}
                keyboardType={field.label === 'Email' ? 'email-address' : 'default'}
              />
            </View>
          </View>
        ))}

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Password</Text>
          <View style={styles.inputRow}>
            <Icon name="lock" size={20} color={Colors.onSurfaceVariant} />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Min. 6 characters"
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

        <TouchableOpacity style={styles.signupBtn} onPress={handleSignup} activeOpacity={0.85}>
          <Text style={styles.signupBtnText}>Create Account</Text>
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text style={styles.loginPrompt}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.7}>
            <Text style={styles.loginLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  hero: { paddingHorizontal: 32, paddingBottom: 40 },
  backBtn: { marginBottom: 20, width: 40, height: 40, justifyContent: 'center' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  brandName: { fontSize: FontSize['3xl'], fontFamily: FontFamily.headlineExtraBold, color: '#FFFFFF', letterSpacing: LetterSpacing.tighter },
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
  signupBtn: { backgroundColor: Colors.secondary, borderRadius: 14, paddingVertical: 18, alignItems: 'center', shadowColor: Colors.secondary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6, marginTop: 4 },
  signupBtnText: { fontSize: FontSize.md, fontFamily: FontFamily.headline, color: '#FFFFFF', letterSpacing: LetterSpacing.tight },
  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loginPrompt: { fontSize: FontSize.sm, fontFamily: FontFamily.body, color: Colors.onSurfaceVariant },
  loginLink: { fontSize: FontSize.sm, fontFamily: FontFamily.headline, color: Colors.secondary },
});
