import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { USER_API_URL } from '@/constant/apiURL';
import { giveConfig } from '@/utils/giveConfig';
import { useAuth } from '@/context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

interface Meetup {
	id: number;
	title: string;
	description: string;
	image: string;
	dateTime: string;
}

interface DateFilter {
	startDate: string;
	endDate: string;
}

export const useUserMeetups = (path: string) => {
	const [meetups, setMeetups] = useState<Meetup[]>([]);
	const [filteredMeetups, setFilteredMeetups] = useState<Meetup[]>([]);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [dateFilter, setDateFilter] = useState<DateFilter>({
		startDate: '',
		endDate: ''
	});
	const { token, userID } = useAuth();

	const fetchMeetups = async () => {
		if (!token || !userID) return; // Если нет токена или userID — не грузим данные
		setLoading(true);
		setError(null);
		try {
			console.log('start');
			const response = await axios.get(
				`${USER_API_URL}${userID}/${path}/`,
				giveConfig(token)
			);
			console.log('end');
			const results = response.data || [];
			setMeetups(
				results.map((item: any) => ({
					id: item.id,
					title: item.title,
					description: item.description,
					image: item.image || require('@/assets/img/icon.png'),
					dateTime: item.datetime_beg
				}))
			);
		} catch (err: any) {
			setError(err.response?.data?.message || 'Something went wrong');
		} finally {
			setLoading(false);
		}
	};

	useFocusEffect(
		useCallback(() => {
			fetchMeetups();
		}, [userID, token, path])
	);

	const handleSearchChange = useCallback((query: string) => {
		setSearchQuery(query);
	}, []);

	const handleDateFilter = useCallback((startDate: string, endDate: string) => {
		setDateFilter({ startDate, endDate });
	}, []);

	useEffect(() => {
		let filtered = meetups;

		if (searchQuery) {
			filtered = filtered.filter(meetup =>
				meetup.title.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}

		if (dateFilter.startDate) {
			filtered = filtered.filter(
				meetup => new Date(meetup.dateTime) >= new Date(dateFilter.startDate)
			);
		}

		if (dateFilter.endDate) {
			filtered = filtered.filter(
				meetup => new Date(meetup.dateTime) <= new Date(dateFilter.endDate)
			);
		}

		setFilteredMeetups(filtered);
	}, [searchQuery, dateFilter, meetups]);

	return {
		meetups: filteredMeetups,
		loading,
		error,
		handleSearchChange,
		handleDateFilter
	};
};
