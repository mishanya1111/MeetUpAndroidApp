
// useMeetups.ts
import { useState, useEffect, useCallback } from 'react';
import { MEETINGS_API_URL } from '@/constant/apiURL';

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

export const useMeetups = (fetchFunction: (url: string) => Promise<any>) => {
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

    const buildApiUrl = useCallback((): string => {
        let url = `${MEETINGS_API_URL}?page_size=12`;
        if (searchParams.query) url += `&search=${searchParams.query}`;
        if (searchParams.startDate) url += `&datetime_beg__gt=${searchParams.startDate}`;
        if (searchParams.endDate) url += `&datetime_beg__lt=${searchParams.endDate}`;
        return url;
    }, [searchParams]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchFunction(buildApiUrl());
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
    }, [buildApiUrl, fetchFunction]);

    const handleSearchChange = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    const handleDateFilter = useCallback((startDate: string, endDate: string) => {
        setDateFilter({ startDate, endDate });
    }, []);

    const applyFilters = useCallback(() => {
        setSearchParams({
            query: searchQuery,
            startDate: dateFilter.startDate,
            endDate: dateFilter.endDate
        });
    }, [searchQuery, dateFilter]);

    return {
        meetups,
        loading,
        error,
        handleSearchChange,
        handleDateFilter,
        applyFilters
    };
};
