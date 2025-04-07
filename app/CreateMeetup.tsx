import React, { useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Image,
	StyleSheet,
	Platform,
	Linking,
	ScrollView
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useCreateMeetup } from '@/hooks/useCreateMeetup';
import { useThemeColors } from '@/hooks/useThemeColors';
import { BackgroundView } from '@/components/styleComponent/BackgroundView';
import HeaderWithTitle from '@/components/headerWithTitle';

export default function CreateMeetup() {
	const { formData, handleChange, pickImage, handleSubmit, loading, error } = useCreateMeetup();
	const { text } = useThemeColors();

	const [showDatePicker, setShowDatePicker] = useState(false);
	const [showTimePicker, setShowTimePicker] = useState(false);

	const handleDateChange = (_event: any, selectedDate?: Date) => {
		setShowDatePicker(false);
		if (selectedDate) {
			handleChange('datetime_beg', selectedDate.toISOString());
			if (Platform.OS === 'android') {
				setShowTimePicker(true);
			}
		}
	};

	const handleTimeChange = (_event: any, selectedTime?: Date) => {
		setShowTimePicker(false);
		if (selectedTime) {
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
					<HeaderWithTitle title="Create Meetup" />
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
				<TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ width: '100%' }}>
					<TextInput
						style={styles.input}
						value={
							formData.datetime_beg
								? new Date(formData.datetime_beg).toLocaleString()
								: ''
						}
						editable={false}
						placeholder="Pick date and time"
						placeholderTextColor="#aaa"
					/>
				</TouchableOpacity>

				{showDatePicker && (
					<DateTimePicker
						value={
							formData.datetime_beg ? new Date(formData.datetime_beg) : new Date()
						}
						mode="date"
						display="default"
						onChange={handleDateChange}
					/>
				)}

				{showTimePicker && (
					<DateTimePicker
						value={
							formData.datetime_beg ? new Date(formData.datetime_beg) : new Date()
						}
						mode="time"
						display="default"
						onChange={handleTimeChange}
					/>
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
					style={[styles.button, styles.greenButton, loading && styles.disabledButton]}
					onPress={handleSubmit}
					disabled={loading}
				>
					<Text style={styles.buttonText}>
						{loading ? 'Creating...' : 'Create Meetup'}
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
		padding: 20
	},
	headerContainer: {
		alignSelf: 'flex-start',
		width: '100%',
		marginBottom: 10,
	},
	label: {
		alignSelf: 'flex-start',
		fontSize: 14,
		fontWeight: 'bold',
		marginBottom: 4,
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
		backgroundColor: '#1c8139',
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
