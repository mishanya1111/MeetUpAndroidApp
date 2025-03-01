import { Stack } from 'expo-router';

export default function AuthLayout() {
	return (
		<Stack>
			<Stack.Screen
				name="SignIn"
				options={{ title: 'Sign In', headerShown: false }}
			/>
			<Stack.Screen
				name="SignUp"
				options={{ title: 'Sign Up', headerShown: false }}
			/>
		</Stack>
	);
}
