import React from 'react';
import { View, ActivityIndicator, Text, FlatList, StyleSheet } from 'react-native';
import {useMeetups} from '@/components/DataLoader/useMeetups';
import FilterBar from '@/components/FilterBar';
import MeetupCard from '@/components/MeetupCard';

interface DataLoaderProps {
    fetchFunction: (url: string) => Promise<any>;
}

const DataLoader: React.FC<DataLoaderProps> = ({ fetchFunction }) => {
    const {
        meetups,
        loading,
        error,
        handleSearchChange,
        handleDateFilter,
        applyFilters
    } = useMeetups(fetchFunction);

    return (
        <View>
            <FilterBar
                onSearchChange={handleSearchChange}
                onDateFilter={handleDateFilter}
                onApplyFilters={applyFilters}
            />
            {loading ? (
                <ActivityIndicator size="large" style={styles.loader} />
            ) : error ? (
                <Text style={styles.errorText}>Error: {error}</Text>
            ) : (
                <FlatList
                    data={meetups}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => <MeetupCard {...item} />}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    errorText: {
        textAlign: 'center',
        color: 'red',
        fontSize: 16
    }
});
export default DataLoader;