// useMeetups.ts
import { useState, useEffect } from 'react';

interface Meetup {
	id: number;
	title: string;
	description: string;
	image: string;
	dateTime: string;
	to: string;
}

interface DateFilter {
	startDate: string;
	endDate: string;
}

export const useMeetups = (
	fetchFunction: (params: Record<string, string>) => Promise<any>
) => {
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [dateFilter, setDateFilter] = useState<DateFilter>({
		startDate: '',
		endDate: ''
	});
	const [meetups, setMeetups] = useState<Meetup[]>([]);
	const [searchParams, setSearchParams] = useState({
		query: '',
		startDate: '',
		endDate: ''
	});
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			setError(null);

			const params: Record<string, string> = {
				page_size: '12',
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
							to: 'index'
						}))
					);
				}
			} catch (err) {
				setError((err as Error).message || 'Something went wrong');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [searchParams, fetchFunction]);

	const handleSearchChange = (query: string) => {
		setSearchQuery(query);
	};

	const handleDateFilter = (startDate: string, endDate: string) => {
		setDateFilter({ startDate, endDate });
	};

	const applyFilters = () => {
		setSearchParams({
			query: searchQuery,
			startDate: dateFilter.startDate,
			endDate: dateFilter.endDate
		});
	};

	return {
		meetups,
		loading,
		error,
		handleSearchChange,
		handleDateFilter,
		applyFilters
	};
};
