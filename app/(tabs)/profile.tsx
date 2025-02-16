import { Text, View, StyleSheet } from 'react-native';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';

export default function Profile() {
	return (
		<View>
			<ThemeToggleButton />
			<Text> miha</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	titleContainer: {
		padding: 20,
		backgroundColor: 'red'
	}
});
