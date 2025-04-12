import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { REGISTER_API_URL } from '@/constant/apiURL';
import { useRouter } from 'expo-router';
import { PROFILE } from '@/constant/router';
import { useAuth } from '@/context/AuthContext';

export const useSignUp = () => {
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: ''
	});
	const [errorMessage, setErrorMessage] = useState('');
	const [isPending, setIsPending] = useState(false);
	const router = useRouter();
	const { saveDate } = useAuth();

	const handleInputChange = useCallback((name: string, value: string) => {
		setFormData(prevData => ({ ...prevData, [name]: value }));
	}, []);

	useEffect(() => {
		// console.log(formData);
	}, [formData]);

	// SUBMIT:
	const handleSubmit = useCallback(async () => {
		console.log('registration start with data: ');
		console.log(formData);

		setIsPending(true);

		try {
			const response = await axios.post(REGISTER_API_URL, formData);
			console.log('Give date');
			saveDate(response.data);
			console.log('Registration successful');
			router.push(PROFILE);
		} catch (error) {
			console.log('Registration error:', error.response?.data);

			const data = error.response?.data;

			if (data?.email?.[0] === 'user with this email already exists.') {
				setErrorMessage(
					'User with this email is already registered. Please log in instead.'
				);
			} else if (data?.username?.[0]) {
				setErrorMessage(data.username[0]);
			} else if (typeof data === 'object') {
				// fallback на json ошибок
				setErrorMessage(JSON.stringify(data, null, 2));
			} else {
				setErrorMessage('Registration failed. Please try again.');
			}
		} finally {
			setIsPending(false);
		}
	}, [formData, router]);

	return {
		formData,
		errorMessage,
		isPending,
		handleInputChange,
		handleSubmit
	};
};
