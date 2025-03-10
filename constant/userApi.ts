import axios from 'axios';
import { USER_API_URL } from './apiURL';
import { AxiosResponse } from 'axios';


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

