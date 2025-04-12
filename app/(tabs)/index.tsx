import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BackgroundView } from '@/components/styleComponent/BackgroundView';
import axios from 'axios';
import DataLoader from '@/components/DataLoader/DataLoader';
import { ThemedText } from '@/components/styleComponent/ThemedText';
import { MEETINGS_API_URL } from '@/constant/apiURL';

export default function HomeScreen() {
	const fetchWithToken = async (params: Record<string, string>) => {
		const queryParams = new URLSearchParams(params).toString();
		console.log(queryParams);
		const response = await axios.get(`${MEETINGS_API_URL}?${queryParams}`);
		//console.log(response.data.results.length);
		return response.data;
	};

	return (
		<BackgroundView>
			<View style={styles.container}>
				<ThemedText style={styles.title}>Meetups:</ThemedText>
				<DataLoader fetchFunction={fetchWithToken} flatListHeight="74%" />
			</View>
		</BackgroundView>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 16
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
