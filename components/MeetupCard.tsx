import React, { memo } from 'react';
import { Text, Image, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeColors } from '@/hooks/useThemeColors';
import { ThemedText } from '@/components/styleComponent/ThemedText';

interface MeetupCardProps {
	title: string;
	description: string;
	image: string;
	dateTime: string;
	to: string;
}

const MeetupCard = memo(
	({ title, description, image, dateTime, to }: MeetupCardProps) => {
		const router = useRouter();
		const { headerFooter, text, description: descriptionColor } = useThemeColors();

		const date = new Date(dateTime);
		const formattedDate = `${date.getUTCDate()}.${date.getUTCMonth() + 1}.${date.getUTCFullYear()}`;

		//Оно работает не трогай пока(to)
		return (
			<Pressable
				onPress={() => router.push(to)}
				style={[styles.card, { backgroundColor: headerFooter }]}
			>
				<Image source={{ uri: image }} style={styles.image} />
				<ThemedText style={[styles.title]}>{title}</ThemedText>
				<Text style={[styles.date, { color: descriptionColor }]}>
					{formattedDate}
				</Text>
				<Text style={[styles.description, { color: descriptionColor }]}>
					{description}
				</Text>
			</Pressable>
		);
	}
);

export default MeetupCard;

const styles = StyleSheet.create({
	card: {
		padding: 16,
		borderRadius: 8,
		width: '100%',
		marginBottom: 16,
		elevation: 3, // Тень для Android
		shadowColor: '#000', // Тень для iOS
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4
	},
	image: {
		height: 200,
		width: '100%',
		borderRadius: 8
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold',
		marginTop: 8
	},
	date: {
		fontSize: 14,
		marginTop: 4
	},
	description: {
		fontSize: 14,
		marginTop: 8
	}
});
