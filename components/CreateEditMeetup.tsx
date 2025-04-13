import React, { useEffect, useState } from 'react';
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
	Pressable
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { BackgroundView } from '@/components/styleComponent/BackgroundView';
import HeaderWithTitle from '@/components/headerWithTitle';
import { useThemeColors } from '@/hooks/useThemeColors';
import axios from 'axios';
import { MEETINGS_API_URL } from '@/constant/apiURL';
import { useAuth } from '@/context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { giveConfig, giveConfigWithContentType } from '@/utils/giveConfig';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useMeetupUpdate } from '@/context/MeetupUpdateContext';

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
		datetime_beg: '',
		link: '',
		image: null as null | { uri: string }
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { triggerRefetch } = useMeetupUpdate();

	// Загрузка митапа при редактировании
	useEffect(() => {
		if (isEditing) {
			const fetchMeetup = async () => {
				try {
					const res = await axios.get(
						`${MEETINGS_API_URL}${meetupId}/`,
						giveConfig(token)
					);
					const { title, description, datetime_beg, link, image } = res.data;
					setFormData({
						title,
						description,
						datetime_beg,
						link,
						image: image ? { uri: image } : null
					});
				} catch (err) {
					setError('Failed to load meetup.');
				}
			};
			fetchMeetup();
		}
	}, [meetupId]);

	const handleChange = (key: string, value: string) => {
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

	const handleSubmit = async () => {
		setLoading(true);
		setError(null);

		try {
			let payload: any = formData;
			let config = giveConfig(token);

			const useFormData = !!formData.image;

			if (useFormData) {
				const form = new FormData();
				Object.entries(formData).forEach(([key, value]) => {
					if (!value) return;

					if (key === 'image' && value) {
						form.append('image', {
							uri: value.uri,
							type: value.type || 'image/jpeg',
							name: value.name || `meetup_${Date.now()}.jpg`
						});
					} else {
						form.append(key, value);
					}
				});

				payload = form;
				config = giveConfigWithContentType(token);
			}

			if (isEditing) {
				await axios.patch(`${MEETINGS_API_URL}${meetupId}/`, payload, config);
				Alert.alert('Success', 'Meetup successfully updated!');
			} else {
				await axios.post(MEETINGS_API_URL, payload, config);
				Alert.alert('Success', 'Meetup successfully created!');
			}
			triggerRefetch();
			router.back();
		} catch (err: any) {
			console.error('ERROR RESPONSE:', err.response?.data || err.message);
			setError('Failed to submit meetup.');
			Alert.alert('Error', 'Failed to submit meetup.');
		} finally {
			setLoading(false);
		}
	};

	const handleDateChange = (event: any, selectedDate?: Date) => {
		if (Platform.OS === 'android') {
			if (event.type === 'set' && selectedDate) {
				handleChange('datetime_beg', selectedDate.toISOString());
				setShowDatePicker(false);
				setShowTimePicker(true);
			} else {
				setShowDatePicker(false); // Закрыть, если отменил
			}
		} else if (selectedDate) {
			handleChange('datetime_beg', selectedDate.toISOString());
		}
	};

	const handleTimeChange = (event: any, selectedTime?: Date) => {
		if (Platform.OS === 'android') {
			if (event.type === 'set' && selectedTime) {
				const currentDate = formData.datetime_beg
					? new Date(formData.datetime_beg)
					: new Date();

				currentDate.setHours(selectedTime.getHours());
				currentDate.setMinutes(selectedTime.getMinutes());

				handleChange('datetime_beg', currentDate.toISOString());
			}
			setShowTimePicker(false); // Закрыть вне зависимости от выбора
		} else if (selectedTime) {
			const currentDate = new Date(formData.datetime_beg);
			currentDate.setHours(selectedTime.getHours());
			currentDate.setMinutes(selectedTime.getMinutes());
			handleChange('datetime_beg', currentDate.toISOString());
		}
	};

	return (
		<BackgroundView>
			<ScrollView contentContainerStyle={styles.container}>
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

				<Text style={[styles.label, { color: text }]}>Start Date and Time:</Text>
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
								onChange={handleDateChange}
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
								onChange={handleTimeChange}
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
									value: formData.datetime_beg ? new Date(formData.datetime_beg) : new Date(),
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
							<Text style={{ color: '#000' }}>
								{formData.datetime_beg
									? new Date(formData.datetime_beg).toLocaleString()
									: 'Pick date and time'}
							</Text>
						</Pressable>
					</>
				)}

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
					<TouchableOpacity onPress={() => Linking.openURL(formData.link)}>
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
	disabledButton: {
		opacity: 0.6
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold'
	},
	errorText: {
		color: 'red',
		textAlign: 'center',
		marginTop: 8
	}
});
