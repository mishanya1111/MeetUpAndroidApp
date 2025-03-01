import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
	token: { refresh: string; access: string } | null;
	userID: number | null;
	name: string | null;
	saveToken: (newToken: { refresh: string; access: string }) => void;
	removeToken: () => void;
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
			setLoading(false);
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

	useEffect(() => {
		const loadAuthData = async () => {
			try {
				const savedToken = await AsyncStorage.getItem('authToken');
				const savedName = await AsyncStorage.getItem('name');
				const savedID = await AsyncStorage.getItem('ID');

				if (savedToken) setToken(JSON.parse(savedToken));
				if (savedName) setName(savedName);
				if (savedID) setUserID(Number(savedID));
			} catch (error) {
				console.error('Failed to load auth data:', error);
			} finally {
				setLoading(false);
			}
		};
		loadAuthData();
	}, []);

	return (
		<AuthContext.Provider
			value={{ token, userID, name, saveToken, removeToken, saveDate, loading }}
		>
			{!loading && children}
		</AuthContext.Provider>
	);
};
