import { useState, useEffect } from 'react';
import { MEETUP } from '@/constant/router';
import { useMeetupUpdate } from '@/context/MeetupUpdateContext';

interface Meetup {
	id: number;
	title: string;
	description: string;
	image: string;
	dateTime: string;
	to: string;
}

interface SearchParams {
	query: string;
	startDate: string | null;
	endDate: string | null;
}

export const useMeetups = (
	fetchFunction: (params: Record<string, string>) => Promise<any>
) => {
	const [meetups, setMeetups] = useState<Meetup[]>([]);
	const [searchParams, setSearchParams] = useState<SearchParams>({
		query: '',
		startDate: null,
		endDate: null
	});
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const { shouldRefetch } = useMeetupUpdate();

	const fetchData = async () => {
		setLoading(true);
		setError(null);

		const params: Record<string, string> = {
			page_size: '50',
			...(searchParams.query && { search: searchParams.query }),
			...(searchParams.startDate && { datetime_beg__gt: searchParams.startDate }),
			...(searchParams.endDate && { datetime_beg__lt: searchParams.endDate })
		};

		try {
			const data = await fetchFunction(params);
			if (data?.results) {
				setMeetups(
					data.results.map((item: any) => ({
						id: item.id,
						title: item.title,
						description: item.description,
						image: item.image || '',
						dateTime: item.datetime_beg,
						to: `${MEETUP}/${item.id}`
					}))
				);
			}
		} catch (err) {
			setError((err as Error).message || 'Something went wrong');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [shouldRefetch]);

	const setSearchQuery = (query: string) => {
		setSearchParams(prev => ({ ...prev, query }));
	};

	const setStartDate = (date: string | null) => {
		setSearchParams(prev => ({ ...prev, startDate: date }));
	};

	const setEndDate = (date: string | null) => {
		setSearchParams(prev => ({ ...prev, endDate: date }));
	};

	const applyFilters = () => {
		fetchData();
	};

	return {
		meetups,
		loading,
		error,
		setSearchQuery,
		setStartDate,
		setEndDate,
		applyFilters,
		searchParams
	};
};
