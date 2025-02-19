import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';
import { ThemedText } from '@/components/styleComponent/ThemedText';
import { BackgroundView } from '@/components/styleComponent/BackgroundView';
import { useRouter } from 'expo-router';
import { SIGN_IN } from '@/constant/router';
import {useAuth} from "@/context/AuthContext";

export default function MyMeetups() {
	const {name} = useAuth();
	return (
		<BackgroundView>
			<ThemedText style={[styles.titleContainer]}> My meetups</ThemedText>
			<ThemeToggleButton />

			<ThemedText> {name}</ThemedText>
		</BackgroundView>
	);
}

const styles = StyleSheet.create({
	titleContainer: {
		padding: 20
	}
});
