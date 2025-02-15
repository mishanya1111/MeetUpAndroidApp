import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

export const BackroundView = ({ children }) => {
    const { background } = useThemeColors(); // Получаем цвет фона из контекста

    return (
        <View style={[styles.container, { backgroundColor: background }]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, // Заполняет весь экран
        width: '100%',
        height: '100%',
    },
});
