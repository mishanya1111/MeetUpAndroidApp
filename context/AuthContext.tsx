import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Если первый вариант не работает
import { REFRESH_URL } from '@/constant/apiURL';

interface AuthContextType {
	token: { refresh: string; access: string } | null;
	userID: number | null;
	name: string | null;
	saveToken: (newToken: { refresh: string; access: string }) => void;
	removeToken: () => void;
	refreshAccessToken: () => Promise<string | null>;
	saveDate: (newDate: {
		refresh: string;
		access: string;
		username: string;
		user_id: number;
	}) => void;
	loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children
}) => {
	const [token, setToken] = useState<{ refresh: string; access: string } | null>(
		null
	);
	const [name, setName] = useState<string | null>(null);
	const [userID, setUserID] = useState<number | null>(null);
	const [loading, setLoading] = useState(true);

	const saveToken = useCallback(
		async (newToken: { refresh: string; access: string }) => {
			setToken(newToken);
			await AsyncStorage.setItem('authToken', JSON.stringify(newToken));
		},
		[]
	);

	const saveName = useCallback(async (newName: string) => {
		setName(newName);
		await AsyncStorage.setItem('name', newName);
	}, []);

	const saveId = useCallback(async (newID: number) => {
		setUserID(newID);
		await AsyncStorage.setItem('ID', JSON.stringify(newID));
	}, []);

	const saveDate = useCallback(
		async (newDate: {
			refresh: string;
			access: string;
			username: string;
			user_id: number;
		}) => {
			await saveToken({ refresh: newDate.refresh, access: newDate.access });
			await saveName(newDate.username);
			await saveId(newDate.user_id);
		},
		[saveToken, saveName, saveId]
	);

	const removeToken = useCallback(async () => {
		setToken(null);
		setUserID(null);
		setName(null);
		await AsyncStorage.removeItem('authToken');
		await AsyncStorage.removeItem('name');
		await AsyncStorage.removeItem('ID');
	}, []);

	// Функция декодирования JWT и проверки срока действия
	const isAccessTokenExpired = (accessToken: string): boolean => {
		try {
			const decoded: { exp: number } = jwtDecode(accessToken);
			const now = Math.floor(Date.now() / 1000); // Текущее время в секундах
			return decoded.exp < now; // Если `exp` меньше текущего времени — токен истёк
		} catch (error) {
			console.error('Ошибка при декодировании accessToken:', error);
			return true; // Если не удалось декодировать — считаем токен недействительным
		}
	};

	const refreshAccessToken = useCallback(async () => {
		if (!token?.refresh) {
			await removeToken();
			return null;
		}

		try {
			const response = await axios.post(REFRESH_URL, { refresh: token.refresh });
			const newAccessToken = response.data.access;

			// Обновляем только accessToken, refreshToken остаётся прежним
			const updatedToken = { refresh: token.refresh, access: newAccessToken };
			await saveToken(updatedToken);

			return newAccessToken;
		} catch (error) {
			console.error('Ошибка обновления токена:', error);
			await removeToken();
			return null;
		}
	}, [token, saveToken, removeToken]);

	// Проверяем токен при загрузке приложения
	useEffect(() => {
		const loadAuthData = async () => {
			try {
				const savedToken = await AsyncStorage.getItem('authToken');
				const savedName = await AsyncStorage.getItem('name');
				const savedID = await AsyncStorage.getItem('ID');

				if (savedToken) {
					const parsedToken = JSON.parse(savedToken);

					if (isAccessTokenExpired(parsedToken.access)) {
						// Если токен просрочен — обновляем
						const newAccessToken = await refreshAccessToken();
						if (newAccessToken) {
							parsedToken.access = newAccessToken;
							await saveToken(parsedToken);
						} else {
							// Если обновить не удалось — разлогиниваем
							await removeToken();
						}
					} else {
						// Если токен ещё валиден, просто загружаем его
						setToken(parsedToken);
					}
				}

				if (savedName) setName(savedName);
				if (savedID) setUserID(Number(savedID));
			} catch (error) {
				console.error('Ошибка при загрузке данных авторизации:', error);
			} finally {
				setLoading(false);
			}
		};

		loadAuthData();
	}, [refreshAccessToken, saveToken, removeToken]);

	return (
		<AuthContext.Provider
			value={{
				token,
				userID,
				name,
				saveToken,
				removeToken,
				saveDate,
				loading,
				refreshAccessToken
			}}
		>
			{!loading && children}
		</AuthContext.Provider>
	);
};
