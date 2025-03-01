import React from 'react';
import {
	View,
	Text,
	TextInput,
	Button,
	TouchableOpacity,
	StyleSheet
} from 'react-native';
import { useSignUp } from '@/hooks/useSignUp';
import { useRouter } from 'expo-router';
import { SIGN_IN } from '@/constant/router';

export default function SignUp() {
	const { formData, errorMessage, isPending, handleInputChange, handleSubmit } =
		useSignUp();
	const router = useRouter();

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Sign Up</Text>
			<TextInput
				style={styles.input}
				placeholder="Username"
				value={formData.username}
				onChangeText={text => handleInputChange('username', text)}
			/>
			<TextInput
				style={styles.input}
				placeholder="Email"
				value={formData.email}
				onChangeText={text => handleInputChange('email', text)}
			/>
			<TextInput
				style={styles.input}
				placeholder="Password"
				value={formData.password}
				onChangeText={text => handleInputChange('password', text)}
				secureTextEntry
			/>
			{errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
			<Button
				title={isPending ? 'Signing Up...' : 'Sign Up'}
				onPress={handleSubmit}
				disabled={isPending}
			/>
			<TouchableOpacity onPress={() => router.push(SIGN_IN)}>
				<Text style={styles.link}>Already have an account? Sign in!</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: 'center', padding: 20 },
	title: { fontSize: 24, marginBottom: 20 },
	input: { borderWidth: 1, padding: 10, marginBottom: 10 },
	error: { color: 'red', marginBottom: 10 },
	link: { color: 'blue', marginTop: 10, textAlign: 'center' }
});
