import {useEffect, useState, useCallback} from 'react';
import axios from 'axios';
import { USER_API_URL } from '@/constant/apiURL';
import { useAuth } from '@/context/AuthContext';
import {getUserData, updateUserData} from "@/constant/userApi";

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
