import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { BackgroundView } from '@/components/styleComponent/BackgroundView';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';
import { useAuth } from '@/context/AuthContext';
import { ThemedText } from '@/components/styleComponent/ThemedText';
import { SIGN_IN } from '@/constant/router';
import { useRouter } from 'expo-router'; // Контекст для токена

export default function MyMeetups() {
	const { token, name } = useAuth(); // Достаём токен из контекста

	const router = useRouter();
	if (!token) {
		return (
			<BackgroundView>
				<View style={styles.authContainer}>
					<ThemedText style={styles.authText}>
						Please log in to view your meetups.
					</ThemedText>
					<Button title="Log In" onPress={() => router.push(SIGN_IN)} />
				</View>
			</BackgroundView>
		);
	}

	return (
		<BackgroundView>
			<ThemeToggleButton />
			<ThemedText> Hello {name}. Come later</ThemedText>
		</BackgroundView>
	);
}

const styles = StyleSheet.create({
	container: { padding: 16 },
	loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
	errorText: { textAlign: 'center', color: 'red', fontSize: 16 },
	emptyText: { textAlign: 'center', fontSize: 16 },
	authContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
	authText: { fontSize: 18, marginBottom: 12 }
});
