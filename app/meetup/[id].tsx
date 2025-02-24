// app/meetup/[id].tsx
import MeetupDetails from '@/components/MeetupDetails';
import { Stack } from 'expo-router';
import React from 'react';

export default function Page() {
	return (
		<>
			<Stack.Screen options={{ headerShown: false }} />
			<MeetupDetails />
		</>
	);
}
