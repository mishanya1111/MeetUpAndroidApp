import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useThemeColors';
import { BUTTON_TEXT } from '@/constant/Colors';

interface FilterBarProps {
	searchQuery: string;
	startDate: string | null;
	endDate: string | null;
	setSearchQuery: (query: string) => void;
	setStartDate: (date: string | null) => void;
	setEndDate: (date: string | null) => void;
	applyFilters: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
	searchQuery,
	startDate,
	endDate,
	setSearchQuery,
	setStartDate,
	setEndDate,
	applyFilters
}) => {
	const [showDateFilters, setShowDateFilters] = useState(false);
	const [showStartPicker, setShowStartPicker] = useState(false);
	const [showEndPicker, setShowEndPicker] = useState(false);

	const { headerFooter, text, buttonBorder, buttonBg } = useThemeColors();

	const renderDatePicker = (pickerType: 'start' | 'end') => {
		const isStartPicker = pickerType === 'start';
		return (
			<DateTimePicker
				value={new Date()}
				mode="date"
				display="default"
				onChange={(event, selectedDate) => {
					if (event.type === 'dismissed') {
						isStartPicker ? setStartDate(null) : setEndDate(null);
					} else if (selectedDate) {
						const localDate = new Date(selectedDate.getTime() + 3 * 60 * 60 * 1000);
						const formattedDate = localDate.toISOString().split('T')[0];
						isStartPicker ? setStartDate(formattedDate) : setEndDate(formattedDate);
					}
					isStartPicker ? setShowStartPicker(false) : setShowEndPicker(false);
				}}
			/>
		);
	};

	const styles = StyleSheet.create({
		filterBar: {
			padding: 20,
			gap: 20,
			marginBottom: 20
		},
		searchContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: 20
		},
		iconButton: {
			padding: 8
		},
		dateFilters: {
			flexDirection: 'row',
			justifyContent: 'space-around'
		},
		dateInput: {
			padding: 8,
			borderWidth: 1,
			borderColor: buttonBorder,
			borderRadius: 50,
			textAlign: 'center',
			color: text
		},
		buttonApply: {
			backgroundColor: buttonBg,
			borderWidth: 1,
			borderColor: buttonBorder,
			borderRadius: 50,
			textAlign: 'center'
		},
		buttonApplyText: {
			padding: 8,
			color: BUTTON_TEXT,
			textAlign: 'center'
		}
	});

	return (
		<View style={[styles.filterBar, { backgroundColor: headerFooter }]}>
			<View style={styles.searchContainer}>
				<TextInput
					style={{
						flex: 1,
						padding: 8,
						borderWidth: 1,
						borderColor: buttonBorder,
						borderRadius: 50,
						color: text
					}}
					placeholder="Search meetups..."
					placeholderTextColor={text}
					value={searchQuery}
					onChangeText={setSearchQuery}
					onSubmitEditing={() => applyFilters()}
				/>
				<TouchableOpacity onPress={() => setShowDateFilters(!showDateFilters)}>
					<Feather name="calendar" size={20} color={text} />
				</TouchableOpacity>
			</View>

			{showDateFilters && (
				<View style={styles.dateFilters}>
					<TouchableOpacity onPress={() => setShowStartPicker(true)}>
						<TextInput
							style={styles.dateInput}
							placeholder="Start Date"
							placeholderTextColor={text}
							value={startDate || ''}
							editable={false}
						/>
					</TouchableOpacity>

					<TouchableOpacity onPress={() => setShowEndPicker(true)}>
						<TextInput
							style={styles.dateInput}
							placeholder="End Date"
							placeholderTextColor={text}
							value={endDate || ''}
							editable={false}
						/>
					</TouchableOpacity>
				</View>
			)}

			<TouchableOpacity onPress={applyFilters} style={styles.buttonApply}>
				<Text style={styles.buttonApplyText}>Apply Filters</Text>
			</TouchableOpacity>

			{showStartPicker && renderDatePicker('start')}
			{showEndPicker && renderDatePicker('end')}
		</View>
	);
};

export default FilterBar;
