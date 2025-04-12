import React from 'react';
import { useLocalSearchParams, Stack } from 'expo-router';
import Profile from '../(tabs)/profile';
import HeaderWithTitle from '@/components/headerWithTitle';
import { BackgroundView } from '@/components/styleComponent/BackgroundView';

export default function TargetProfile() {
	const { targetProfileId } = useLocalSearchParams();

	return (
		<>
			<Stack.Screen options={{ headerShown: false }} />

			<BackgroundView>
				<HeaderWithTitle title="User Profile" />
				<Profile targetProfileId={Number(targetProfileId)} />
			</BackgroundView>
		</>
	);
}
