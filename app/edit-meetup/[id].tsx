import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import CreateEditMeetup from '@/components/CreateEditMeetup';

export default function EditMeetupPage() {
    const { id } = useLocalSearchParams();

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <CreateEditMeetup meetupId={Number(id)} />
        </>
    );}
