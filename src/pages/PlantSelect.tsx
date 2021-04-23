import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";

import { EnviromentButton } from "../components/EnvironmentButton";
import { Header } from "../components/Header";
import { PlantCardPrimary } from "../components/PlantCardPrimary";
import { Load } from "../components/Load";

import { PlantProps } from "../libs/storage";

import api from "../services/api";

import colors from "../styles/colors";
import fonts from "../styles/fonts";
import { useNavigation } from "@react-navigation/core";

interface EnvironmentsProps {
    key: string;
    title: string;
}

export function PlantSelect() {
    const [environments, setEnvironments] = useState<EnvironmentsProps[]>([]);
    const [plants, setPlants] = useState<PlantProps[]>([]);
    const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>([]);
    const [environmentSelected, setEnvironmentSelected] = useState('all');
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    const navigation = useNavigation();
    
    function handleEnvironmentSelected(environment: string) {
        setEnvironmentSelected(environment);

        if (environment == 'all')
            return setFilteredPlants(plants);

        const filtered = plants.filter(plant => 
            plant.environments.includes(environment)
        );

        setFilteredPlants(filtered);
    }

    async function fecthPlants() {
        const { data } = await api.get(`plants?_sort=name&order=asc&_page=${page}&_limit=8`);

        if (!data)
            return setLoading(true);

        if (page > 1) {
            setPlants(oldValue => [...oldValue, ...data])
            setFilteredPlants(oldValue => [...oldValue, ...data])
        } else {
            setPlants(data);
            setFilteredPlants(data);
        }

        setLoading(false);
        setLoadingMore(false);
    }

    function handleFetchMore(distance: number) {
        if (distance < 1)
            return;

        setLoadingMore(true);
        setPage(oldValue => oldValue + 1);
        fecthPlants();
    }

    function handlePlantSelect(plant: PlantProps) {
        navigation.navigate('PlantSave', { plant });
    }

    useEffect(() => {
        async function fecthEnvironment() {
            const { data } = await api.get('plants_environments?_sort=title&order=asc');
            setEnvironments([
                {
                    key: 'all',
                    title: 'Todos',
                },
                ...data
            ]);
        }

        fecthEnvironment();
    }, [])

    useEffect(() => {
        

        fecthPlants();
    }, [])

    if (loading)
        return <Load />

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header />

                <Text style={styles.title}>
                    Em qual ambiente
                </Text>
                <Text style={styles.subtitle}>
                    você quer colocar sua planta?
                </Text>
            </View>

            <View>
                <FlatList data={environments} keyExtractor={(item) => String(item.key)}
                    renderItem={({ item }) => (
                        <EnviromentButton title={item.title} 
                            active={item.key == environmentSelected}
                            onPress={() => handleEnvironmentSelected(item.key)} />
                    )} 
                    horizontal showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={styles.enviromentList} 
                />
            </View>

            <View style={styles.plants}> 
                <FlatList data={filteredPlants} keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <PlantCardPrimary data={item} onPress={() => handlePlantSelect(item)} />
                    )} 
                    showsVerticalScrollIndicator={false} numColumns={2}
                    onEndReached={({ distanceFromEnd }) => handleFetchMore(distanceFromEnd)}
                    onEndReachedThreshold={0.1} 
                    ListFooterComponent={
                        loadingMore ? <ActivityIndicator color={colors.green} /> : <></>
                    } />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 30
    },

    container: {
        flex: 1,
        backgroundColor: colors.background
    },

    title: {
        fontSize: 17,
        color: colors.heading,
        fontFamily: fonts.heading,
        lineHeight: 20,
        marginTop: 15
    },

    subtitle: {
        fontSize: 17,
        fontFamily: fonts.text,
        lineHeight: 20,
        color: colors.heading
    },

    enviromentList: {
        height: 40,
        justifyContent: 'center',
        paddingBottom: 5,
        marginTop: 16,
        marginLeft: 32,
        marginRight: 32
    },

    plants: {
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: 'center'
    }
});