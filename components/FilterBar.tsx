import React, { useState } from 'react';
import {
	View,
	TextInput,
	Button,
	TouchableOpacity,
	StyleSheet,
	Text
} from 'react-native';
import DatePicker from 'react-native-date-picker'; // Импортируем компонент
import { Feather } from '@expo/vector-icons';

interface FilterBarProps {
	onSearchChange: (query: string) => void;
	onDateFilter: (startDate: string, endDate: string) => void;
	onApplyFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
	onSearchChange,
	onDateFilter,
	onApplyFilters
}) => {
	const [searchQuery, setSearchQuery] = useState('');
	const [showDateFilters, setShowDateFilters] = useState(false);
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);
	const [showStartPicker, setShowStartPicker] = useState(false);
	const [showEndPicker, setShowEndPicker] = useState(false);

	const handleApplyFilters = () => {
		onSearchChange(searchQuery);
		onDateFilter(
			startDate ? startDate.toISOString().split('T')[0] : '',
			endDate ? endDate.toISOString().split('T')[0] : ''
		);
		onApplyFilters();
	};

	return (
		<View style={styles.filterBar}>
			{/* Поле поиска + иконка календаря */}
			<View style={styles.searchContainer}>
				<TextInput
					style={styles.searchInput}
					placeholder="Search meetups..."
					value={searchQuery}
					onChangeText={setSearchQuery}
				/>
				<TouchableOpacity
					onPress={() => setShowDateFilters(!showDateFilters)}
					style={styles.iconButton}
				>
					<Feather name="calendar" size={20} color="black" />
				</TouchableOpacity>
			</View>

			{/* Фильтр по датам с выводом выбранных дат */}
			{showDateFilters && (
				<View style={styles.dateFilters}>
					<View style={styles.dateDisplay}>
						<Text style={styles.dateText}>
							{startDate
								? `Start: ${startDate.toISOString().split('T')[0]}`
								: 'Start Date'}
						</Text>
						<Text style={styles.dateText}>
							{endDate ? `End: ${endDate.toISOString().split('T')[0]}` : 'End Date'}
						</Text>
					</View>

					<TouchableOpacity
						onPress={() => setShowStartPicker(true)}
						style={styles.dateButton}
					>
						<TextInput
							style={styles.dateInput}
							placeholder="Start Date"
							value={startDate ? startDate.toISOString().split('T')[0] : ''}
							editable={false}
						/>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => setShowEndPicker(true)}
						style={styles.dateButton}
					>
						<TextInput
							style={styles.dateInput}
							placeholder="End Date"
							value={endDate ? endDate.toISOString().split('T')[0] : ''}
							editable={false}
						/>
					</TouchableOpacity>
				</View>
			)}

			{/* Кнопка применения фильтров */}
			<Button title="Apply Filters" onPress={handleApplyFilters} />

			{/* Выбор даты с использованием react-native-date-picker */}
			{showStartPicker && (
				<DatePicker
					modal
					open={showStartPicker}
					date={startDate || new Date()}
					onConfirm={selectedDate => {
						setStartDate(selectedDate);
						setShowStartPicker(false);
					}}
					onCancel={() => setShowStartPicker(false)}
				/>
			)}
			{showEndPicker && (
				<DatePicker
					modal
					open={showEndPicker}
					date={endDate || new Date()}
					onConfirm={selectedDate => {
						setEndDate(selectedDate);
						setShowEndPicker(false);
					}}
					onCancel={() => setShowEndPicker(false)}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	filterBar: {
		padding: 10
	},
	searchContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	searchInput: {
		flex: 1,
		padding: 8,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 4
	},
	iconButton: {
		padding: 8
	},
	dateFilters: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginVertical: 10
	},
	dateDisplay: {
		flexDirection: 'column',
		justifyContent: 'center'
	},
	dateText: {
		fontSize: 14,
		color: '#333',
		marginBottom: 5
	},
	dateButton: {
		flex: 1,
		marginHorizontal: 5
	},
	dateInput: {
		padding: 8,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 4,
		textAlign: 'center'
	}
});

export default FilterBar;
