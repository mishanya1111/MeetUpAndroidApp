import React from 'react';
import CreateEditMeetup from '@/components/CreateEditMeetup';
import {Stack} from "expo-router";

export default function CreateMeetupPage() {
    return (
            <>
                <Stack.Screen options={{ headerShown: false }} />
                <CreateEditMeetup />
            </>
        )
}
