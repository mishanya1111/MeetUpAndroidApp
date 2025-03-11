import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useRouter } from 'expo-router';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';

const HeaderWithTitle = ({ title }: { title: string }) => {
	const router = useRouter();
	const { text } = useThemeColors();

	return (
		<View style={styles.header}>
			<TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
				<Ionicons name="arrow-back" size={24} color={text} />
			</TouchableOpacity>
			<Text style={[styles.headerTitle, { color: text }]}>{title}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
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
	}
});

export default HeaderWithTitle;
