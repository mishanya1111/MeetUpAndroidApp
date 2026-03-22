import React, { memo } from 'react';
import { Text, Image, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeColors } from '@/hooks/useThemeColors';
import { ThemedText } from '@/components/styleComponent/ThemedText';
import type { Tag } from '@/components/DataLoader/useMeetups';

function getReadableTextColor(hexColor?: string) {
	if (!hexColor || typeof hexColor !== 'string') return '#fff';
	const cleaned = hexColor.replace('#', '');
	if (!/^[0-9a-fA-F]{6}$/.test(cleaned)) return '#fff';
	const r = parseInt(cleaned.slice(0, 2), 16);
	const g = parseInt(cleaned.slice(2, 4), 16);
	const b = parseInt(cleaned.slice(4, 6), 16);
	const brightness = (r * 299 + g * 587 + b * 114) / 1000;
	return brightness >= 150 ? '#111' : '#fff';
}

interface MeetupCardProps {
	title: string;
	description: string;
	image: string;
	dateTime: string;
	to: string;
	duration?: number;
	tags?: Tag[];
}

const MeetupCard = memo(
	({ title, description, image, dateTime, to, duration, tags }: MeetupCardProps) => {
		const router = useRouter();
		const { handlePath } = useThemeColors();
		const { headerFooter, description: descriptionColor } = useThemeColors();
		const handleImage = image ? { uri: image } : handlePath;
		const date = new Date(dateTime);
		const formattedDate = `${date.getUTCDate()}.${date.getUTCMonth() + 1}.${date.getUTCFullYear()}`;
		const tagChips =
			Array.isArray(tags) && tags.length
				? tags.slice(0, 3).map(tag => (
						<View
							key={tag.id}
							style={[
								styles.tagChip,
								{ backgroundColor: tag.color || '#3a6ff7' }
							]}
						>
							<Text style={[styles.tagChipText, { color: getReadableTextColor(tag.color) }]}>
								{tag.name}
							</Text>
						</View>
					))
				: null;
		//Оно работает не трогай пока (to)
		return (
			<Pressable
				onPress={() => router.push(to as any)}
				style={[styles.card, { backgroundColor: headerFooter }]}
			>
				<Image source={handleImage} style={styles.image} />
				<ThemedText style={[styles.title]}>{title}</ThemedText>
				<Text style={[styles.date, { color: descriptionColor }]}>
					{formattedDate}
				</Text>
				<View style={styles.metaRow}>
					{typeof duration === 'number' ? (
						<Text style={[styles.metaText, { color: descriptionColor }]}>
							{Math.round(duration)} h
						</Text>
					) : null}
					{tagChips}
				</View>
				<Text style={[styles.description, { color: descriptionColor }]}>
					{description}
				</Text>
			</Pressable>
		);
	}
);

MeetupCard.displayName = 'MeetupCard';

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
	metaRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 10,
		marginTop: 6
	},
	metaText: {
		fontSize: 12
	},
	tagChip: {
		borderRadius: 999,
		paddingVertical: 2,
		paddingHorizontal: 8
	},
	tagChipText: {
		fontSize: 12
	},
	description: {
		fontSize: 14,
		marginTop: 8
	}
});
