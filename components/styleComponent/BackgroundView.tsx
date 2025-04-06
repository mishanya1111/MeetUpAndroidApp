import React from 'react';
import { View, StyleSheet, Platform, StatusBar, SafeAreaView } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

interface BackgroundViewProps {
	children: React.ReactNode;
}

export function BackgroundView({ children }: BackgroundViewProps) {
	const { background } = useThemeColors();

	// Стиль с учетом StatusBar
	const containerStyle = [
		styles.container,
		{ backgroundColor: background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }
	];

	// SafeAreaView для iOS
	if (Platform.OS === 'ios') {
		return (
			<SafeAreaView style={containerStyle}>
				{children}
			</SafeAreaView>
		);
	}

	return (
		<View style={containerStyle}>
			{children}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		height: '100%',
		paddingHorizontal: 20
	}
});
