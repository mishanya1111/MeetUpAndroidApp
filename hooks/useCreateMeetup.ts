import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { BASE } from '@/constant/router';
import { MEETINGS_API_URL } from '@/constant/apiURL';
import { giveConfig } from '@/utils/giveConfig';
import { useAuth } from '@/context/AuthContext';

interface FormData {
	title: string;
	description: string;
	datetime_beg: string;
	image: File | null;
	link: string;
}

export const useCreateMeetup = () => {
	const [formData, setFormData] = useState<FormData>({
		title: '',
		description: '',
		datetime_beg: '',
		image: null,
		link: ''
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const { token } = useAuth();

	const handleChange = (field: keyof FormData, value: string | File | null) => {
		setFormData(prev => ({ ...prev, [field]: value }));
	};

	const pickImage = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== 'granted') {
			setError('Permission to access media library is required');
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1
		});

		if (!result.canceled && result.assets.length > 0) {
			const image = result.assets[0];
			const file = {
				uri: image.uri,
				type: image.mimeType || 'image/jpeg',
				name: image.fileName || 'image.jpg'
			} as unknown as File;

			handleChange('image', file);
		}
	};

	const handleSubmit = async () => {
		setLoading(true);
		setError(null);

		try {
			const formDataToSend = new FormData();
			formDataToSend.append('title', formData.title);
			formDataToSend.append('description', formData.description);
			formDataToSend.append('datetime_beg', formData.datetime_beg);
			formData.image && formDataToSend.append('image', formData.image);
			formDataToSend.append('link', formData.link);

			await axios.post(MEETINGS_API_URL, formDataToSend, giveConfig(token));

			router.push(BASE);
		} catch (err) {
			setError((err as Error).message || 'Something went wrong');
		} finally {
			setLoading(false);
		}
	};

	return { formData, handleChange, pickImage, handleSubmit, loading, error };
};
