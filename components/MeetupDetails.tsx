// components/MeetupDetails.tsx
import React from 'react';
import {
	View,
	Text,
	Image,
	Linking,
	StyleSheet,
	ScrollView, TouchableOpacity, Alert
} from 'react-native';
import { useMeetupDetails } from '@/hooks/useMeetupDetails';
import { useRouter } from 'expo-router';
import { BackgroundView } from '@/components/styleComponent/BackgroundView';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAuth } from '@/context/AuthContext';
import HeaderWithTitle from '@/components/headerWithTitle';
import Loader from '@/components/Loader';
import {LoginNeededContainer} from "@/components/LoginNeededContainer";
import axios from "axios";
import {MEETINGS_API_URL} from "@/constant/apiURL";
import {giveConfig} from "@/utils/giveConfig";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const MeetupDetails = () => {
	const { token } = useAuth();
	const router = useRouter();
	const {
		handlePath,
		text,
		primaryLink,
		description: descriptionColor
	} = useThemeColors();
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
				<Loader topOffset="0%"/>
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

	const handleOpenAuthorProfile = () => {
		if (meetup?.author_id === userID) {
			router.push('/(tabs)/profile');
		} else {
			router.push(`/profile/${meetup?.author_id}`);
		}
	};

	const handleDeleteMeetup = () => {
		Alert.alert(
			'Confirm Deletion',
			'Are you sure you want to delete this meetup?',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: async () => {
						try {
							await axios.delete(`${MEETINGS_API_URL}${meetup.id}/`, giveConfig(token));
							router.replace('/myMeetupsOwned');
						} catch (err) {
							console.error('Failed to delete meetup:', err);
						}
					}
				}
			]
		);
	};

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

				<View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
					<Text style={[styles.author, { color: descriptionColor }]}>Author: </Text>

					<TouchableOpacity onPress={handleOpenAuthorProfile}>
						<Text style={[styles.author, { color: primaryLink }]}>{meetup?.author || 'Unknown'}</Text>
					</TouchableOpacity>
				</View>


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
					<View>
						<TouchableOpacity style={[styles.button, styles.editButton]}
										  onPress={() => {
											  router.push(`/edit-meetup/${meetup?.id}`);
										  }}>
							<Text style={styles.buttonText}>Edit Meetup</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.button, styles.unsubscribeButton]}
							onPress={handleDeleteMeetup}
						>
							<Text style={styles.buttonText}>Delete Meetup</Text>
						</TouchableOpacity>

					</View>
					) : isFavorite !== null ? (
					isFavorite ? (
						<TouchableOpacity style={[styles.button, styles.unsubscribeButton]}
										  onPress={handleUnsubscribe}>
							<Text style={styles.buttonText}>Unsubscribe</Text>
						</TouchableOpacity>
					) : (
						<TouchableOpacity style={[styles.button, styles.subscribeButton]}
										  onPress={handleSignForMeeting}>
							<Text style={styles.buttonText}>Subscribe</Text>
						</TouchableOpacity>
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
	},
	button: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 8,
		alignItems: 'center',
		marginVertical: 10
	},
	editButton: {
		backgroundColor: '#1c8139'
	},
	subscribeButton: {
		backgroundColor: '#007BFF'
	},
	unsubscribeButton: {
		backgroundColor: '#FF4500'
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold'
	}
});

export default MeetupDetails;
