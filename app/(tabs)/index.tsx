import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BackgroundView } from '@/components/styleComponent/BackgroundView';
import axios from 'axios';
import DataLoader from '@/components/DataLoader/DataLoader';
import { MEETINGS_API_URL } from '@/constant/apiURL';

export default function HomeScreen() {
	const fetchWithToken = async (params: Record<string, string>) => {
		const queryParams = new URLSearchParams(params).toString();
		console.log(queryParams);
		const response = await axios.get(`${MEETINGS_API_URL}?${queryParams}`);
		/*console.log(response)*/
		return response.data;
	};

	return (
		<BackgroundView>
			<View style={styles.container}>
				<DataLoader fetchFunction={fetchWithToken} flatListHeight="80%" />
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
	}
});
