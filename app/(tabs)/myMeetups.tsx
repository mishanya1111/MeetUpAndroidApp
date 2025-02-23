import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BackgroundView } from '@/components/styleComponent/BackgroundView';
import axios from 'axios';
import DataLoader from '@/components/DataLoader/DataLoader';
import { USER_API_URL } from '@/constant/apiURL';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { SIGN_IN } from '@/constant/router';
import { ThemedText } from '@/components/styleComponent/ThemedText';
import { Button } from 'react-native';
import {giveConfig} from "@/utils/giveConfig";

export default function MyMeetups() {
	const { token, userID, name } = useAuth(); // Достаём токен и userID из контекста
	const router = useRouter();

	// Если нет токена — показываем просьбу войти в систему
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

	// Функция для загрузки данных встреч
	const fetchWithToken = async () => {
		const response = await axios.get(
			`${USER_API_URL}${userID}/meetings_owned/`,
			giveConfig(token)
		);
		return response.data;
	};

	return (
		<BackgroundView>
			<View style={styles.container}>
				<ThemedText style={styles.title}>Hello {name}. Here are your meetups:</ThemedText>
				<DataLoader fetchFunction={fetchWithToken} />
			</View>
		</BackgroundView>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 16
	},
	authContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	authText: {
		fontSize: 18,
		marginBottom: 12
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 16
	}
});
