// components/MeetupDetails.tsx
import React from 'react';
import {
	View,
	Text,
	Image,
	Button,
	Linking,
	StyleSheet,
	ScrollView
} from 'react-native';
import { useMeetupDetails } from '@/hooks/useMeetupDetails';
import { useRouter } from 'expo-router';
import { BackgroundView } from '@/components/styleComponent/BackgroundView';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAuth } from '@/context/AuthContext';
import { ThemedText } from '@/components/styleComponent/ThemedText';
import { SIGN_IN } from '@/constant/router';
import HeaderWithTitle from '@/components/headerWithTitle';
import Loader from '@/components/Loader';
import {LoginNeededContainer} from "@/components/LoginNeededContainer"; // Для иконки стрелочки назад

const MeetupDetails = () => {
	const { token } = useAuth(); // Достаём токен и userID из контекста
	const router = useRouter();
	const {
		handlePath,
		text,
		primaryLink,
		description: descriptionColor
	} = useThemeColors();
	// Если нет токена — показываем просьбу войти в систему
	const {
		meetup,
		loading,
		error,
		isFavorite,
		formattedDate,
		userID,
		handleSignForMeeting,
		handleUnsubscribe
	} = useMeetupDetails();
	if (!token) {
		return (
			<BackgroundView>
				<HeaderWithTitle title="Meetup details" />

				<LoginNeededContainer message="You need to log in to view meetup details." />
			</BackgroundView>
		);
	}

	if (loading) {
		return (
			<BackgroundView>
				<Loader />
			</BackgroundView>
		);
	}

	if (error) {
		return (
			<BackgroundView>
				<Text style={[styles.errorText, { color: text }]}>
					Error: {String(error)}
				</Text>
			</BackgroundView>
		);
	}

	return (
		<BackgroundView>
			<HeaderWithTitle title={meetup?.title || 'Meetup Details'} />

			<ScrollView contentContainerStyle={styles.container}>
				<Image
					source={meetup?.image ? { uri: meetup.image } : handlePath}
					style={styles.image}
				/>
				<Text style={[styles.title, { color: text }]}>
					{meetup?.title || 'Untitled Meetup'}
				</Text>
				<Text style={[styles.author, { color: descriptionColor }]}>
					Author: {meetup?.author || 'Unknown'}
				</Text>
				<Text
					style={[styles.link, { color: descriptionColor }]}
					onPress={() => meetup?.link && Linking.openURL(meetup.link)}
				>
					Link:{' '}
					<Text
						style={{ color: primaryLink }}
						onPress={() => meetup?.link && Linking.openURL(meetup.link)}
					>
						{meetup?.link || 'No link provided'}{' '}
					</Text>
				</Text>
				<Text style={[styles.date, { color: descriptionColor }]}>
					Date: {formattedDate}
				</Text>
				<Text style={[styles.signed, { color: descriptionColor }]}>
					Already signed: {meetup?.attendees_count || 0}
				</Text>

				<Text style={[styles.description, { color: text }]}>
					{meetup?.description || 'No description available.'}
				</Text>

				{userID === meetup?.author_id ? (
					<Button
						title="Edit Meetup"
						onPress={() => {
							//router.push(`/editMeetup/${meetup?.id})`
							console.log('router => Edit page');
						}}
					/>
				) : isFavorite !== null ? (
					isFavorite ? (
						<Button title="Unsubscribe" onPress={handleUnsubscribe} />
					) : (
						<Button title="Subscribe" onPress={handleSignForMeeting} />
					)
				) : (
					<Text style={{ color: descriptionColor }}>
						Loading subscription status...
					</Text>
				)}
			</ScrollView>
		</BackgroundView>
	);
};

const styles = StyleSheet.create({
	authContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	authText: {
		fontSize: 18,
		marginBottom: 12
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16
	},
	backButton: {
		marginRight: 8
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: 'bold'
	},
	container: {
		padding: 16
	},
	loader: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	image: {
		height: 200,
		width: '100%',
		borderRadius: 8,
		marginBottom: 16
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 8
	},
	author: {
		fontSize: 18,
		marginBottom: 8
	},
	link: {
		fontSize: 16,
		marginBottom: 8
	},
	date: {
		fontSize: 16,
		marginBottom: 8
	},
	signed: {
		fontSize: 16,
		marginBottom: 8
	},
	description: {
		fontSize: 16,
		marginTop: 8,
		marginBottom: 16
	},
	errorText: {
		textAlign: 'center',
		fontSize: 16
	}
});

export default MeetupDetails;
