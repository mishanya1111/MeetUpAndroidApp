// DataLoader.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useMeetups } from '@/components/DataLoader/useMeetups';
import FilterBar from '@/components/DataLoader/FilterBar';
import MeetupCard from '@/components/MeetupCard';
import Loader from '@/components/Loader';

interface DataLoaderProps {
	fetchFunction: (params: URLSearchParams) => Promise<any>;
}

const DataLoader: React.FC<DataLoaderProps> = ({ fetchFunction }) => {
	const {
		meetups,
		loading,
		error,
		setSearchQuery,
		setStartDate,
		setEndDate,
		setIsOnline,
		setTagIds,
		applyFilters,
		runAiSearch,
		runAiRecommend,
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
					isOnline={searchParams.isOnline}
					tagIds={searchParams.tagIds}
					setSearchQuery={setSearchQuery}
					setStartDate={setStartDate}
					setEndDate={setEndDate}
					setIsOnline={setIsOnline}
					setTagIds={setTagIds}
					applyFilters={applyFilters}
					runAiSearch={runAiSearch}
					runAiRecommend={runAiRecommend}
				/>
			</View>

			<View style={{ flex: 1 }}>
				{loading ? (
					<Loader />
				) : error ? (
					<View style={styles.errorBox}>
						<Text style={styles.errorTitle}>Could not load meetups</Text>
						<Text style={styles.errorText}>{error}</Text>
						<TouchableOpacity onPress={applyFilters} style={styles.retryButton}>
							<Text style={styles.retryText}>Retry</Text>
						</TouchableOpacity>
					</View>
				) : meetups.length === 0 ? (
					<View style={styles.emptyBox}>
						<Text style={styles.emptyTitle}>No meetups found</Text>
						<Text style={styles.emptyText}>
							Try changing filters or use AI Search/Recommend.
						</Text>
					</View>
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
		flex: 1
	},
	errorBox: {
		margin: 16,
		padding: 16,
		borderRadius: 12,
		backgroundColor: 'rgba(255,255,255,0.06)'
	},
	errorTitle: {
		fontSize: 16,
		fontWeight: '600',
		marginBottom: 8,
		color: '#f2f2f2'
	},
	errorText: {
		color: '#d0d0d0',
		marginBottom: 12
	},
	retryButton: {
		alignSelf: 'flex-start',
		paddingVertical: 8,
		paddingHorizontal: 14,
		borderRadius: 10,
		backgroundColor: 'rgba(58,111,247,0.9)'
	},
	retryText: {
		color: '#fff',
		fontWeight: '600'
	},
	emptyBox: {
		margin: 16,
		padding: 16,
		borderRadius: 12,
		backgroundColor: 'rgba(255,255,255,0.06)'
	},
	emptyTitle: {
		fontSize: 16,
		fontWeight: '600',
		marginBottom: 6,
		color: '#f2f2f2'
	},
	emptyText: {
		color: '#d0d0d0'
	}
});

export default DataLoader;
