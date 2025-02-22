import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';
import { BackgroundView } from '@/components/styleComponent/BackgroundView';
import axios from 'axios';
import DataLoader from '@/components/DataLoader/DataLoader';
import { MEETINGS_API_URL } from '@/constant/apiURL';

export default function HomeScreen() {
	/*const {
		meetups,
		loading,
		error,
		handleSearchChange,
		handleDateFilter,
		applyFilters
	} = useMeetups();*/
	//fetchFunction
	const fetchWithToken = async (params: Record<string, string>) => {
		const queryParams = new URLSearchParams(params).toString();
		console.log(queryParams)
		const response = await axios.get(`${MEETINGS_API_URL}?${queryParams}`);
		return response.data;
	};

	return (
		<BackgroundView>
			{/*<View style={styles.container}>
				<FilterBar
					onSearchChange={handleSearchChange}
					onDateFilter={handleDateFilter}
					onApplyFilters={applyFilters}
				/>
				{loading ? (
					<ActivityIndicator size="large" style={styles.loader} />
				) : error ? (
					<Text style={styles.errorText}>Error: {error?.message}</Text>
				) : (
					<FlatList
						data={meetups}
						keyExtractor={item => item.id.toString()}
						renderItem={({ item }) => <MeetupCard {...item} />}
					/>
				)}
			</View>*/}
			{/*<ThemeToggleButton />*/}
			<View style={styles.container}>
				<DataLoader fetchFunction={fetchWithToken} />
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
