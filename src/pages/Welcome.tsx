import React from "react";
import { useState } from "react";
import { SafeAreaView, Text, Image, StyleSheet } from "react-native";

import { Button } from "../components/Button";

import wateringImg from "../assets/watering.png";
import colors from "../styles/colors";

export function Welcome() {
    const [visible, setVisible] = useState(false);

    function handleVisibility() {
        setVisible(true);
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>
                Gerencie suas plantas de forma fácil
            </Text>

            { visible && 
            <Image source={wateringImg} style={styles.image}></Image> }

            <Text  style={styles.subtitle}>
                Não esqueça mais de regar suas plantas.
                Nós cuidamos de lembrar você sempre que precisar.
            </Text>

            <Button title="Go" />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'black',
        marginTop: 38
    },

    subtitle: {
        textAlign: 'center',
        fontSize: 18,
        paddingHorizontal: 20,
        color: 'black'
    },

    button: {
        backgroundColor: colors.green,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        marginBottom: 10,
        height: 56,
        width: 56
    },

    buttonText: {
        color: colors.white,
        fontSize: 24
    },

    image: {
        width: 292,
        height: 284
    }
});