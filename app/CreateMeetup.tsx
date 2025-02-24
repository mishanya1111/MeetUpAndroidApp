import React, { useState } from 'react';
import {
	View,
	TextInput,
	Button,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useCreateMeetup } from '@/hooks/useCreateMeetup';

const CreateMeetup = () => {
	const { formData, handleChange, pickImage, handleSubmit, loading, error } =
		useCreateMeetup();
	const [showPicker, setShowPicker] = useState(false);

	const handleDateChange = (event: any, selectedDate?: Date) => {
		setShowPicker(false);
		if (selectedDate) {
			handleChange('datetime_beg', selectedDate.toISOString());
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
			<TouchableOpacity onPress={() => setShowPicker(true)}>
				<TextInput
					style={styles.input}
					placeholder="Start Date and Time"
					value={formData.datetime_beg}
					editable={false}
				/>
			</TouchableOpacity>

			{showPicker && (
				<DateTimePicker
					value={
						formData.datetime_beg ? new Date(formData.datetime_beg) : new Date()
					}
					mode="datetime"
					display="default"
					onChange={handleDateChange}
				/>
			)}

			<TextInput
				style={styles.input}
				placeholder="Link"
				value={formData.link}
				keyboardType="url"
				onChangeText={text => handleChange('link', text)}
			/>

			{formData.image && (
				<Image
					source={{ uri: URL.createObjectURL(formData.image) }}
					style={styles.image}
				/>
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
	errorText: {
		color: 'red',
		textAlign: 'center',
		marginTop: 8
	}
});

export default CreateMeetup;
