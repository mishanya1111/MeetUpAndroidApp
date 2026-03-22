import { useState, useEffect, useCallback } from 'react';
import { MEETUP } from '@/constant/router';
import { useMeetupUpdate } from '@/context/MeetupUpdateContext';
import axios from 'axios';
import { GPT_URL, USER_API_URL } from '@/constant/apiURL';
import { useAuth } from '@/context/AuthContext';
import { giveConfig } from '@/utils/giveConfig';
import { Alert } from 'react-native';

export interface Tag {
	id: number;
	name: string;
	slug: string;
	color: string;
}

interface Meetup {
	id: number;
	title: string;
	description: string;
	image: string;
	dateTime: string;
	to: string;
	duration?: number;
	tags?: Tag[];
}

interface SearchParams {
	query: string;
	startDate: string | null;
	endDate: string | null;
	isOnline: boolean | null;
	tagIds: number[];
}

export const useMeetups = (
	fetchFunction: (params: URLSearchParams) => Promise<any>
) => {
	const { token, userID } = useAuth();
	const [meetups, setMeetups] = useState<Meetup[]>([]);
	const [serverMeetups, setServerMeetups] = useState<Meetup[]>([]);
	const [searchParams, setSearchParams] = useState<SearchParams>({
		query: '',
		startDate: null,
		endDate: null,
		isOnline: null,
		tagIds: []
	});
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const { shouldRefetch } = useMeetupUpdate();

	const toStartDateTime = (date: string) => `${date}T00:00:00Z`;
	const toEndDateTime = (date: string) => `${date}T23:59:59Z`;

	const mapResultsToMeetups = (results: any[]): Meetup[] =>
		results.map((item: any) => ({
			id: item.id,
			title: item.title,
			description: item.description,
			image: item.image || '',
			dateTime: item.datetime_beg,
			to: `${MEETUP}/${item.id}`,
			duration: item.duration,
			tags: item.tags
		}));

	const fetchData = useCallback(async () => {
		setLoading(true);
		setError(null);

		const params = new URLSearchParams();
		params.set('page_size', '50');
		if (searchParams.query) params.set('search', searchParams.query);
		if (searchParams.startDate)
			params.set('datetime_beg__gt', toStartDateTime(searchParams.startDate));
		if (searchParams.endDate)
			params.set('datetime_beg__lt', toEndDateTime(searchParams.endDate));
		if (searchParams.isOnline !== null)
			params.set('is_online', searchParams.isOnline ? 'true' : 'false');
		searchParams.tagIds.forEach(id => params.append('tags', String(id)));

		try {
			const data = await fetchFunction(params);
			if (data?.results) {
				const mapped = mapResultsToMeetups(data.results);
				setServerMeetups(mapped);
				setMeetups(mapped);
			}
		} catch (err) {
			setError((err as Error).message || 'Something went wrong');
		} finally {
			setLoading(false);
		}
	}, [fetchFunction, searchParams]);

	useEffect(() => {
		fetchData();
	}, [fetchData, shouldRefetch]);

	const setSearchQuery = (query: string) => {
		setSearchParams(prev => ({ ...prev, query }));
	};

	const setStartDate = (date: string | null) => {
		setSearchParams(prev => ({ ...prev, startDate: date }));
	};

	const setEndDate = (date: string | null) => {
		setSearchParams(prev => ({ ...prev, endDate: date }));
	};

	const setIsOnline = (isOnline: boolean | null) => {
		setSearchParams(prev => ({ ...prev, isOnline }));
	};

	const setTagIds = (tagIds: number[]) => {
		setSearchParams(prev => ({ ...prev, tagIds }));
	};

	const applyFilters = () => {
		fetchData();
	};

	const extractIdsFromAi = (
		message: string
	): { type: 'success'; ids: number[] } | { type: 'fail' } | { type: 'unknown' } => {
		const normalized = String(message || '').trim().replace(/^"+|"+$/g, '');
		if (!normalized) return { type: 'unknown' };
		if (/^fail\b/i.test(normalized)) return { type: 'fail' };
		if (!/^success\b/i.test(normalized)) return { type: 'unknown' };

		const match = normalized.match(/\[.*?\]/);
		if (match?.[0]) {
			try {
				const parsed = JSON.parse(match[0]);
				if (Array.isArray(parsed)) {
					return {
						type: 'success',
						ids: parsed.map(n => Number(n)).filter(n => Number.isFinite(n))
					};
				}
			} catch {}
		}

		const nums = normalized.match(/\d+/g);
		if (!nums?.length) return { type: 'unknown' };
		return {
			type: 'success',
			ids: nums.map(n => Number(n)).filter(n => Number.isFinite(n))
		};
	};

	const normalizeText = (s: string) =>
		String(s || '')
			.toLowerCase()
			.replace(/ё/g, 'е')
			.replace(/[^0-9a-zа-я\s]+/gi, ' ')
			.replace(/\s+/g, ' ')
			.trim();

	const tokenizeQuery = (s: string) =>
		normalizeText(s)
			.split(' ')
			.filter(t => t.length >= 3);

	const expandQueryTokens = (tokens: string[]) => {
		const expanded = new Set(tokens);
		const joined = tokens.join(' ');
		if (joined.includes('робот')) {
			expanded.add('robot');
			expanded.add('robotics');
		}
		if (joined.includes('мед') || joined.includes('медиц') || joined.includes('здоров')) {
			expanded.add('medical');
			expanded.add('medicine');
			expanded.add('health');
			expanded.add('healthcare');
			expanded.add('clinic');
			expanded.add('doctor');
		}
		if (joined.includes('кино') || joined.includes('фильм') || joined.includes('киноклуб')) {
			expanded.add('cinema');
			expanded.add('film');
			expanded.add('movie');
		}
		if (joined.includes('книга') || joined.includes('литератур')) {
			expanded.add('book');
			expanded.add('literature');
			expanded.add('reading');
		}
		return Array.from(expanded);
	};

	const filterMeetupsByQueryTokens = (meetupsToFilter: Meetup[], rawQuery: string) => {
		const tokens = expandQueryTokens(tokenizeQuery(rawQuery));
		if (!tokens.length) return meetupsToFilter;
		return meetupsToFilter.filter(m => {
			const hay = normalizeText(`${m.title} ${m.description}`);
			return tokens.some(t => hay.includes(t));
		});
	};

	const fallbackLocalSearch = (query: string, sourceMeetups: Meetup[] = serverMeetups) => {
		const q = normalizeText(query);
		if (!q) return sourceMeetups;
		const tokens = q.split(' ').filter(t => t.length >= 2);
		const expandedTokens = expandQueryTokens(tokenizeQuery(query));
		return sourceMeetups.filter(m => {
			const hay = normalizeText(`${m.title} ${m.description}`);
			if (hay.includes(q)) return true;
			if (expandedTokens.some(t => hay.includes(t))) return true;
			return tokens.some(t => hay.includes(t));
		});
	};

	const runAiSearch = useCallback(
		async (query: string) => {
			if (!query.trim()) {
				setMeetups(serverMeetups);
				return;
			}

			setLoading(true);
			setError(null);
			try {
				const paramsForAi = new URLSearchParams();
				paramsForAi.set('page_size', '200');
				if (searchParams.startDate)
					paramsForAi.set(
						'datetime_beg__gt',
						toStartDateTime(searchParams.startDate)
					);
				if (searchParams.endDate)
					paramsForAi.set(
						'datetime_beg__lt',
						toEndDateTime(searchParams.endDate)
					);
				if (searchParams.isOnline !== null)
					paramsForAi.set('is_online', searchParams.isOnline ? 'true' : 'false');
				searchParams.tagIds.forEach(id => paramsForAi.append('tags', String(id)));

				const aiData = await fetchFunction(paramsForAi);
				const aiMeetups: Meetup[] = Array.isArray(aiData?.results)
					? mapResultsToMeetups(aiData.results)
					: serverMeetups;

				const formattedMeetups = JSON.stringify(
					aiMeetups.map(m => ({
						id: m.id,
						title: m.title,
						description: m.description
					}))
				);
				const normalize = (s: string) =>
					String(s || '')
						.toLowerCase()
						.replace(/ё/g, 'е')
						.replace(/[^0-9a-zа-я\s]+/gi, ' ')
						.replace(/\s+/g, ' ')
						.trim();
				const hintTokens = Array.from(
					new Set(
						normalize(query)
							.split(' ')
							.filter(t => t.length >= 3)
							.flatMap(t => {
								if (t.includes('робот')) return [t, 'robot', 'robotics'];
								if (t.includes('мед') || t.includes('медиц') || t.includes('здоров'))
									return [
										t,
										'medical',
										'medicine',
										'health',
										'healthcare',
										'clinic',
										'doctor'
									];
								if (t.includes('кино') || t.includes('фильм') || t.includes('киноклуб'))
									return [t, 'cinema', 'film', 'movie'];
								return [t];
							})
					)
				)
					.slice(0, 12)
					.join(', ');

				const gptPrompt = `Ты — строгий фильтр релевантности для поиска митапов.
Поисковый запрос: "${query}"
Подсказка ключевых слов темы: ${hintTokens || '(нет)'}

Список митапов в JSON (id,title,description): ${formattedMeetups}

Правила:
1) Включай митап ТОЛЬКО если он явно про тему запроса. Косвенные/случайные совпадения исключай.
2) Если запрос про медицину — не включай киноклуб/книги и т.п. Если запрос про робототехнику — не включай просто "machine learning" без роботов.
3) Учитывай RU/EN перевод и синонимы, но если сомневаешься — НЕ включай.
4) Верни максимум 7 id. Если ничего не подходит — верни пустой массив.

Формат ответа строго одной строкой: Success, id:[1,2,3]`;

				const gptResponse = await axios.post(
					`${GPT_URL}/chatgpt`,
					{ message: gptPrompt },
					{ headers: { 'Content-Type': 'application/json' } }
				);

				const gptMessage: string =
					gptResponse.data?.choices?.[0]?.message?.content || '';

				const parsed = extractIdsFromAi(gptMessage);
				if (parsed.type === 'unknown') {
					const fallback = fallbackLocalSearch(query, aiMeetups);
					if (!fallback.length) {
						Alert.alert('AI Search', 'Nothing was found for this query.');
					}
					setMeetups(fallback);
					return;
				}
				if (parsed.type === 'fail' || parsed.ids.length === 0) {
					const fallback = fallbackLocalSearch(query, aiMeetups);
					if (!fallback.length) {
						Alert.alert('AI Search', 'Nothing was found for this query.');
					}
					setMeetups(fallback);
					return;
				}
				const next = aiMeetups.filter(m => parsed.ids.includes(m.id));
				if (!next.length) {
					const fallback = fallbackLocalSearch(query, aiMeetups);
					if (!fallback.length) {
						Alert.alert('AI Search', 'Nothing was found for this query.');
					}
					setMeetups(fallback);
					return;
				}
				const strictNext = filterMeetupsByQueryTokens(next, query);
				if (!strictNext.length) {
					setMeetups(next);
					return;
				}
				setMeetups(strictNext);
			} catch (e: any) {
				Alert.alert(
					'AI Search',
					e?.message || 'AI service is currently unavailable.'
				);
			} finally {
				setLoading(false);
			}
		},
		[
			fetchFunction,
			searchParams,
			serverMeetups,
			fallbackLocalSearch,
			filterMeetupsByQueryTokens
		]
	);

	const runAiRecommend = useCallback(async () => {
		if (!userID) {
			Alert.alert('AI Recommend', 'Please log in to get recommendations.');
			return;
		}

		setLoading(true);
		setError(null);
		try {
			const profileResponse = await axios.get(
				`${USER_API_URL}${userID}/`,
				token ? giveConfig(token) : undefined
			);
			const userDescription: string = profileResponse.data?.user_description || '';
			if (!userDescription.trim()) {
				Alert.alert(
					'AI Recommend',
					'Please fill in "About Me" in your profile to get recommendations.'
				);
				return;
			}

			const formattedMeetups = JSON.stringify(
				serverMeetups.map(m => ({
					id: m.id,
					title: m.title,
					description: m.description
				}))
			);
			const gptPrompt = `Тебе дано описание интересов пользователя: ${userDescription}. И список существующих митапов в формате ${formattedMeetups}. Твоя задача: подумать, какие митапы, исходя из их описания, были бы интересны пользователю, и дать мне ответ строго в таком формате \"Success, id:[массив из id, которые ты считаешь, были бы интересны пользователю]\" Если ты не смог найти ничего подходящего, возвращаешь мне строго такой ответ: \"Fail, 'nothing interesting was found'\"`;

			const gptResponse = await axios.post(
				`${GPT_URL}/chatgpt`,
				{ message: gptPrompt },
				{ headers: { 'Content-Type': 'application/json' } }
			);

			const gptMessage: string =
				gptResponse.data?.choices?.[0]?.message?.content || '';

			const parsed = extractIdsFromAi(gptMessage);
			if (parsed.type !== 'success' || parsed.ids.length === 0) {
				Alert.alert('AI Recommend', 'No recommendations were found.');
				setMeetups([]);
				return;
			}
			const next = serverMeetups.filter(m => parsed.ids.includes(m.id));
			if (!next.length) {
				Alert.alert('AI Recommend', 'No recommendations were found.');
			}
			setMeetups(next);
		} catch (e: any) {
			Alert.alert(
				'AI Recommend',
				e?.message || 'AI service is currently unavailable.'
			);
		} finally {
			setLoading(false);
		}
	}, [serverMeetups, token, userID]);

	return {
		meetups,
		serverMeetups,
		loading,
		error,
		setSearchQuery,
		setStartDate,
		setEndDate,
		setIsOnline,
		setTagIds,
		applyFilters,
		runAiSearch,
		runAiRecommend,
		searchParams
	};
};
