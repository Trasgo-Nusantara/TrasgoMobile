import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, ScrollView, Text, Image, TouchableOpacity } from 'react-native';
import { COLORS, COMPONENT_STYLES } from '../../../lib/constants';
import { getData } from '../../../api/service';
import Ionicons from 'react-native-vector-icons/Ionicons';




const { width } = Dimensions.get('window');

const DetailFoodScreen = ({ navigation }) => {

    const [listPlace, setListPlace] = useState([])
    // if (listPlace.length === 0) {
    //     return (
    //         <View style={[COMPONENT_STYLES.container, { padding: 0, alignItems: 'center', justifyContent: 'center' }]}>
    //             <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
    //             <Text style={[COMPONENT_STYLES.textMedium, { textAlign: 'center' }]}>daftar makanan belum tersedia</Text>
    //         </View>
    //     )
    // }

    const getDatas = async (url) => {
        try {
            const response = await getData(`warung/+6281310531713`);
            setListPlace(response.data.makanan);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getDatas();
    }, []);

    return (
        <View style={[COMPONENT_STYLES.container, { padding: 0 }]}>
            <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
            <ScrollView contentContainerStyle={[COMPONENT_STYLES.scrollView]}>
                {listPlace.map((item, index) => (
                    <View key={index}>
                        <View style={styles.listItem}>
                            <View style={{ marginRight: 20, flex: 1 }}>
                                <Text style={[COMPONENT_STYLES.textMedium, { fontWeight: '400' }]} numberOfLines={1} ellipsizeMode="tail">{item.fullName}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={[COMPONENT_STYLES.textSmallXL]}>{item.description}</Text>
                                </View>
                                <View style={COMPONENT_STYLES.spacerSmall} />
                                <View style={COMPONENT_STYLES.spacer} />
                                <View style={{ backgroundColor: COLORS.primary, height: 0.6 }} />
                                <View style={COMPONENT_STYLES.spacerSmall} />
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={[COMPONENT_STYLES.textLarge]}>
                                        IDR {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.image}>
                                <Image source={{ uri: item.imageCover }} style={{ resizeMode: 'cover', flex: 1, borderRadius: 10 }} />
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: COLORS.white,
        borderRadius: 10,
        marginBottom: 10,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 10,
    },
    barName: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        paddingVertical: 2,
        backgroundColor: COLORS.primary,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    }
});

export default DetailFoodScreen;
