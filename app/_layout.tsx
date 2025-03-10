import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import {View} from "react-native";
import { useThemeColors } from '@/hooks/useThemeColors';

// Отключаем авто-скрытие SplashScreen, пока ресурсы загружаются
SplashScreen.preventAutoHideAsync();

function AppContent() {
	const { background } = useThemeColors();

	return (
		<View style={{ flex: 1, backgroundColor: background, paddingTop: 40 }}>
			<Stack>
				<Stack.Screen
					name="(tabs)"
					options={{
						headerShown: false
					}}
				/>
				<Stack.Screen
					name="(auth)"
					options={{
						headerShown: false
					}}
				/>
				<Stack.Screen name="CreateMeetup" options={{ headerShown: false }} />
				<Stack.Screen name="+not-found" />
			</Stack>
			<StatusBar style="auto" />
		</View>
	);
}

export default function RootLayout() {
	const [loaded] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf')
	});

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<ThemeProvider>
			<AuthProvider>
				<AppContent />
			</AuthProvider>
		</ThemeProvider>
	);
}
