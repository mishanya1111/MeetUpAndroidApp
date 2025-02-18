import React from 'react';
import {
	View,
	Text,
	TextInput,
	Button,
	TouchableOpacity,
	StyleSheet
} from 'react-native';
import { useSignIn } from '@/hooks/useSignIn';
import { SIGN_UP } from '@/constant/router';
import { useRouter } from 'expo-router';

export default function SignIn() {
	const {
		formData,
		errorMessage,
		isPending,
		showPassword,
		togglePasswordVisibility,
		handleInputChange,
		handleSubmit
	} = useSignIn();
	const router = useRouter();
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Log In</Text>
			<TextInput
				style={styles.input}
				placeholder="Username"
				value={formData.username}
				onChangeText={text => handleInputChange('username', text)}
			/>
			<TextInput
				style={styles.input}
				placeholder="Password"
				value={formData.password}
				onChangeText={text => handleInputChange('password', text)}
				secureTextEntry={!showPassword}
			/>
			<TouchableOpacity onPress={togglePasswordVisibility}>
				<Text>{!showPassword ? '🔓 Show' : '🔒 Hide'}</Text>
			</TouchableOpacity>
			{errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
			<Button
				title={isPending ? 'Pending...' : 'Sign In'}
				onPress={handleSubmit}
				disabled={isPending}
			/>
			<TouchableOpacity onPress={() => router.push(SIGN_UP)}>
				<Text style={styles.link}>Don’t have an account? Sign up!</Text>
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
