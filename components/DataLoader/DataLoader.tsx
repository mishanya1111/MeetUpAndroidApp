// DataLoader.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useMeetups } from '@/components/DataLoader/useMeetups';
import FilterBar from '@/components/DataLoader/FilterBar';
import MeetupCard from '@/components/MeetupCard';
import Loader from '@/components/Loader';
import { useThemeColors } from '@/hooks/useThemeColors';

interface DataLoaderProps {
	fetchFunction: (params: URLSearchParams) => Promise<any>;
}

const DataLoader: React.FC<DataLoaderProps> = ({ fetchFunction }) => {
	const { text, description, headerFooter, buttonBorder } = useThemeColors();
	const {
		meetups,
		loading,
		error,
		setSearchQuery,
		setStartDate,
		setEndDate,
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
					tagIds={searchParams.tagIds}
					setSearchQuery={setSearchQuery}
					setStartDate={setStartDate}
					setEndDate={setEndDate}
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
					<View
						style={[
							styles.box,
							{ backgroundColor: headerFooter, borderColor: buttonBorder }
						]}
					>
						<Text style={[styles.title, { color: text }]}>
							Could not load meetups
						</Text>
						<Text style={[styles.body, { color: description }]}>{error}</Text>
						<TouchableOpacity onPress={applyFilters} style={styles.retryButton}>
							<Text style={styles.retryText}>Retry</Text>
						</TouchableOpacity>
					</View>
				) : meetups.length === 0 ? (
					<View
						style={[
							styles.box,
							{ backgroundColor: headerFooter, borderColor: buttonBorder }
						]}
					>
						<Text style={[styles.title, { color: text }]}>No meetups found</Text>
						<Text style={[styles.body, { color: description }]}>
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
	box: {
		margin: 16,
		padding: 16,
		borderRadius: 12,
		borderWidth: 1
	},
	title: {
		fontSize: 16,
		fontWeight: '600',
		marginBottom: 8
	},
	body: {
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
	}
});

export default DataLoader;
