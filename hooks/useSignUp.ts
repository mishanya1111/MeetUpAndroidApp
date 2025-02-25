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
		console.log(formData);
	}, [formData]);
	const handleSubmit = useCallback(async () => {
		console.log('registration start');
		setIsPending(true);
		try {
			const response = await axios.post(REGISTER_API_URL, formData);
			console.log('Give date');
			saveDate(response.data);
			console.log('Registration successful');
			router.push(PROFILE);
		} catch (error) {
			console.log('lose date');
			console.log(error);
			console.log(error.toString());
			setErrorMessage(error.response?.data?.username[0]);
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
