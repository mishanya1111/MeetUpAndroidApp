import React, { useState } from 'react';
import {
	View,
	TextInput,
	Button,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
	Linking,
	Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useCreateMeetup } from '@/hooks/useCreateMeetup';

const CreateMeetup = () => {
	const { formData, handleChange, pickImage, handleSubmit, loading, error } =
		useCreateMeetup();
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
		<View style={styles.container}>
			<TextInput
				style={styles.input}
				placeholder="Title"
				value={formData.title}
				onChangeText={text => handleChange('title', text)}
			/>
			<TextInput
				style={styles.input}
				placeholder="Description"
				value={formData.description}
				onChangeText={text => handleChange('description', text)}
			/>
			<TouchableOpacity onPress={() => setShowDatePicker(true)}>
				<TextInput
					style={styles.input}
					placeholder="Start Date and Time"
					value={
						formData.datetime_beg
							? new Date(formData.datetime_beg).toLocaleString()
							: ''
					}
					editable={false}
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

			<TextInput
				style={styles.input}
				placeholder="Link"
				value={formData.link}
				keyboardType="url"
				onChangeText={text => handleChange('link', text)}
			/>

			{formData.link ? (
				<TouchableOpacity onPress={() => Linking.openURL(formData.link)}>
					<Text style={styles.link}>Open Link</Text>
				</TouchableOpacity>
			) : (
				<Text style={styles.noLink}>No link provided</Text>
			)}

			{formData.image && (
				<Image source={{ uri: formData.image.uri }} style={styles.image} />
			)}

			<Button title="Upload Image" onPress={pickImage} />
			<Button title="Create Meetup" onPress={handleSubmit} disabled={loading} />

			{error && <Text style={styles.errorText}>{error}</Text>}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		padding: 8,
		marginBottom: 12
	},
	image: {
		width: 100,
		height: 100,
		borderRadius: 8,
		marginBottom: 12
	},
	link: {
		color: 'blue',
		textDecorationLine: 'underline',
		marginBottom: 12
	},
	noLink: {
		color: '#888',
		marginBottom: 12
	},
	errorText: {
		color: 'red',
		textAlign: 'center',
		marginTop: 8
	}
});

export default CreateMeetup;
