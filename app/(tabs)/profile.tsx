import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';
import { ThemedText } from '@/components/styleComponent/ThemedText';
import { BackgroundView } from '@/components/styleComponent/BackgroundView';
import { useRouter } from 'expo-router';
import { SIGN_IN } from '@/constant/router';

export default function Profile() {
	const router = useRouter();
	return (
		<BackgroundView>
			<ThemedText style={[styles.titleContainer]}> Profile</ThemedText>
			<ThemeToggleButton />
			<TouchableOpacity
				onPress={() => {
					router.push(SIGN_IN);
				}}
			>
				<Text>Login IN</Text>
			</TouchableOpacity>
		</BackgroundView>
	);
}

const styles = StyleSheet.create({
	titleContainer: {
		padding: 20
	}
});
