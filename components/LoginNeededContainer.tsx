import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { ThemedText } from '@/components/styleComponent/ThemedText';
import { SIGN_IN } from '@/constant/router';
import { router } from 'expo-router';

// пропсы
interface LoginNeededContainerProps {
	message: string;
}

export function LoginNeededContainer({ message }: LoginNeededContainerProps) {
	return (
		<View style={styles.loginNeededContainer}>
			<ThemedText>{message}</ThemedText>

			<TouchableOpacity
				onPress={() => router.push(SIGN_IN)}
				style={styles.loginButton}
			>
				<Text style={styles.loginButtonText}>Login</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	loginNeededContainer: {
		alignItems: 'center',
		width: '100%',
		maxWidth: 400,
		marginTop: 250
	},
	loginButton: {
		backgroundColor: '#3a6ff7',
		paddingVertical: 10,
		paddingHorizontal: 80,
		width: '80%',
		borderRadius: 8,
		alignItems: 'center',
		marginTop: 30
	},
	loginButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold'
	}
});
