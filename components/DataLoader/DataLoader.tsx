// DataLoader.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useMeetups } from '@/components/DataLoader/useMeetups';
import FilterBar from '@/components/DataLoader/FilterBar';
import MeetupCard from '@/components/MeetupCard';
import Loader from '@/components/Loader';

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

	if (error) {
		console.log('Error in DataLoader:');
		console.log(error);
	}

	return (
		<View style={{ flex: 1 }}>
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
			</View>

			<View style={{ flex: 1 }}>
				{loading ? (
					<Loader />
				) : error ? (
					<Text style={styles.errorText}>Error: {error}</Text>
				) : (
					<FlatList
						data={meetups}
						keyExtractor={item => item.id.toString()}
						renderItem={({ item }) => <MeetupCard {...item} />}
						initialNumToRender={5}
						maxToRenderPerBatch={10}
						windowSize={5}
						removeClippedSubviews={true}
					/>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	listContainer: {
		flex: 1,
	},
	errorText: {
		textAlign: 'center',
		color: 'red',
		fontSize: 16
	}
});

export default DataLoader;
