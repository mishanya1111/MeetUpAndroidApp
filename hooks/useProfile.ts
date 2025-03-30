import {useEffect, useState, useCallback} from 'react';
import axios from 'axios';
import { USER_API_URL } from '@/constant/apiURL';
import { useAuth } from '@/context/AuthContext';

interface UserProfile {
    first_name: string;
    last_name: string;
    email: string;
    user_description: string;
    username: string;
    tg_id: string;
    teams_id: string;
    photo: string | null;
}

export const getUserData = async (userID: number | null, token: string | undefined) => {
    try {
        const response = await axios.get(`${USER_API_URL}${userID}/`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Ошибка загрузки данных пользователя:', error);
        return null;
    }
};

export const updateUserData = async (userID: number, token: string, userData: any) => {
    try {
        const formData = new FormData();

        // Добавляем текстовые данные в formData
        Object.keys(userData).forEach((key) => {
            if (userData[key] !== null && key !== 'photo') {
                formData.append(key, userData[key]);
            }
        });

        // Если есть фото, добавляем в formData
        if (userData.photo && typeof userData.photo === 'string') {
            formData.append('photo', {
                uri: userData.photo,
                type: 'image/jpeg', // Можно изменить, если загружаются другие форматы
                name: `profile_${Date.now()}.jpg`
            });
        }

        console.log("Отправка данных:", formData);

        const response = await axios.put(`${USER_API_URL}${userID}/`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log("Ответ от сервера:", response.data);
        return response.data;
    } catch (error) {
        console.error('Ошибка обновления данных пользователя:', error.response?.data || error.message);
        return null;
    }
};

export const useProfile = () => {
    const { userID, token } = useAuth();
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!userID || !token?.access) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const data = await getUserData(userID, token?.access);
            setUserData(data);
        } catch (err) {
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    }, [userID, token?.access]);

    useEffect(() => {
        if (!userID || !token?.access) {
            setLoading(false);
            return;
        }
        fetchData();
    }, [fetchData]);

    const updateProfile = async (updatedData: Partial<UserProfile>) => {
        if (!userID || !token?.access) return;

        try {
            const updatedUser = await updateUserData(userID, token.access, updatedData);
            if (updatedUser) {
                setUserData(updatedUser);
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    return { userData, loading, error, updateProfile };
};
