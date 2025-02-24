import { useThemeColors } from '@/hooks/useThemeColors';

import React from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

export default function Loader() {
	const { handlePath } = useThemeColors();

	// Анимация вращения
	const rotateValue = React.useRef(new Animated.Value(0)).current;

	React.useEffect(() => {
		Animated.loop(
			Animated.timing(rotateValue, {
				toValue: 1,
				duration: 1500,
				easing: Easing.linear,
				useNativeDriver: true
			})
		).start();
	}, [rotateValue]);

	const rotate = rotateValue.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '360deg']
	});

	return (
		<View style={styles.loader}>
			<Animated.Image
				source={handlePath}
				style={[styles.logo, { transform: [{ rotate }] }]}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	loader: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)'
	},
	logo: {
		width: 100,
		height: 100
	}
});
