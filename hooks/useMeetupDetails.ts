// hooks/useMeetupDetails.ts
import { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { MEETINGS_API_URL } from '@/constant/apiURL';
import { SIGN_IN } from '@/constant/router';
import { giveConfig } from '@/utils/giveConfig';

export const useMeetupDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { token, userID } = useAuth();

  const [meetup, setMeetup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchMeetupData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${MEETINGS_API_URL}${id}/`);
        setMeetup(response.data);
      } catch (err: any) {
        setError(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    const checkIsFavorite = async () => {
      if (!token) return;

      try {
        const response = await axios.get(
          `${MEETINGS_API_URL}${id}/is_subscribed/`,
          giveConfig(token)
        );
        setIsFavorite(response.data?.message || false);
      } catch (err : any) {
        console.error('Error checking subscription:', err);
        setError(err.response?.data || err.message);
      }
    };

    fetchMeetupData();
    if (token) checkIsFavorite();
  }, [id, token]);

  const handleSignForMeeting = useCallback(async () => {
    if (!token) {
      router.push(SIGN_IN);
      return;
    }

    try {
      await axios.post(`${MEETINGS_API_URL}${id}/subscribe/`, {}, giveConfig(token));
      setIsFavorite(true);
    } catch (error : any) {
      console.error('Error signing for meeting:', error);
      setError(error.response?.data || error.message);
    }
  }, [token, id, router]);

  const handleUnsubscribe = useCallback(async () => {
    if (!token) {
      router.push(SIGN_IN);
      return;
    }

    try {
      await axios.delete(`${MEETINGS_API_URL}${id}/unsubscribe/`, giveConfig(token));
      setIsFavorite(false);
    } catch (error) {
      console.error('Error unsubscribing from meeting:', error);
    }
  }, [token, id, router]);

  const formattedDate = useMemo(() => {
    return meetup ? new Date(meetup.datetime_beg).toLocaleString() : 'Not specified';
  }, [meetup]);

  return {
    meetup,
    loading,
    error,
    isFavorite,
    formattedDate,
    userID,
    handleSignForMeeting,
    handleUnsubscribe
  };
};
