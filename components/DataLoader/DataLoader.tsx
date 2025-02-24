// DataLoader.tsx
import React from 'react';
import { View, ActivityIndicator, Text, FlatList, StyleSheet } from 'react-native';
import { useMeetups } from '@/components/DataLoader/useMeetups';
import FilterBar from '@/components/DataLoader/FilterBar';
import MeetupCard from '@/components/MeetupCard';

interface DataLoaderProps {
	fetchFunction: (params: Record<string, string>) => Promise<any>;
}

const DataLoader: React.FC<DataLoaderProps> = ({ fetchFunction }) => {
	const {
		meetups,
		loading,
		error,
		setSearchQuery,
		setStartDate,
		setEndDate,
		applyFilters,
		searchParams
	} = useMeetups(fetchFunction);
	if(error) {
		console.log("Error in DataLoader:");
		console.log(error)
	}
	return (
		<View>
			<FilterBar
				searchQuery={searchParams.query}
				startDate={searchParams.startDate}
				endDate={searchParams.endDate}
				setSearchQuery={setSearchQuery}
				setStartDate={setStartDate}
				setEndDate={setEndDate}
				applyFilters={applyFilters}
			/>
			{loading ? (
				<ActivityIndicator size="large" style={styles.loader} />
			) : error ? (
				<Text style={styles.errorText}>Error: {error}</Text>
			) : (
				<FlatList
					style={{ height: '80%' }}
					data={meetups}
					keyExtractor={item => item.id.toString()}
					renderItem={({ item }) => <MeetupCard {...item} />}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
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

export default DataLoader;
