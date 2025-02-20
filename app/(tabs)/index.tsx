import React from 'react';
import { View, ActivityIndicator, Text, FlatList, StyleSheet } from 'react-native';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';
import { BackgroundView } from '@/components/styleComponent/BackgroundView';
import MeetupCard from '@/components/MeetupCard';
import { useMeetups } from '@/hooks/useMeetups';
import FilterBar from '@/components/FilterBar';

export default function HomeScreen() {
	const {
		meetups,
		loading,
		error,
		handleSearchChange,
		handleDateFilter,
		applyFilters
	} = useMeetups();

	return (
		<BackgroundView>
			<View style={styles.container}>
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
			</View>
			<ThemeToggleButton />
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
