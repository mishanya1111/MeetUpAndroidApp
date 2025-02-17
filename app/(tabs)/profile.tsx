import { StyleSheet } from 'react-native';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';
import { ThemedText } from '@/components/styleComponent/ThemedText';
import { BackgroundView } from '@/components/styleComponent/BackgroundView';

export default function Profile() {
	return (
		<BackgroundView>
			<ThemedText style={[styles.titleContainer]}> Profile</ThemedText>
			<ThemeToggleButton />
		</BackgroundView>
	);
}

const styles = StyleSheet.create({
	titleContainer: {
		padding: 20
	}
});
