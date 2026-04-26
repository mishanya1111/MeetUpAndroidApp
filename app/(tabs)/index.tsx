import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { BackgroundView } from '@/components/styleComponent/BackgroundView';
import axios from 'axios';
import DataLoader from '@/components/DataLoader/DataLoader';
import { ThemedText } from '@/components/styleComponent/ThemedText';
import { MEETINGS_API_URL } from '@/constant/apiURL';

export default function HomeScreen() {
	const fetchWithToken = useCallback(async (params: URLSearchParams) => {
		const queryParams = params.toString();
		const response = await axios.get(`${MEETINGS_API_URL}?${queryParams}`);
		return response.data;
	}, []);

	return (
		<BackgroundView>
			<View style={styles.container}>
				<ThemedText style={styles.title}>Meetups:</ThemedText>

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
	loader: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	errorText: {
		textAlign: 'center',
		color: 'red',
		fontSize: 16
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 16
	}
});
