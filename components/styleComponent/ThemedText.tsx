import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

interface ThemedTextProps extends TextProps {
	children: React.ReactNode;
}

export function ThemedText({ children, style, ...rest }: ThemedTextProps) {
	const { text } = useThemeColors();

	return (
		<Text style={[styles.text, { color: text }, style]} {...rest}>
			{children}
		</Text>
	);
}

const styles = StyleSheet.create({
	text: {
		fontSize: 16
	}
});
