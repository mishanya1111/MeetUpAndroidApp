import { useState, useCallback } from 'react';
import axios from 'axios';
import { REGISTER_API_URL } from '@/constant/apiURL';
import { useRouter } from 'expo-router';
import { SIGN_IN } from '@/constant/router';

export const useSignUp = () => {
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: ''
	});
	const [errorMessage, setErrorMessage] = useState('');
	const [isPending, setIsPending] = useState(false);
	const router = useRouter();

	const handleInputChange = useCallback((name: string, value: string) => {
		setFormData(prevData => ({ ...prevData, [name]: value }));
	}, []);

	const handleSubmit = useCallback(async () => {
		setIsPending(true);
		try {
			await axios.post(REGISTER_API_URL, formData);
			console.log('Registration successful');
			router.push(SIGN_IN);
		} catch (error) {
			setErrorMessage('Registration failed. Please try again.');
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
