import { useState, useCallback, useEffect } from 'react';
import { Alert } from "react-native";
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
			console.log('lose date');

			if (error.response?.data?.email?.[0] === "user with this email already exists.") {
				Alert.alert("Error!", "User with this email is already registered, you should login instead.");
			} else {
				setErrorMessage(JSON.stringify(error.response?.data, null, 2)); // Показываем другую ошибку
			}

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
