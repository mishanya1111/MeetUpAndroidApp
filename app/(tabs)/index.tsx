import { ScrollView, StyleSheet } from 'react-native';

import { ThemeToggleButton } from '@/components/ThemeToggleButton';
import { BackgroundView } from '@/components/styleComponent/BackgroundView';
import MeetupCard from '@/components/MeetupCard';
import React from 'react';

interface HomeScreenProps {
	navigation: React.ReactNode;
}
export default function HomeScreen({ navigation }: HomeScreenProps) {
	const styles = StyleSheet.create({
		titleContainer: {
			padding: 20
		},
		container: {
			padding: 16
		}
	});

	//FlatList
	return (
		<BackgroundView>
			{/*<ThemedText style={[styles.titleContainer]}> mihail</ThemedText>
      <ThemedText style={[styles.titleContainer]}> mihail2</ThemedText>
      <ThemedText style={[styles.titleContainer]}> mihail3</ThemedText>*/}
			<ScrollView contentContainerStyle={styles.container}>
				<MeetupCard
					title="Expo & React Navigation"
					description="Разбираем Expo и маршрутизацию"
					image="https://source.unsplash.com/400x300/?coding"
					dateTime="2025-03-20T17:30:00Z"
					to="explore"
				/>
				<MeetupCard
					title="React Native Meetup"
					description="Обсуждаем новые фичи React Native"
					image="https://source.unsplash.com/400x300/?technology"
					dateTime="2025-03-15T18:00:00Z"
					to="index"
				/>
				<MeetupCard
					title="React Native Meetup 2"
					description="Обсуждаем новые фичи React Native 2"
					image="https://source.unsplash.com/400x300/?technology"
					dateTime="2025-03-15T18:00:00Z"
					to="profile"
				/>
			</ScrollView>
			<ThemeToggleButton />
		</BackgroundView>
	);
}
