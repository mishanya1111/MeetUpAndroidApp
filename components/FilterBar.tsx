import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useThemeColors';
import { BUTTON_TEXT } from '@/constant/Colors';

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
	const { headerFooter, text, buttonBorder, buttonBg } = useThemeColors();

	const handleApplyFilters = () => {
		console.log('on apply: ' + 'start: ' + startDate + 'endDate' + endDate);
		onSearchChange(searchQuery);
		onDateFilter(
			startDate ? startDate.toISOString().split('T')[0] : '',
			endDate ? endDate.toISOString().split('T')[0] : ''
		);
		onApplyFilters();
	};

	const renderDatePicker = (pickerType: 'start' | 'end') => {
		const isStartPicker = pickerType === 'start';
		return (
			<DateTimePicker
				value={isStartPicker ? startDate || new Date() : endDate || new Date()}
				mode="date"
				display="default"
				//timeZoneOffsetInMinutes={180}
				onChange={(event, selectedDate) => {
					console.log(event);
					console.log(selectedDate);
					if (event.type === 'dismissed') {
						isStartPicker ? setStartDate(null) : setEndDate(null);
					} else if (selectedDate) {
						const localDate = new Date(selectedDate.getTime() + 3 * 60 * 60 * 1000); // +3 часа
						isStartPicker ? setStartDate(localDate) : setEndDate(localDate);
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
			justifyContent: 'space-between',
			marginVertical: 10
		},
		dateButton: {
			flex: 1,
			marginHorizontal: 5
		},
		dateInput: {
			padding: 8,
			borderWidth: 1,
			borderColor: buttonBorder,
			borderRadius: 50,
			textAlign: 'center'
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
			<View style={[styles.searchContainer]}>
				<TextInput
					style={{
						flex: 1,
						padding: 8,
						borderWidth: 1,
						borderColor: buttonBorder,
						borderRadius: 50
					}}
					placeholder="Search meetups..."
					placeholderTextColor={text}
					value={searchQuery}
					onChangeText={setSearchQuery}
				/>
				<TouchableOpacity
					onPress={() => setShowDateFilters(!showDateFilters)}
					style={[styles.iconButton]}
				>
					<Feather name="calendar" size={20} color={text} />
				</TouchableOpacity>
			</View>

			{showDateFilters && (
				<View style={styles.dateFilters}>
					<TouchableOpacity
						onPress={() => setShowStartPicker(true)}
						style={styles.dateButton}
					>
						<TextInput
							style={styles.dateInput}
							placeholderTextColor={text}
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
							placeholderTextColor={text}
							placeholder="End Date"
							value={endDate ? endDate.toISOString().split('T')[0] : ''}
							editable={false}
						/>
					</TouchableOpacity>
				</View>
			)}

			{/*<Button title="Apply Filters" onPress={handleApplyFilters} />*/}
			<TouchableOpacity onPress={handleApplyFilters} style={styles.buttonApply}>
				<Text style={styles.buttonApplyText}> Apply Filters </Text>
			</TouchableOpacity>
			{showStartPicker && renderDatePicker('start')}
			{showEndPicker && renderDatePicker('end')}
		</View>
	);
};

export default FilterBar;
