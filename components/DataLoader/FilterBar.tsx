import React, { useEffect, useRef, useState } from 'react';
import {
	View,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Text,
	Platform,
	ScrollView,
	Animated,
	Easing,
	LayoutChangeEvent,
	StyleProp,
	TextStyle,
	ViewStyle
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useThemeColors';
import { BUTTON_TEXT } from '@/constant/Colors';
import axios from 'axios';
import { TAGS_API_URL } from '@/constant/apiURL';
import { LinearGradient } from 'expo-linear-gradient';

const AI_GRADIENT_COLORS = ['#fd7f84', '#efcc7d', '#cd52f5', '#892de8'] as const;

type GradientLoadingButtonProps = {
	label: string;
	loading: boolean;
	disabled?: boolean;
	onPress: () => void | Promise<void>;
	style?: StyleProp<ViewStyle>;
	textStyle?: StyleProp<TextStyle>;
};

function GradientLoadingButton({
	label,
	loading,
	disabled,
	onPress,
	style,
	textStyle
}: GradientLoadingButtonProps) {
	const [width, setWidth] = useState(0);
	const translateX = useRef(new Animated.Value(0)).current;
	const animationRef = useRef<Animated.CompositeAnimation | null>(null);

	useEffect(() => {
		if (!loading || width <= 0) {
			animationRef.current?.stop();
			animationRef.current = null;
			return;
		}

		translateX.setValue(0);
		const distance = width * 2;
		const anim = Animated.loop(
			Animated.timing(translateX, {
				toValue: -distance,
				duration: 2500,
				easing: Easing.linear,
				useNativeDriver: true
			})
		);
		animationRef.current = anim;
		anim.start();

		return () => {
			anim.stop();
			animationRef.current = null;
		};
	}, [loading, translateX, width]);

	const handleLayout = (e: LayoutChangeEvent) => {
		const nextWidth = e.nativeEvent.layout.width;
		if (nextWidth && nextWidth !== width) setWidth(nextWidth);
	};

	return (
		<TouchableOpacity
			onPress={onPress}
			style={[style, { overflow: 'hidden' }]}
			disabled={disabled}
			onLayout={handleLayout}
		>
			{loading && width > 0 ? (
				<View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
					<Animated.View
						style={{
							width: width * 3,
							height: '100%',
							transform: [{ translateX }]
						}}
					>
						<LinearGradient
							colors={AI_GRADIENT_COLORS}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
							style={{ flex: 1 }}
						/>
					</Animated.View>
				</View>
			) : null}

			<Text style={[textStyle, loading ? { color: '#fff' } : null]}>{label}</Text>
		</TouchableOpacity>
	);
}

interface FilterBarProps {
	searchQuery: string;
	startDate: string | null;
	endDate: string | null;
	tagIds: number[];
	setSearchQuery: (query: string) => void;
	setStartDate: (date: string | null) => void;
	setEndDate: (date: string | null) => void;
	setTagIds: (tagIds: number[]) => void;
	applyFilters: () => void;
	runAiSearch: (query: string) => Promise<void>;
	runAiRecommend: () => Promise<void>;
}

const FilterBar: React.FC<FilterBarProps> = ({
	searchQuery,
	startDate,
	endDate,
	tagIds,
	setSearchQuery,
	setStartDate,
	setEndDate,
	setTagIds,
	applyFilters,
	runAiSearch,
	runAiRecommend
}) => {
	const [showDateFilters, setShowDateFilters] = useState(false);
	const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
	const [allTags, setAllTags] = useState<
		{ id: number; name: string; slug: string; color: string }[]
	>([]);
	const [tagsLoading, setTagsLoading] = useState(false);
	const [aiSearchLoading, setAiSearchLoading] = useState(false);
	const [aiRecommendLoading, setAiRecommendLoading] = useState(false);
	const { headerFooter, text, buttonBorder, buttonBg } = useThemeColors();
	const anyAiLoading = aiSearchLoading || aiRecommendLoading;

	useEffect(() => {
		const fetchTags = async () => {
			setTagsLoading(true);
			try {
				const response = await axios.get(TAGS_API_URL);
				setAllTags(response.data || []);
			} catch {
				setAllTags([]);
			} finally {
				setTagsLoading(false);
			}
		};
		fetchTags();
	}, []);

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
		filterRow: {
			flexDirection: 'row',
			flexWrap: 'wrap',
			gap: 10
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
		textInput: {
			padding: 8,
			borderWidth: 1,
			borderColor: buttonBorder,
			borderRadius: 12,
			color: text
		},
		chip: {
			paddingVertical: 6,
			paddingHorizontal: 10,
			borderRadius: 999,
			borderWidth: 1,
			borderColor: buttonBorder
		},
		chipSelected: {
			backgroundColor: buttonBg
		},
		chipText: {
			color: text
		},
		chipTextSelected: {
			color: BUTTON_TEXT
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
		},
		buttonSecondary: {
			borderWidth: 1,
			borderColor: buttonBorder,
			borderRadius: 50,
			backgroundColor: buttonBg
		},
		buttonSecondaryText: {
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
				<TouchableOpacity
					onPress={() => setShowAdvancedFilters(!showAdvancedFilters)}
				>
					<Feather name="sliders" size={20} color={text} />
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

			{showAdvancedFilters ? (
				<View style={{ gap: 12 }}>
					<View style={{ gap: 8 }}>
						<Text style={{ color: text }}>
							Tags{tagsLoading ? ' (loading...)' : ''}
						</Text>
						<ScrollView horizontal showsHorizontalScrollIndicator={false}>
							<View style={styles.filterRow}>
								{allTags.map(tag => {
									const selected = tagIds.includes(tag.id);
									return (
										<TouchableOpacity
											key={tag.id}
											onPress={() => {
												if (selected) {
													setTagIds(tagIds.filter(id => id !== tag.id));
												} else {
													setTagIds([...tagIds, tag.id]);
												}
											}}
										>
											<View style={[styles.chip, selected && styles.chipSelected]}>
												<Text
													style={[
														styles.chipText,
														selected && styles.chipTextSelected
													]}
												>
													{tag.name}
												</Text>
											</View>
										</TouchableOpacity>
									);
								})}
							</View>
						</ScrollView>
					</View>
				</View>
			) : null}

			<View style={styles.filterRow}>
				<GradientLoadingButton
					onPress={async () => {
						setAiSearchLoading(true);
						try {
							await runAiSearch(searchQuery);
						} finally {
							setAiSearchLoading(false);
						}
					}}
					style={[styles.buttonSecondary, { flex: 1 }]}
					disabled={anyAiLoading}
					loading={aiSearchLoading}
					label={aiSearchLoading ? 'AI...' : 'AI Search'}
					textStyle={styles.buttonSecondaryText}
				/>
				<GradientLoadingButton
					onPress={async () => {
						setAiRecommendLoading(true);
						try {
							await runAiRecommend();
						} finally {
							setAiRecommendLoading(false);
						}
					}}
					style={[styles.buttonSecondary, { flex: 1 }]}
					disabled={anyAiLoading}
					loading={aiRecommendLoading}
					label={aiRecommendLoading ? 'AI...' : 'AI Recommend'}
					textStyle={styles.buttonSecondaryText}
				/>
			</View>

			<TouchableOpacity onPress={applyFilters} style={styles.buttonApply}>
				<Text style={styles.buttonApplyText}>Apply Filters</Text>
			</TouchableOpacity>
		</View>
	);
};

export default FilterBar;
