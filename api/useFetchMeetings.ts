import { useState, useEffect } from 'react';
import axios from 'axios';

interface ApiResponse<T> {
	data: T;
}

export interface Meetup {
	id: number;
	title: string;
	description: string;
	image: string;
	dateTime: string;
}

interface FetchState<T> {
	data: T | null;
	loading: boolean;
	error: string | null;
}

const useFetchMeetings = <T>(url: string): FetchState<T> => {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			setError(null);
			try {
				const response = await axios.get<ApiResponse<T>>(url);
				setData(response.data);
			} catch (err) {
				setError((err as Error).message || 'Something went wrong');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [url]);

	return { data, loading, error };
};

export default useFetchMeetings;
