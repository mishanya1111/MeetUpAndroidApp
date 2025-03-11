import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { BASE, MEETUP } from '@/constant/router';
import { MEETINGS_API_URL } from '@/constant/apiURL';
import { giveConfig } from '@/utils/giveConfig';
import { useAuth } from '@/context/AuthContext';

interface FormData {
	title: string;
	description: string;
	datetime_beg: string;
	image: { uri: string; type: string; name: string } | null;
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
	const { token, userID } = useAuth();

	const handleChange = (
		field: keyof FormData,
		value: string | { uri: string; type: string; name: string } | null
	) => {
		setFormData(prev => ({ ...prev, [field]: value }));
	};

	const pickImage = async () => {
		try {
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
					name: image.fileName || `photo_${Date.now()}.jpg`
				};

				handleChange('image', file);
			}
		} catch (err) {
			setError('Error picking an image');
		}
	};

	const handleSubmit = async () => {
		console.log('hi');
		setLoading(true);
		setError(null);
		console.log('start create');
		try {
			const formDataToSend = new FormData();
			formDataToSend.append('title', formData.title);
			formDataToSend.append('author_id', userID);
			formDataToSend.append('datetime_beg', formData.datetime_beg);
			formDataToSend.append('link', formData.link);
			formDataToSend.append('description', formData.description);
			if (formData.image) {
				formDataToSend.append('image', {
					uri: formData.image.uri,
					type: formData.image.type,
					name: formData.image.name
				});
			}
			/*{
          uri: formData.image.uri,
          type: formData.image.type,
          name: formData.image.name
        } as any*/
			console.log(MEETINGS_API_URL);
			console.log(formDataToSend);
			console.log(giveConfig(token));
			axios.defaults.headers.common['Accept'] = 'application/json';
			axios.defaults.withCredentials = true; // если сервер использует cookies
			for (let pair of formDataToSend.entries()) {
				console.log(pair[0], pair[1]);
			}

			const result = await axios.post(MEETINGS_API_URL, formDataToSend, {
				headers: {
					Authorization: `Bearer ${token?.access}`,
					'Content-Type': 'multipart/form-data'
				}
			});
			const meetupId = result.data.id;

			console.log(meetupId);
			router.push(BASE); //сделано для того чтобы при нажатии на назад кидало не на создание митапов
			router.push(`${MEETUP}/${meetupId}`);
		} catch (err) {
			if (axios.isAxiosError(err)) {
				console.log('Axios error details:', err.response);
			}
			console.log('Unexpected error:', err);

			setError(err.message || 'Something went wrong');
		} finally {
			setLoading(false);
		}
	};

	return { formData, handleChange, pickImage, handleSubmit, loading, error };
};
