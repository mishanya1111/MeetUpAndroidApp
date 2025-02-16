import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

interface BackgroundViewProps {
	children: React.ReactNode;
}

export function BackgroundView({ children }: BackgroundViewProps) {
	const { background } = useThemeColors();

	return (
		<View style={[styles.container, { backgroundColor: background }]}>
			{children}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1, // Занимает весь экран
		width: '100%',
		height: '100%',
		padding: 20 // Отступы
	}
});
