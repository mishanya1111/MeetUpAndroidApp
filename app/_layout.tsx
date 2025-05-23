import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { MeetupUpdateProvider } from '@/context/MeetupUpdateContext';

// Отключаем авто-скрытие SplashScreen, пока ресурсы загружаются
SplashScreen.preventAutoHideAsync();

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
		<MeetupUpdateProvider>
			<ThemeProvider>
				<AuthProvider>
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

						<Stack.Screen name="+not-found" />
					</Stack>
					<StatusBar style="auto" />
				</AuthProvider>
			</ThemeProvider>
		</MeetupUpdateProvider>
	);
}
