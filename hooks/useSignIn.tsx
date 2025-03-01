import { useState, useCallback } from 'react';
import axios from 'axios';
import { TOKEN_API_URL } from '@/constant/apiURL';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { PROFILE } from '@/constant/router';
export const useSignIn = () => {
	const [formData, setFormData] = useState({ username: '', password: '' });
	const [errorMessage, setErrorMessage] = useState('');
	const [isPending, setIsPending] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const { saveDate } = useAuth();
	const router = useRouter();

	const togglePasswordVisibility = useCallback(
		() => setShowPassword(prev => !prev),
		[]
	);
	const handleInputChange = useCallback((name: string, value: string) => {
		setFormData(prevData => ({ ...prevData, [name]: value }));
	}, []);

	const handleSubmit = useCallback(async () => {
		setIsPending(true);
		try {
			const response = await axios.post(TOKEN_API_URL, formData);
			saveDate(response.data);
			console.log('successful');
			router.push(PROFILE);
		} catch (error) {
			setErrorMessage('Invalid username or password. Please try again.');
		} finally {
			setIsPending(false);
		}
	}, [formData, saveDate, router]);

	return {
		formData,
		errorMessage,
		isPending,
		showPassword,
		togglePasswordVisibility,
		handleInputChange,
		handleSubmit
	};
};
