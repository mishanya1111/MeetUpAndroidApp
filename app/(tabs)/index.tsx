import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';
import { BackgroundView } from '@/components/styleComponent/BackgroundView';
import axios from "axios";
import DataLoader from '@/components/DataLoader/DataLoader'

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
	const fetchWithToken = async (url: string) => {
		const response = await axios.get(url);
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
			<ThemeToggleButton />
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
