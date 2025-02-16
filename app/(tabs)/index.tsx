import { StyleSheet, View, Pressable } from 'react-native';

import { ThemeToggleButton } from '@/components/ThemeToggleButton';
import { BackgroundView } from '@/components/styleComponent/BackgroundView';
import { ThemedText } from '@/components/styleComponent/ThemedText';

export default function HomeScreen() {
	const styles = StyleSheet.create({
		titleContainer: {
			padding: 20
		}
	});

	return (
		<BackgroundView>
			<ThemedText style={[styles.titleContainer]}> mihail</ThemedText>
			<ThemedText style={[styles.titleContainer]}> mihail2</ThemedText>
			<ThemedText style={[styles.titleContainer]}> mihail3</ThemedText>
			<View>
				<Pressable
					onPress={() => {
						console.log('miha');
					}}
				>
          <ThemedText>mihail tik</ThemedText>
				</Pressable>
			</View>
			<ThemeToggleButton />
		</BackgroundView>
	);
}
