import React, {useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal, Image, ScrollView, TextInput } from 'react-native';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';
import { LoginNeededContainer } from '@/components/LoginNeededContainer';
import { ThemedText } from '@/components/styleComponent/ThemedText';
import { BackgroundView } from '@/components/styleComponent/BackgroundView';
import { useRouter } from 'expo-router';
import { SIGN_IN } from '@/constant/router';
import { useAuth } from '@/context/AuthContext';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useProfile } from '@/hooks/useProfile';
import { ActivityIndicator } from 'react-native';

import * as ImagePicker from 'expo-image-picker';

export default function Profile() {
    const { token, name, removeToken } = useAuth();
    const [ showModal, setShowModal ] = useState(false);
    const { headerFooter, buttonBg, text} = useThemeColors();

    const { userData, loading, error, updateProfile } = useProfile();
    const [editableUserData, setEditableUserData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        user_description: '',
        tg_id: '',
    });

    useEffect(() => {
        if (userData) {
            setEditableUserData({
                ...editableUserData,
                ...userData
            });
        }
    }, [userData]);


    // сохраняем фото
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    useEffect(() => {
        if (userData?.photo) {
            setPhotoUri(userData.photo);
        }
    }, [userData?.photo]);

    const handlePickImage = async () => {
        // Запрашиваем разрешение на доступ к галерее
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access gallery is required!');
            return;
        }

        // Открываем файловый менеджер
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1], // Квадратное изображение
            quality: 1,
        });

        if (!result.canceled) {
            setPhotoUri(result.assets[0].uri); // Обновляем аватарку на экране
            // Можно отправить фото на сервер
            console.log('Selected image:', result.assets[0].uri);
        }
    };

    const handleLogout = useCallback(() => {
        removeToken();
        setShowModal(false);
    }, [removeToken]);

    const handleChange = (key, value) => {
        setEditableUserData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSaveChanges = async () => {
        try {
            console.log("Отправляемые данные:", { ...editableUserData, photo: photoUri });

            const updatedData = await updateProfile({ ...editableUserData, photo: photoUri });

            if (updatedData?.photo) {
                setPhotoUri(updatedData.photo); // 🔥 Обновляем фото с сервера
            }

            console.log("Данные профиля успешно обновлены!");
        } catch (error) {
            console.error("Ошибка обновления профиля:", error);
        }
    };


    return (
        <BackgroundView>
            <ScrollView contentContainerStyle={styles.container}>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : error ? (
                    <ThemedText>{error}</ThemedText>
                ) : token ? (
                    <>
                        {/* Переключатель темы */}
                        <ThemeToggleButton />

                        {/* Аватар */}
                        <View style={styles.avatarContainer}>
                            {photoUri && <Image source={{ uri: photoUri }} style={styles.profileImage} />}

                            <TouchableOpacity style={[styles.uploadButton, { backgroundColor: buttonBg }]} onPress={handlePickImage}>
                                <Text style={[styles.uploadButtonText, { color: "#f2f2f2" }]}>Upload photo</Text>
                            </TouchableOpacity>

                        </View>

                        {/* Поля ввода */}
                        <View style={styles.infoContainer}>
                            <Text style={[styles.label, { color: text }]}>Name:</Text>
                            <TextInput
                                style={styles.input}
                                value={editableUserData.first_name || userData?.first_name || ''}
                                onChangeText={(val) => handleChange('first_name', val)}
                                placeholder="Enter your first name"
                                placeholderTextColor="#aaa"
                            />

                            <Text style={[styles.label, { color: text }]}>Last Name:</Text>
                            <TextInput
                                style={styles.input}
                                value={editableUserData.last_name || userData?.last_name || ''}
                                onChangeText={(val) => handleChange('last_name', val)}
                                placeholder="Enter your last name"
                                placeholderTextColor="#aaa"
                            />

                            <Text style={[styles.label, { color: text }]}>Username:</Text>
                            <TextInput
                                style={styles.input}
                                value={editableUserData.username || userData?.username || ''}
                                onChangeText={(val) => handleChange('username', val)}
                                placeholder="Enter your username"
                                placeholderTextColor="#aaa"
                            />

                            <Text style={[styles.label, { color: text }]}>Email:</Text>
                            <TextInput
                                style={styles.input}
                                value={editableUserData.email || userData?.email || ''}
                                onChangeText={(val) => handleChange('email', val)}
                                placeholder="Enter your email"
                                keyboardType="email-address"
                                placeholderTextColor="#aaa"
                            />

                            <Text style={[styles.label, { color: text }]}>About Me:</Text>
                            <TextInput
                                style={[styles.input, styles.descriptionInput]}
                                value={editableUserData.user_description || userData?.user_description || ''}
                                onChangeText={(val) => handleChange('user_description', val)}
                                placeholder="Enter your profile description"
                                multiline
                                placeholderTextColor="#aaa"
                            />

                            <Text style={[styles.label, { color: text }]}>Telegram ID:</Text>
                            <TextInput
                                style={styles.input}
                                value={editableUserData.tg_id || userData?.tg_id || ''}
                                onChangeText={(val) => handleChange('tg_id', val)}
                                placeholder="Enter your Telegram ID"
                                placeholderTextColor="#aaa"
                            />
                        </View>

                        {/* Кнопка сохранения */}
                        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        </TouchableOpacity>

                        {/* Кнопка выхода */}
                        <TouchableOpacity onPress={() => setShowModal(true)} style={styles.logoutButton}>
                            <Text style={styles.logoutButtonText}>Logout</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <ThemeToggleButton />

                        <LoginNeededContainer location="profile"/>
                    </>
                )}
            </ScrollView>

            {/* Модальное окно выхода */}
            <Modal
                visible={showModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: headerFooter }]}>
                        <ThemedText>Are you sure you want to log out?</ThemedText>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={handleLogout} style={styles.confirmButton}>
                                <Text style={styles.confirmButtonText}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowModal(false)} style={styles.cancelButton}>
                                <Text style={styles.cancelButtonText}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </BackgroundView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 20
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 20
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10
    },
    uploadButton: {
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderRadius: 5
    },
    uploadButtonText: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    infoContainer: {
        width: '100%',
        maxWidth: 400
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ccc'
    },
    descriptionInput: {
        height: 100,
        textAlignVertical: 'top'
    },
    saveButton: {
        backgroundColor: '#1c8139',
        paddingVertical: 10,
        paddingLeft: 86,
        width: '80%',
        borderRadius: 8,
        marginTop: 15
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16
    },
    logoutButton: {
        backgroundColor: '#FF4500',
        paddingVertical: 10,
        paddingHorizontal: 105,
        width: '80%',
        borderRadius: 8,
        marginTop: 30
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        height: 350,
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center'
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20
    },
    confirmButton: {
        backgroundColor: '#FF4500',
        padding: 10,
        borderRadius: 5,
        width: 70,
        alignItems: 'center'
    },
    confirmButtonText: {
        color: '#fff'
    },
    cancelButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        width: 70,
        alignItems: 'center'
    },
    cancelButtonText: {
        color: '#fff'
    },
    titleContainer: {
        padding: 20,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center'
    },
});