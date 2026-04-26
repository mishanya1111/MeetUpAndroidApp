import React, { useEffect, useRef, useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Image,
	StyleSheet,
	Platform,
	Linking,
	ScrollView,
	Pressable,
	Animated,
	Easing,
	LayoutChangeEvent,
	StyleProp,
	TextStyle,
	ViewStyle,
	Alert,
	KeyboardAvoidingView
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { BackgroundView } from '@/components/styleComponent/BackgroundView';
import HeaderWithTitle from '@/components/headerWithTitle';
import { useThemeColors } from '@/hooks/useThemeColors';
import axios from 'axios';
import { GPT_URL, MEETINGS_API_URL, TAGS_API_URL } from '@/constant/apiURL';
import { useAuth } from '@/context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { giveConfig, giveConfigWithContentType } from '@/utils/giveConfig';
import { router } from 'expo-router';
import { useMeetupUpdate } from '@/context/MeetupUpdateContext';
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

type Props = {
	meetupId?: number;
};

export default function CreateEditMeetup({ meetupId }: Props) {
	const isEditing = !!meetupId;
	const { token } = useAuth();
	const { text } = useThemeColors();

	const [formData, setFormData] = useState({
		title: '',
		description: '',
		datetime_beg: '',        // пустая строка — пользователь обязан выбрать вручную
		duration: '1',           // по умолчанию 1 час
		link: '',
		image: null as null | { uri: string; type?: string; name?: string },
		tag_ids: [] as number[]
	});
	const [allTags, setAllTags] = useState<
		{ id: number; name: string; slug: string; color: string }[]
	>([]);
	const [tagsLoading, setTagsLoading] = useState(false);
	const [aiResponse, setAiResponse] = useState('');
	const [isAiResponseVisible, setIsAiResponseVisible] = useState(false);
	const [isPendingAI, setIsPendingAI] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { triggerRefetch } = useMeetupUpdate();

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

	// Загрузка митапа при редактировании
	useEffect(() => {
		if (isEditing) {
			const fetchMeetup = async () => {
				try {
					const res = await axios.get(
						`${MEETINGS_API_URL}${meetupId}/`,
						giveConfig(token)
					);
					const { title, description, datetime_beg, link, image, duration, tags } =
						res.data;
					setFormData({
						title,
						description,
						datetime_beg,
						duration: String(duration ?? ''),
						link,
						image: image ? { uri: image } : null,
						tag_ids: Array.isArray(tags)
							? tags.map((t: any) => t?.id).filter(Boolean)
							: []
					});
				} catch (err) {
					setError('Failed to load meetup.');
				}
			};
			fetchMeetup();
		}
	}, [meetupId]);

	const handleChange = (key: string, value: string) => {
		if (key === 'duration') {
			const sanitized = value.replace(/[^0-9]/g, '');
			setFormData(prev => ({ ...prev, duration: sanitized }));
			return;
		}
		setFormData(prev => ({ ...prev, [key]: value }));
	};

	const pickImage = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== 'granted') {
			alert('Permission to access gallery is required!');
			return;
		}
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1
		});
		if (!result.canceled) {
			setFormData(prev => ({
				...prev,
				image: {
					uri: result.assets[0].uri,
					type: 'image/jpeg',
					name: `meetup_${Date.now()}.jpg`
				}
			}));
		}
	};

	const handleImproveWithAI = async () => {
		if (!formData.description.trim()) {
			Alert.alert('Info', 'Please provide a description first.');
			return;
		}

		setIsPendingAI(true);
		try {
			const gptPrompt = `
Тебе дано краткое описание мероприятия: "${formData.description}". 
Твоя задача: расписать это описание больше объемом, сделать его структурированным и по пунктам. 
Затем дай мне ответ СТРОГО В СЛЕДУЮЩЕМ ФОРМАТЕ: 
"текст расширенного описания митапа, который ты придумаешь"
Ничего больше добавлять не нужно. НЕ ПИШИ вводных слов, комментариев, заключений, либо других текстов вне указанного формата. ТОЛЬКО содержимое улучшенного описания. 
ВАЖНО: ответ должен быть в пределах 480 символов. Если текст превышает это количество, сократи его.`;

			const gptResponse = await axios.post(
				`${GPT_URL}/chatgpt`,
				{ message: gptPrompt },
				{ headers: { 'Content-Type': 'application/json' } }
			);
			const gptMessage: string =
				gptResponse.data?.choices?.[0]?.message?.content || '';
			if (!gptMessage) {
				throw new Error('No content received from GPT.');
			}
			setAiResponse(gptMessage);
			setIsAiResponseVisible(true);
		} catch {
			Alert.alert('Error', 'Failed to communicate with AI.');
		} finally {
			setIsPendingAI(false);
		}
	};

	const handleAcceptAiSuggestion = () => {
		if (!aiResponse) return;
		setFormData(prev => ({ ...prev, description: aiResponse }));
		setAiResponse('');
		setIsAiResponseVisible(false);
	};

	const dismissAiResponse = () => {
		setAiResponse('');
		setIsAiResponseVisible(false);
	};

	const handleSubmit = async () => {
		setLoading(true);
		setError(null);

		try {
			const durationNum = Number.parseInt(String(formData.duration || ''), 10);
			if (!Number.isFinite(durationNum) || durationNum <= 0) {
				Alert.alert('Error', 'Please enter a valid duration in hours.');
				setLoading(false);
				return;
			}
			const durationForApi = durationNum;

			// Дата обязательна — пользователь должен выбрать вручную
			if (!formData.datetime_beg) {
				Alert.alert('Error', 'Please select the start date and time for the meetup.');
				setLoading(false);
				return;
			}

			// Дата должна быть минимум на 5 минут в будущем
			const selectedDate = new Date(formData.datetime_beg);
			const minAllowedDate = new Date(Date.now() + 5 * 60 * 1000);
			if (selectedDate < minAllowedDate) {
				Alert.alert('Error', 'The start time must be at least 5 minutes in the future.');
				setLoading(false);
				return;
			}

			const datetimeToSend = formData.datetime_beg;

			// Нормализуем ссылку: добавляем https:// если нет протокола
			const normalizeUrl = (url: string): string => {
				const trimmed = url.trim();
				if (!trimmed) return trimmed;
				if (/^https?:\/\//i.test(trimmed)) return trimmed;
				return `https://${trimmed}`;
			};

			const payload = new FormData();
			payload.append('title', formData.title);
			payload.append('description', formData.description);
			payload.append('datetime_beg', datetimeToSend);
			payload.append('link', normalizeUrl(formData.link));
			payload.append('duration', String(durationForApi));
			formData.tag_ids.forEach(id => payload.append('tag_ids', String(id)));

			if (formData.image) {
				payload.append(
					'image',
					{
						uri: formData.image.uri,
						type: formData.image.type || 'image/jpeg',
						name: formData.image.name || `meetup_${Date.now()}.jpg`
					} as any
				);
			}

			const config = giveConfigWithContentType(token);

			console.log('=== SUBMIT MEETUP ===');
			console.log('datetime_beg:', datetimeToSend);
			console.log('title:', formData.title);
			console.log('duration:', durationForApi);
			console.log('link:', normalizeUrl(formData.link));
			console.log('tag_ids:', formData.tag_ids);
			console.log('token:', token?.access ? 'present' : 'MISSING');

			if (isEditing) {
				const res = await axios.patch(`${MEETINGS_API_URL}${meetupId}/`, payload, config);
				console.log('PATCH response:', res.status, res.data);
				router.back();
				// небольшая задержка — даём серверу время обработать запрос
				setTimeout(() => triggerRefetch(), 1500);
				Alert.alert('Success', 'Meetup successfully updated!');
			} else {
				const res = await axios.post(MEETINGS_API_URL, payload, config);
				console.log('POST response:', res.status, res.data);
				router.back();
				// небольшая задержка — даём серверу время обработать запрос
				setTimeout(() => triggerRefetch(), 1500);
				Alert.alert('Success', 'Meetup successfully created!');
			}
		} catch (err: any) {
			console.error('ERROR RESPONSE:', err.response?.data || err.message);
			const serverMessage =
				typeof err.response?.data === 'string'
					? err.response.data
					: JSON.stringify(err.response?.data || {}, null, 2);
			setError('Failed to submit meetup.');
			Alert.alert('Error', serverMessage || 'Failed to submit meetup.');
		} finally {
			setLoading(false);
		}
	};

	const handleDateChangeIOS = (_event: any, selectedDate?: Date) => {
		if (!selectedDate) return;
		const currentDate = formData.datetime_beg
			? new Date(formData.datetime_beg)
			: new Date();
		currentDate.setFullYear(
			selectedDate.getFullYear(),
			selectedDate.getMonth(),
			selectedDate.getDate()
		);
		handleChange('datetime_beg', currentDate.toISOString());
	};

	const handleTimeChangeIOS = (_event: any, selectedTime?: Date) => {
		if (!selectedTime) return;
		const currentDate = formData.datetime_beg
			? new Date(formData.datetime_beg)
			: new Date();
		currentDate.setHours(selectedTime.getHours());
		currentDate.setMinutes(selectedTime.getMinutes());
		handleChange('datetime_beg', currentDate.toISOString());
	};

	return (
		<BackgroundView>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
			>
			<ScrollView
				contentContainerStyle={styles.container}
				keyboardShouldPersistTaps="handled"
			>
				<View style={styles.headerContainer}>
					<HeaderWithTitle title={isEditing ? 'Edit Meetup' : 'Create Meetup'} />
				</View>

				{formData.image && (
					<Image source={{ uri: formData.image.uri }} style={styles.image} />
				)}

				<TouchableOpacity
					style={[styles.button, styles.blueButton, { marginTop: 10 }]}
					onPress={pickImage}
				>
					<Text style={styles.buttonText}>Upload Image</Text>
				</TouchableOpacity>

				<Text style={[styles.label, { color: text }]}>Title:</Text>
				<TextInput
					style={styles.input}
					value={formData.title}
					onChangeText={text => handleChange('title', text)}
					placeholder="Enter title"
					placeholderTextColor="#aaa"
				/>

				<Text style={[styles.label, { color: text }]}>Description:</Text>
				<TextInput
					style={[styles.input, styles.descriptionInput]}
					value={formData.description}
					onChangeText={text => handleChange('description', text)}
					placeholder="Enter description"
					placeholderTextColor="#aaa"
					multiline
				/>

				<GradientLoadingButton
					style={[styles.button, styles.blueButton, { width: '100%', maxWidth: 400 }]}
					onPress={handleImproveWithAI}
					disabled={isPendingAI}
					loading={isPendingAI}
					label={isPendingAI ? 'AI...' : 'Improve with AI'}
					textStyle={styles.buttonText}
				/>

				{isAiResponseVisible ? (
					<View style={{ width: '100%', maxWidth: 400 }}>
						<Text style={[styles.label, { color: text }]}>AI suggestion:</Text>
						<TextInput
							style={[styles.input, styles.descriptionInput]}
							value={aiResponse}
							onChangeText={setAiResponse}
							multiline
						/>
						<View style={{ flexDirection: 'row', gap: 10 }}>
							<TouchableOpacity
								style={[
									styles.button,
									styles.aiActionButton,
									styles.greenButton,
									{ flex: 1, marginTop: 0 }
								]}
								onPress={handleAcceptAiSuggestion}
							>
								<Text style={styles.buttonText}>Use</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[
									styles.button,
									styles.aiActionButton,
									styles.redButton,
									{ flex: 1, marginTop: 0 }
								]}
								onPress={dismissAiResponse}
							>
								<Text style={styles.buttonText}>Dismiss</Text>
							</TouchableOpacity>
						</View>
					</View>
				) : null}

				<View style={{ height: 16 }} />

				<Text style={[styles.label, { color: text }]}>Start Date and Time: <Text style={{ color: formData.datetime_beg ? 'transparent' : '#e05252', fontSize: 12, fontWeight: 'normal' }}>{formData.datetime_beg ? '' : '(required — please select)'}</Text></Text>
				{Platform.OS === 'ios' && (
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'center',
							marginBottom: 2
						}}
					>
						<View>
							<DateTimePicker
								value={
									formData.datetime_beg
										? new Date(formData.datetime_beg)
										: new Date()
								}
								mode="date"
								display="compact"
								onChange={handleDateChangeIOS}
							/>
						</View>
						<View style={{ width: 100 }}>
							<DateTimePicker
								value={
									formData.datetime_beg
										? new Date(formData.datetime_beg)
										: new Date()
								}
								mode="time"
								display="compact"
								onChange={handleTimeChangeIOS}
							/>
						</View>
					</View>
				)}

				{/* Android — единая кнопка выбора */}
				{Platform.OS === 'android' && (
					<>
						<Pressable
							onPress={() =>
								DateTimePickerAndroid.open({
									value: formData.datetime_beg
										? new Date(formData.datetime_beg)
										: new Date(),
									mode: 'date',
									display: 'default',
									onChange: (_event, selectedDate) => {
										if (selectedDate) {
											handleChange('datetime_beg', selectedDate.toISOString());
											DateTimePickerAndroid.open({
												value: selectedDate,
												mode: 'time',
												display: 'default',
												onChange: (_event, selectedTime) => {
													if (selectedTime) {
														const combined = new Date(selectedDate);
														combined.setHours(selectedTime.getHours());
														combined.setMinutes(selectedTime.getMinutes());
														handleChange('datetime_beg', combined.toISOString());
													}
												}
											});
										}
									}
								})
							}
							style={styles.input}
						>
							<Text style={{ color: formData.datetime_beg ? '#000' : '#aaa' }}>
								{formData.datetime_beg
									? new Date(formData.datetime_beg).toLocaleString()
									: 'Tap to select date and time'}
							</Text>
						</Pressable>
					</>
				)}

				<Text style={[styles.label, { color: text }]}>Duration (hours):</Text>
				<TextInput
					style={styles.input}
					value={formData.duration}
					onChangeText={val => handleChange('duration', val)}
					placeholder="Duration"
					placeholderTextColor="#aaa"
					keyboardType="number-pad"
				/>

				<Text style={[styles.label, { color: text }]}>
					Tags:{tagsLoading ? ' loading...' : ''}
				</Text>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					<View style={styles.tagsRow}>
						{allTags.map(tag => {
							const selected = formData.tag_ids.includes(tag.id);
							return (
								<TouchableOpacity
									key={tag.id}
									onPress={() => {
										setFormData(prev => ({
											...prev,
											tag_ids: selected
												? prev.tag_ids.filter(id => id !== tag.id)
												: [...prev.tag_ids, tag.id]
										}));
									}}
									style={[
										styles.tagChip,
										selected && styles.tagChipSelected,
										{ borderColor: tag.color || '#ccc' }
									]}
								>
									<Text
										style={[
											styles.tagChipText,
											selected && styles.tagChipTextSelected
										]}
									>
										{tag.name}
									</Text>
								</TouchableOpacity>
							);
						})}
					</View>
				</ScrollView>

				<Text style={[styles.label, { color: text }]}>Link:</Text>
				<TextInput
					style={styles.input}
					value={formData.link}
					onChangeText={text => handleChange('link', text)}
					placeholder="Enter link"
					placeholderTextColor="#aaa"
					keyboardType="url"
				/>

				{formData.link ? (
					<TouchableOpacity
						onPress={() => {
							const url = formData.link.trim();
							const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;
							Linking.openURL(normalized);
						}}
					>
						<Text style={[styles.link, { color: '#3a6ff7' }]}>Open Link</Text>
					</TouchableOpacity>
				) : (
					<Text style={[styles.noLink, { color: text }]}>No link provided</Text>
				)}

				<TouchableOpacity
					style={[
						styles.button,
						styles.greenButton,
						loading && styles.disabledButton
					]}
					onPress={handleSubmit}
					disabled={loading}
				>
					<Text style={styles.buttonText}>
						{loading
							? isEditing
								? 'Saving...'
								: 'Creating...'
							: isEditing
								? 'Save Changes'
								: 'Create Meetup'}
					</Text>
				</TouchableOpacity>

				{error && <Text style={styles.errorText}>{error}</Text>}
			</ScrollView>
			</KeyboardAvoidingView>
		</BackgroundView>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		paddingLeft: 10,
		paddingRight: 10
	},
	headerContainer: {
		alignSelf: 'flex-start',
		width: '100%',
		marginBottom: 10
	},
	label: {
		alignSelf: 'flex-start',
		fontSize: 14,
		fontWeight: 'bold',
		marginBottom: 4
	},
	input: {
		backgroundColor: '#fff',
		borderRadius: 8,
		padding: 10,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: '#ccc',
		width: '100%',
		maxWidth: 400
	},
	descriptionInput: {
		height: 100,
		textAlignVertical: 'top'
	},
	image: {
		width: 120,
		height: 120,
		borderRadius: 8,
		marginBottom: 12
	},
	link: {
		marginBottom: 12,
		textDecorationLine: 'underline',
		fontWeight: 'bold'
	},
	noLink: {
		marginBottom: 12
	},
	button: {
		paddingVertical: 10,
		width: '80%',
		borderRadius: 8,
		alignItems: 'center',
		marginTop: 15
	},
	blueButton: {
		backgroundColor: '#3a6ff7',
		marginTop: 5,
		marginBottom: 20
	},
	greenButton: {
		backgroundColor: '#1c8139'
	},
	redButton: {
		backgroundColor: '#cc2f2f'
	},
	aiActionButton: {
		paddingVertical: 8,
		marginBottom: 0
	},
	disabledButton: {
		opacity: 0.6
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold'
	},
	tagsRow: {
		flexDirection: 'row',
		gap: 10,
		paddingVertical: 6,
		paddingHorizontal: 2
	},
	tagChip: {
		paddingVertical: 6,
		paddingHorizontal: 10,
		borderRadius: 999,
		borderWidth: 1,
		backgroundColor: '#fff'
	},
	tagChipSelected: {
		backgroundColor: '#3a6ff7'
	},
	tagChipText: {
		color: '#000'
	},
	tagChipTextSelected: {
		color: '#fff'
	},
	errorText: {
		color: 'red',
		textAlign: 'center',
		marginTop: 8
	}
});
