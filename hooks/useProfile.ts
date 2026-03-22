import { useEffect, useState } from 'react';
import axios from 'axios';
import { USER_API_URL } from '@/constant/apiURL';
import { useAuth } from '@/context/AuthContext';
import { giveConfig, giveConfigWithContentType } from '@/utils/giveConfig';

interface UserProfile {
	first_name: string;
	last_name: string;
	email: string;
	user_description: string;
	username: string;
	photo: string | null;
}

export const useProfile = (targetProfileId?: number) => {
	const { userID, token } = useAuth();
	const actualUserId = targetProfileId ?? userID;
	const isOwnProfile = targetProfileId === undefined || targetProfileId === userID;

	const [userData, setUserData] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const getUserData = async (userID: number | null, token: object | undefined) => {
		try {
			const response = await axios.get(
				`${USER_API_URL}${userID}/`,
				giveConfig(token)
			);
			return response.data;
		} catch (error: any) {
			console.error('Ошибка загрузки данных пользователя:', error);
			return null;
		}
	};

	useEffect(() => {
		if (!actualUserId || !token?.access) {
			setLoading(false);
			return;
		}

		const fetchData = async () => {
			setLoading(true);
			try {
				const data = await getUserData(actualUserId, token);
				setUserData(data);
			} catch (err) {
				setError('Failed to load profile');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [actualUserId, token?.access]);

	const updateUserData = async (
		userID: number,
		token: object | undefined,
		userData: any
	) => {
		try {
			const allowedKeys = new Set([
				'first_name',
				'last_name',
				'user_description',
				'username'
			]);
			const cleanedPayload: Record<string, string> = {};

			// Добавляем только непустые текстовые поля
			Object.keys(userData).forEach(key => {
				if (!allowedKeys.has(key)) return;
				const value = userData[key];
				if (value === null || value === undefined) return;
				const strValue = String(value).trim();
				if (!strValue) return;
				cleanedPayload[key] = strValue;
			});

			const photoUri: string | undefined =
				typeof userData.photo === 'string' ? userData.photo : undefined;
			const shouldUploadPhoto =
				!!photoUri &&
				(photoUri.startsWith('file:') || photoUri.startsWith('content:'));

			let response;
			if (shouldUploadPhoto) {
				const formData = new FormData();
				Object.entries(cleanedPayload).forEach(([key, value]) => {
					formData.append(key, value);
				});
				formData.append(
					'photo',
					{
						uri: photoUri,
						type: 'image/jpeg',
						name: `profile_${Date.now()}.jpg`
					} as any
				);

				response = await axios.patch(
					`${USER_API_URL}${userID}/`,
					formData,
					giveConfigWithContentType(token)
				);
			} else {
				response = await axios.patch(
					`${USER_API_URL}${userID}/`,
					cleanedPayload,
					giveConfig(token)
				);
			}

			console.log('Ответ от сервера:', response.data);
			return response.data;
		} catch (error: any) {
			const payload = error.response?.data || error.message;
			console.error('Ошибка обновления данных пользователя:', payload);
			return null;
		}
	};

	const updateProfile = async (updatedData: Partial<UserProfile>) => {
		if (!userID || !token?.access) return null;

		try {
			const updatedUser = await updateUserData(userID, token, updatedData);
			if (updatedUser) {
				setUserData(updatedUser);
			}
			return updatedUser;
		} catch (error: any) {
			console.error('Failed to update profile:', error);
			return null;
		}
	};

	return { userData, loading, error, updateProfile, isOwnProfile };
};
