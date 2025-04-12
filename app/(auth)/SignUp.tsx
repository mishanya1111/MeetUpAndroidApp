import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useSignUp } from '@/hooks/useSignUp';
import { useRouter } from 'expo-router';
import { SIGN_IN } from '@/constant/router';
import HeaderWithTitle from '@/components/headerWithTitle';
import { BackgroundView } from '@/components/styleComponent/BackgroundView';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function SignUp() {
	const { formData, errorMessage, isPending, handleInputChange, handleSubmit } =
		useSignUp();

	const router = useRouter();

	const { text, background, buttonBg, primaryLink } = useThemeColors();

	return (
		<BackgroundView>
			<HeaderWithTitle title="Sign Up" />

			<View style={[styles.container, { backgroundColor: background }]}>
				<Text style={[styles.title, { color: text }]}>Sign Up</Text>

				<TextInput
					style={[styles.input, { color: text, borderColor: text }]}
					placeholder="Username"
					placeholderTextColor={text}
					value={formData.username}
					onChangeText={text => handleInputChange('username', text)}
				/>
				<TextInput
					style={[styles.input, { color: text, borderColor: text }]}
					placeholder="Email"
					placeholderTextColor={text}
					value={formData.email}
					onChangeText={text => handleInputChange('email', text)}
				/>
				<TextInput
					style={[styles.input, { color: text, borderColor: text }]}
					placeholder="Password"
					placeholderTextColor={text}
					value={formData.password}
					onChangeText={text => handleInputChange('password', text)}
					secureTextEntry
				/>

				{errorMessage ? (
					<Text style={[styles.error, { color: 'red' }]}>{errorMessage}</Text>
				) : null}

				{/* Кнопка регистрации */}
				<TouchableOpacity
					onPress={handleSubmit}
					style={[styles.loginButton, { backgroundColor: buttonBg }]}
					disabled={isPending}
				>
					<Text style={styles.loginButtonText}>
						{isPending ? 'Signing Up...' : 'Sign Up'}
					</Text>
				</TouchableOpacity>

				{/* Ссылка "Sign In!" теперь интерактивная */}
				<TouchableOpacity onPress={() => router.push(SIGN_IN)}>
					<Text style={[styles.link, { color: primaryLink }]}>
						Already have an account? <Text style={styles.underline}>Sign in!</Text>
					</Text>
				</TouchableOpacity>
			</View>
		</BackgroundView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20
	},
	title: {
		fontSize: 24,
		marginBottom: 20
	},
	input: {
		borderWidth: 1,
		padding: 10,
		marginBottom: 12,
		width: '100%',
		maxWidth: 350,
		borderRadius: 8
	},
	error: {
		marginBottom: 10
	},
	loginButton: {
		backgroundColor: '#3a6ff7',
		paddingVertical: 10,
		paddingHorizontal: 80,
		width: '80%',
		borderRadius: 8,
		alignItems: 'center',
		marginTop: 15
	},
	loginButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold'
	},
	link: {
		marginTop: 15,
		textAlign: 'center'
	},
	underline: {
		textDecorationLine: 'underline',
		fontWeight: 'bold'
	}
});
