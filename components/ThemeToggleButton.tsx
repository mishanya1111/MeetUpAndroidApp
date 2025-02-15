import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export function ThemeToggleButton() {
    const { theme, toggleTheme } = useTheme();

    return (
        <TouchableOpacity style={styles.button} onPress={toggleTheme}>
            <Text style={styles.text}>Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#3a6ff7',
        alignItems: 'center',
        marginTop: 20,
    },
    text: {
        color: '#fff',
        fontSize: 16,
    },
});
