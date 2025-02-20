import React from 'react';
import { View, Text, ActivityIndicator, FlatList, Button, StyleSheet } from 'react-native';
import { useUserMeetups } from '@/hooks/useUserMeetups';
import FilterBar from '@/components/FilterBar';
import MeetupCard from '@/components/MeetupCard';
import { BackgroundView } from '@/components/styleComponent/BackgroundView';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';
import { useAuth } from '@/context/AuthContext'; // Контекст для токена

export default function MyMeetups() {
	const { token } = useAuth(); // Достаём токен из контекста
	const {
		meetups,
		loading,
		error,
		handleSearchChange,
		handleDateFilter
	} = useUserMeetups('meetings_owned');

	if (!token) {
		return (
			<BackgroundView>
				<View style={styles.authContainer}>
					<Text style={styles.authText}>Please log in to view your meetups.</Text>
					<Button title="Log In" onPress={() => console.log('Navigate to login')} />
				</View>
			</BackgroundView>
		);
	}

	return (
		<BackgroundView>
			<View style={styles.container}>
				<FilterBar onSearchChange={handleSearchChange} onDateFilter={handleDateFilter} />
				{loading ? (
					<ActivityIndicator size="large" style={styles.loader} />
				) : error ? (
					<Text style={styles.errorText}>Error: {error}</Text>
				) : meetups.length > 0 ? (
					<FlatList
						data={meetups}
						keyExtractor={item => item.id.toString()}
						renderItem={({ item }) => <MeetupCard {...item} />}
					/>
				) : (
					<Text style={styles.emptyText}>No meetups found.</Text>
				)}
			</View>
			<ThemeToggleButton />
		</BackgroundView>
	);
}

const styles = StyleSheet.create({
	container: { padding: 16 },
	loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
	errorText: { textAlign: 'center', color: 'red', fontSize: 16 },
	emptyText: { textAlign: 'center', fontSize: 16 },
	authContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
	authText: { fontSize: 18, marginBottom: 12 }
});
