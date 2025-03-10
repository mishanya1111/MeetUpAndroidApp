import { Tabs } from 'expo-router';
import React from 'react';
import { Image, Platform, StyleSheet } from 'react-native';
import { HapticTab } from '@/components/InitComponent/HapticTab';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function TabLayout() {
	console.log('Rendering TabLayout...');

	const { activeTabs, headerFooter, text } = useThemeColors();

	const styles = StyleSheet.create({
		icon: {
			width: 28,
			height: 28,
			resizeMode: 'contain'
		},
		avatar: {
			width: 32,
			height: 32,
			borderRadius: 16, // Делаем круглый аватар
			borderWidth: 2,
			borderColor: '#fff'
		}
	});

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: activeTabs,
				headerShown: false,
				tabBarButton: HapticTab,
				//tabBarBackground: TabBarBackground,
				tabBarStyle: Platform.select({
					ios: {
						// Use a transparent background on iOS to show the blur effect
						position: 'absolute'
					},
					default: { backgroundColor: headerFooter }
				}),
				//tabBarStyle: {  },//..оно работает, не трогай, если сможешь оставить цвет и убрать ошибку то норм
				tabBarLabelStyle: {
					color: text,
					fontSize: 9
				}
				//headerStyle: { backgroundColor: 'black' },
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Home',
					tabBarIcon: () => (
						<Image source={require('@/assets/icons/find.png')} style={styles.icon} />
					)
				}}
			/>
			<Tabs.Screen
				name="myMeetupsOwned"
				options={{
					title: 'Owned Meetups',
					tabBarIcon: () => (
						<Image
							source={require('@/assets/icons/favorite.png')}
							style={styles.icon}
						/>
					)
				}}
			/>
			<Tabs.Screen
				name="myMeetupsSubscriber"
				options={{
					title: 'Subscribed Meetups',
					tabBarIcon: () => (
						<Image
							source={require('@/assets/icons/favorite.png')}
							style={styles.icon}
						/>
					)
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: 'Profile',
					tabBarIcon: () => (
						<Image
							source={require('@/assets/icons/profile.png')}
							style={styles.avatar}
						/>
					)
				}}
			/>

		</Tabs>
	);
}
