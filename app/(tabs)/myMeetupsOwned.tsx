import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BackgroundView } from '@/components/styleComponent/BackgroundView';
import axios from 'axios';
import DataLoader from '@/components/DataLoader/DataLoader';
import { MEETINGS_OWNED, USER_API_URL } from '@/constant/apiURL';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/styleComponent/ThemedText';
import { CREATE_MEETUPS } from '@/constant/router';
import { giveConfig } from '@/utils/giveConfig';
import { LoginNeededContainer } from '@/components/LoginNeededContainer';

export default function MyMeetupsOwned() {
	const { token, userID } = useAuth(); // Достаём токен и userID из контекста
	const router = useRouter();

	// Если нет токена — показываем просьбу войти в систему
	if (!token) {
		return (
			<BackgroundView>
				<LoginNeededContainer message="You need to log in to view meetups you own." />
			</BackgroundView>
		);
	}

	// Функция для загрузки данных встреч
	const fetchWithToken = async (params: Record<string, string>) => {
		const queryParams = new URLSearchParams(params).toString();
		//console.log('userID' + userID);
		console.log(
			'url in owned:' + `${USER_API_URL}${userID}/${MEETINGS_OWNED}?` + queryParams
		);
		const response = await axios.get(
			`${USER_API_URL}${userID}/${MEETINGS_OWNED}/?${queryParams}`,
			giveConfig(token)
		);

		/*if (response) {
			console.log(response)
		}*/
		//response.data.results = response.data; // как влад починит - убрать!!!!!!!
		//console.log(response.data.results.map(it => it.title));
		return response.data;
	};

	return (
		<BackgroundView>
			<View style={styles.container}>
				<ThemedText style={styles.title}>Meetups you own:</ThemedText>

				<TouchableOpacity
					style={styles.createButton}
					onPress={() => router.push(CREATE_MEETUPS)}
				>
					<Text style={styles.createButtonText}>Create Meetup</Text>
				</TouchableOpacity>

				<DataLoader fetchFunction={fetchWithToken} />
			</View>
		</BackgroundView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 8
	},
	createButton: {
		backgroundColor: '#3a6ff7',
		paddingVertical: 10,
		borderRadius: 8,
		marginBottom: 15,
		alignItems: 'center'
	},
	createButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold'
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 16
	}
});
