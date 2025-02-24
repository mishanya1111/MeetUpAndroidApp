// components/MeetupDetails.tsx
import React from 'react';
import {View, Text, Image, Button, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {useMeetupDetails} from '@/hooks/useMeetupDetails';
import {useRouter} from 'expo-router';
import {BackgroundView} from '@/components/styleComponent/BackgroundView';
import {useThemeColors} from '@/hooks/useThemeColors';
import {Ionicons} from '@expo/vector-icons';
import {useAuth} from "@/context/AuthContext";
import {ThemedText} from "@/components/styleComponent/ThemedText";
import {SIGN_IN} from "@/constant/router"; // Для иконки стрелочки назад

const MeetupDetails = () => {
  const { token, name } = useAuth(); // Достаём токен и userID из контекста
  const router = useRouter();
  // Если нет токена — показываем просьбу войти в систему
  if (!token) {
    return (
      <BackgroundView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={text}/>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {color: text}]}>
            {'Meetup Details'}
          </Text>
        </View>
        <View style={styles.authContainer}>
          <ThemedText style={styles.authText}>
            Please log in to view description of meetup.
          </ThemedText>
          <Button title="Log In" onPress={() => router.push(SIGN_IN)} />
        </View>
      </BackgroundView>
    );
  }
  const {
    meetup,
    loading,
    error,
    isFavorite,
    formattedDate,
    userID,
    handleSignForMeeting,
    handleUnsubscribe
  } = useMeetupDetails();
  const {handlePath, text, description: descriptionColor} = useThemeColors();

  if (loading) {
    return (
      <BackgroundView>
        <View style={styles.loader}>
          <Text>
            <ActivityIndicator size="large"/>
          </Text>
        </View>
      </BackgroundView>
    );
  }

  if (error) {
    return (
      <BackgroundView>
        <Text style={[styles.errorText, { color: text }]}>{`Error: ${String(error)}`}</Text>
      </BackgroundView>
    );
  }

  return (
    <BackgroundView>
      {/* Кастомный header с кнопкой назад */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={text}/>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: text}]}>
          {meetup?.title || 'Meetup Details'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={meetup?.image ? {uri: meetup.image} : handlePath}
          style={styles.image}
        />
        <Text style={[styles.title, {color: text}]}>
          {meetup?.title || 'Untitled Meetup'}
        </Text>
        <Text style={[styles.author, {color: descriptionColor}]}>
          Author: {meetup?.author || 'Unknown'}
        </Text>
        <Text style={[styles.link, {color: descriptionColor}]}>
          Link: {meetup?.link || 'No link provided'}
        </Text>
        <Text style={[styles.date, {color: descriptionColor}]}>
          {`Date: ${formattedDate}`}
        </Text>
        <Text style={[styles.signed, {color: descriptionColor}]}>
          {`Already signed: ${meetup?.attendees_count || 0}`}
        </Text>
        <Text style={[styles.description, {color: text}]}>
          {meetup?.description || 'No description available.'}
        </Text>

        {userID === meetup?.author_id ? (
          <Button title="Edit Meetup" onPress={() => router.push(`/editMeetup/${meetup?.id}`)}/>
        ) : isFavorite !== null ? (
          isFavorite ? (
            <Button title="Unsubscribe" onPress={handleUnsubscribe}/>
          ) : (
            <Button title="Subscribe" onPress={handleSignForMeeting}/>
          )
        ) : (
          <Text style={{color: descriptionColor}}>Loading subscription status...</Text>
        )}
      </ScrollView>
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  authText: {
    fontSize: 18,
    marginBottom: 12
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16
  },
  backButton: {
    marginRight: 8
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  container: {
    padding: 16
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    height: 200,
    width: '100%',
    borderRadius: 8,
    marginBottom: 16
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8
  },
  author: {
    fontSize: 18,
    marginBottom: 8
  },
  link: {
    fontSize: 16,
    marginBottom: 8
  },
  date: {
    fontSize: 16,
    marginBottom: 8
  },
  signed: {
    fontSize: 16,
    marginBottom: 8
  },
  description: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 16
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16
  }
});

export default MeetupDetails;
