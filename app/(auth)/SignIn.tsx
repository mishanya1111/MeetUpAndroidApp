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
import { BackgroundView } from '@/components/styleComponent/BackgroundView';
import HeaderWithTitle from '@/components/headerWithTitle';
import { useThemeColors } from '@/hooks/useThemeColors';

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

	const { text, background, buttonBg, primaryLink } = useThemeColors();

	return (
		<BackgroundView>
			<HeaderWithTitle title="Log IN" />
			<View style={[styles.container, { backgroundColor: background }]}>
				<Text style={[styles.title, { color: text }]}>Log In</Text>

				<TextInput
					style={[styles.input, { color: text, borderColor: text }]}
					placeholder="Username"
					placeholderTextColor={text}
					value={formData.username}
					onChangeText={text => handleInputChange('username', text)}
				/>
				<TextInput
					style={[styles.input, { color: text, borderColor: text }]}
					placeholder="Password"
					placeholderTextColor={text}
					value={formData.password}
					onChangeText={text => handleInputChange('password', text)}
					secureTextEntry={!showPassword}
				/>

				<TouchableOpacity onPress={togglePasswordVisibility} style={styles.showPassword}>
					<Text style={{ color: text }}>{!showPassword ? '🔓 Show' : '🔒 Hide'}</Text>
				</TouchableOpacity>

				{errorMessage ? <Text style={[styles.error, { color: 'red' }]}>{errorMessage}</Text> : null}

				{/* кнопка входа */}
				<TouchableOpacity onPress={handleSubmit} style={[styles.loginButton, { backgroundColor: buttonBg }]} disabled={isPending}>
					<Text style={styles.loginButtonText}>{isPending ? 'Pending...' : 'Sign In'}</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={() => router.push(SIGN_UP)}>
					<Text style={[styles.link, { color: primaryLink }]}>Don’t have an account? <Text style={styles.underline}>Sign up!</Text></Text>
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
		padding: 20,
	},
	title: {
		fontSize: 24,
		marginBottom: 20,
	},
	input: {
		borderWidth: 1,
		padding: 10,
		marginBottom: 12,
		width: '100%',
		maxWidth: 350,
		borderRadius: 8,
	},
	showPassword: {
		marginBottom: 15,
		alignSelf: "baseline"
	},
	error: {
		marginBottom: 10,
	},
	loginButton: {
		backgroundColor: "#3a6ff7",
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