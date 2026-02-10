import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../lib/auth-context';

const NAVY = '#1B2A4A';
const BLUE = '#3E6B9E';
const LIGHT_BG = '#F0F4F8';
const GRAY = '#666666';

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match.');
      return;
    }
    setLoading(true);
    const { error } = await signUp(email.trim().toLowerCase(), password, name.trim());
    setLoading(false);
    if (error) {
      Alert.alert('Registration failed', error.message);
    } else {
      Alert.alert(
        'Check your email',
        'We sent you a confirmation link. Please check your inbox and confirm your email to continue.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.inner}>
          <View style={styles.header}>
            <Text style={styles.appName}>Aurelle</Text>
            <Text style={styles.tagline}>Create your account</Text>
          </View>
          <View style={styles.form}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} placeholder="Your name" placeholderTextColor="#999" value={name} onChangeText={setName} autoComplete="name" />
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} placeholder="you@example.com" placeholderTextColor="#999" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
            <Text style={styles.label}>Password</Text>
            <TextInput style={styles.input} placeholder="At least 6 characters" placeholderTextColor="#999" value={password} onChangeText={setPassword} secureTextEntry autoComplete="new-password" />
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput style={styles.input} placeholder="Type your password again" placeholderTextColor="#999" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry autoComplete="new-password" />
            <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleRegister} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create Account</Text>}
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity><Text style={styles.footerLink}>Sign In</Text></TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: LIGHT_BG },
  scrollContent: { flexGrow: 1, justifyContent: 'center' },
  inner: { paddingHorizontal: 32, paddingVertical: 48 },
  header: { alignItems: 'center', marginBottom: 36 },
  appName: { fontSize: 42, fontWeight: '700', color: NAVY, letterSpacing: 1 },
  tagline: { fontSize: 16, color: BLUE, marginTop: 8 },
  form: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: NAVY, marginBottom: 6, marginTop: 16 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: NAVY },
  button: { backgroundColor: NAVY, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 24 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  footerText: { color: GRAY, fontSize: 14 },
  footerLink: { color: BLUE, fontSize: 14, fontWeight: '600' },
});
