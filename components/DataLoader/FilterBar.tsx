import React, { useState } from 'react';
import {
	View,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Text,
	Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
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
	const { headerFooter, text, buttonBorder, buttonBg } = useThemeColors();

	const styles = StyleSheet.create({
		filterBar: {
			padding: 20,
			gap: 20,
			marginBottom: 20,
			borderRadius: 8
		},
		searchContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: 20
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
			color: text,
			width: 140
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

	// Android — открыть выбор даты
	const openAndroidPicker = (
		currentValue: string | null,
		setValue: (val: string | null) => void
	) => {
		DateTimePickerAndroid.open({
			value: currentValue ? new Date(currentValue) : new Date(),
			mode: 'date',
			display: 'default',
			onChange: (_event, selectedDate) => {
				if (_event.type === 'dismissed') {
					// Пользователь нажал "Отмена"
					setValue(null);
				} else if (selectedDate) {
					const isoDate = selectedDate.toISOString().split('T')[0];
					setValue(isoDate);
				}
			}
		});
	};

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
					placeholder="Search for Meetups..."
					placeholderTextColor={text}
					value={searchQuery}
					onChangeText={setSearchQuery}
					onSubmitEditing={applyFilters}
				/>
				<TouchableOpacity onPress={() => setShowDateFilters(!showDateFilters)}>
					<Feather name="calendar" size={20} color={text} />
				</TouchableOpacity>
			</View>

			{showDateFilters && Platform.OS === 'android' && (
				<View style={styles.dateFilters}>
					{/* START DATE */}
					<TouchableOpacity
						onPress={
							() =>
								Platform.OS === 'android'
									? openAndroidPicker(startDate, setStartDate)
									: setStartDate(null) // оставить null, если нужно вручную вызвать iOS
						}
					>
						<TextInput
							style={styles.dateInput}
							placeholder="Start Date"
							placeholderTextColor={text}
							value={startDate || ''}
							editable={false}
						/>
					</TouchableOpacity>

					{/* END DATE */}
					<TouchableOpacity
						onPress={() =>
							Platform.OS === 'android'
								? openAndroidPicker(endDate, setEndDate)
								: setEndDate(null)
						}
					>
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

			{Platform.OS === 'ios' && showDateFilters && (
				<View style={styles.dateFilters}>
					<DateTimePicker
						value={startDate ? new Date(startDate) : new Date()}
						mode="date"
						display="compact"
						onChange={(_, date) =>
							date && setStartDate(date.toISOString().split('T')[0])
						}
					/>
					<DateTimePicker
						value={endDate ? new Date(endDate) : new Date()}
						mode="date"
						display="compact"
						onChange={(_, date) =>
							date && setEndDate(date.toISOString().split('T')[0])
						}
					/>
				</View>
			)}

			<TouchableOpacity onPress={applyFilters} style={styles.buttonApply}>
				<Text style={styles.buttonApplyText}>Apply Filters</Text>
			</TouchableOpacity>
		</View>
	);
};

export default FilterBar;
