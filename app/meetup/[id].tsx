// app/meetup/[id].tsx
import MeetupDetails from '@/components/MeetupDetails';
import { Stack } from 'expo-router';

export default function Page() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} /> {/* Убираем дефолтный заголовок */}
      <MeetupDetails />
    </>
  );
}
