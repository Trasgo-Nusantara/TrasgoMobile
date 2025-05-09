import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, ScrollView, Text, Image, TouchableOpacity } from 'react-native';
import { COLORS, COMPONENT_STYLES } from '../../../lib/constants';
import Geolocation from '@react-native-community/geolocation';
import { getData } from '../../../api/service';
import MapView, { Marker } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';




const { width } = Dimensions.get('window');

const TrasfoodScreen = ({navigation}) => {
    const mapRef = useRef(null);

    const [initialSearch, setinitialSearch] = useState(true);
    const [searchLocationonMapMode, setsearchLocationonMapMode] = useState(false);


    const [pickupLocation, setPickupLocation] = useState({
        latitude: 0,
        longitude: 0,
    });

    const [listPlace, setListPlace] = useState([])

    const handleUserLocationChange = async (event) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        const response = await getData(`warung/Distance/${latitude}/${longitude}`);
        setListPlace(response.data);
        setPickupLocation({ latitude: latitude, longitude: longitude });
        setinitialSearch(false)
    };

    if (initialSearch) {
        return (
            <MapView
                ref={mapRef}
                style={{ flex: 1 }}
                region={{
                    latitude: pickupLocation.latitude,
                    longitude: pickupLocation.longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                }}
                onUserLocationChange={handleUserLocationChange}
                onRegionChangeComplete={(data) => {
                    if (searchLocationonMapMode) {
                        setPickupLocation({
                            latitude: data.latitude,
                            longitude: data.longitude,
                        })
                    }
                }}
                showsUserLocation={true}
            >
                <Marker coordinate={pickupLocation} pinColor='red' title='Origin' />
            </MapView>
        )
    }

    if (listPlace.length === 0) {
        return (
            <View style={[COMPONENT_STYLES.container, { padding: 0, alignItems: 'center', justifyContent: 'center' }]}>
                <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
                <Text style={[COMPONENT_STYLES.textMedium, { textAlign: 'center' }]}>belum ada restoran di sekitar</Text>
            </View>
        )
    }

    return (
        <View style={[COMPONENT_STYLES.container, { padding: 0 }]}>
            <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
            <ScrollView contentContainerStyle={[COMPONENT_STYLES.scrollView]}>
                {listPlace.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => navigation.navigate('DetailFood', { id: item.id })}>
                        <View style={styles.listItem}>
                            <View style={styles.image}>
                                <Image source={{ uri: item.imageCover }} style={{ resizeMode: 'cover', flex: 1, borderRadius: 10 }} />
                                <View style={styles.barName} >
                                    <Ionicons name="star" size={12} color={"yellow"} style={{ marginRight: 3 }} />
                                    <Text style={[COMPONENT_STYLES.textSmall, { color: 'white' }]}>{item.rating}</Text>
                                </View>
                            </View>
                            <View style={{ marginLeft: 20, flex: 1 }}>
                                <Text style={[COMPONENT_STYLES.textMedium, { fontWeight: '400' }]} numberOfLines={1} ellipsizeMode="tail">{item.fullName}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={[COMPONENT_STYLES.textSmallXL]}>Medium</Text>
                                    <View style={{ width: 5, height: 5, backgroundColor: COLORS.primary, borderRadius: 100, marginHorizontal: 5 }} />
                                    <Text style={[COMPONENT_STYLES.textSmallXL]}>Ayam dan Bebek</Text>
                                </View>
                                <View style={COMPONENT_STYLES.spacerSmall} />
                                <View style={{ backgroundColor: COLORS.primary, height: 0.6 }} />
                                <View style={COMPONENT_STYLES.spacerSmall} />
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={[COMPONENT_STYLES.textSmallXL]}>Ongkir 12rb</Text>
                                    <View style={{ width: 2, height: 2, backgroundColor: COLORS.backgroundSecondary, borderRadius: 100, marginHorizontal: 5 }} />
                                    <Text style={[COMPONENT_STYLES.textSmallXL]}>{item.distance.toFixed(1)} m dari kamu</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
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
        width: 80,
        height: 80,
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

export default TrasfoodScreen;
