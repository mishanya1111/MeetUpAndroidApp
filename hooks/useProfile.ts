import {useEffect, useState} from 'react';
import axios from 'axios';
import { USER_API_URL } from '@/constant/apiURL';
import { useAuth } from '@/context/AuthContext';
import {giveConfig, giveConfigWithContentType} from "@/utils/giveConfig";

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

export const useProfile = (targetProfileId?: number) => {
    const { userID, token } = useAuth();
    const actualUserId = targetProfileId ?? userID;
    const isOwnProfile = targetProfileId === undefined || targetProfileId === userID;

    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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

    const getUserData = async (userID: number | null, token: object | undefined) => {
        try {
            const response = await axios.get(
                `${USER_API_URL}${userID}/`,
                giveConfig(token)
            );
            return response.data;
        } catch (error) {
            console.error('Ошибка загрузки данных пользователя:', error);
            return null;
        }
    };
    const updateUserData = async (userID: number, token: object | undefined, userData: any) => {
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

            const response = await axios.put(
                `${USER_API_URL}${userID}/`,
                formData,
                giveConfigWithContentType(token)
            );

            console.log("Ответ от сервера:", response.data);
            return response.data;
        } catch (error) {
            console.error('Ошибка обновления данных пользователя:', error.response?.data || error.message);
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
        } catch (error) {
            console.error('Failed to update profile:', error);
            return null;
        }
    };


    return { userData, loading, error, updateProfile, isOwnProfile };
};
