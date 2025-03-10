import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export function ThemeToggleButton() {
	const { theme, toggleTheme } = useTheme();
	const isDarkMode = theme === 'dark';

	// Анимация движения шарика
	const translateX = useRef(new Animated.Value(isDarkMode ? 24 : 0)).current;

	useEffect(() => {
		Animated.timing(translateX, {
			toValue: isDarkMode ? 30 : 0,
			duration: 300,
			useNativeDriver: false,
		}).start();
	}, [isDarkMode]);

	return (
		<TouchableOpacity
			style={[
				styles.switch,
				{ backgroundColor: isDarkMode ? '#4CAF50' : '#CCCCCC' }
			]}
			onPress={toggleTheme}
		>
			{/* Луна 🌜 слева в темной теме */}
			<View style={styles.icon}>
				{isDarkMode ? <Text>🌜</Text> : null}
			</View>
			{/* Двигающийся белый круг */}
			<Animated.View style={[styles.circle, { transform: [{ translateX }] }]} />

			{/* Солнце 🌞 справа в светлой теме */}
			<View style={styles.icon2}>
				{!isDarkMode ? <Text>🌞</Text> : null}
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	switch: {
		position: 'absolute',
		top: 10,
		right: 20,
		width: 64,
		height: 31,
		borderRadius: 15,
		padding: 2,
		flexDirection: 'row',
		alignItems: 'center',
	},
	circle: {
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: '#FFFFFF',
		position: 'absolute',
		left: 5,
	},
	icon: {
		width: 24,
		alignItems: 'center',
		justifyContent: 'center',
	},
	icon2: {
		width: 24,
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 10
	},
});
