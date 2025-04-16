import { Tabs } from 'expo-router';
import React from 'react';
import { Image, Platform, StyleSheet } from 'react-native';
import { HapticTab } from '@/components/InitComponent/HapticTab';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function TabLayout() {
	const { activeTabs, headerFooter, text } = useThemeColors();

	const styles = StyleSheet.create({
		icon: {
			width: 30,
			height: 30,
			resizeMode: 'contain',
			marginBottom: 3
		}
	});

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: activeTabs,
				headerShown: false,
				tabBarButton: HapticTab,
				tabBarStyle: {
					backgroundColor: headerFooter,
					borderTopWidth: 0,
					height: Platform.OS === 'ios' ? 70 : 52,
					paddingBottom: Platform.OS === 'ios' ? 25 : 10
				},
				tabBarLabelStyle: {
					color: text,
					fontSize: 9.5
				}
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
							style={styles.icon}
						/>
					)
				}}
			/>
		</Tabs>
	);
}
