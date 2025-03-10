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

export const updateUserData = async (userID: number, token: string, userData: object) => {
    try {
        const response = await axios.put(`${USER_API_URL}${userID}/`, userData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Ошибка обновления данных пользователя:', error);
        return null;
    }
};
