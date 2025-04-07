import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, ScrollView, Text, Image, TouchableOpacity } from 'react-native';
import { BORDER_RADIUS, COLORS, COMPONENT_STYLES } from '../../../lib/constants';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { ModalSearch } from './component/SearchComponent';
import { ModalRideComponent } from './component/ListRideComponent';
import { ModalPaymentComponent } from './component/PaymentComponent';
import { ButtonComponent } from '../../../component/ButtonComponent';
import LottieView from 'lottie-react-native';
import { Motion } from '@legendapp/motion';
import { LoadingSearchComponent } from './component/LoadingSearchComponent';
import ModalDriver from '../../../component/ModaDriver';
import ModalInfo from '../../../component/ModalInfo';
import { postData } from '../../../api/service';
import Geolocation from '@react-native-community/geolocation';

const { width, height } = Dimensions.get('window');

const TrasrideScreen = ({ navigation }) => {
    //param from home
    const mapRef = useRef(null);

    const [pickupLocation, setPickupLocation] = useState({
        latitude: 0,
        longitude: 0,
    });

    const [destinationLocation, setDestinationLocation] = useState({
        latitude: 0,
        longitude: 0,
    });
    const [driverLocation, setdriverLocation] = useState({
        latitude: -6.206699626040456,
        longitude: 106.71610817076616,
    });

    const [regular, setregular] = useState([])
    const [hemat, sethemat] = useState([])
    const [premium, setpremium] = useState([])


    const [listPlace, setlistPlace] = useState([
        { label: 'Lokasi Kamu', value: '1', latitude: 0, longitude: 0 },
    ]);

    const [listPlace2, setlistPlace2] = useState([
        { label: 'Cari Tujuan Kamu', value: '1', latitude: 0, longitude: 0 },
    ]);

    const [selectedValueTitleOrigin, setselectedValueTitleOrigin] = useState('');
    const [selectedValueTitleDes, setselectedValueTitleDes] = useState('');
    
    const [originChoice, setoriginChoice] = useState({
        label: 'Lokasi Kamu',
        value: '1',
        latitude: pickupLocation.latitude,
        longitude: pickupLocation.longitude
    });
    const [destinationChoice, setdestinationChoice] = useState({
        label: 'Cari Tujuan Kamu',
        value: '1',
        latitude: pickupLocation.latitude,
        longitude: pickupLocation.longitude
    });
    const [coordinates, setCoordinates] = useState([]);

    const [selectedValue, setSelectedValue] = useState([regular[0]]);
    const [rideModal, setrideModal] = useState(true);

    const [modalSearchBarShow, setmodalSearchBarShow] = useState(true);
    const [modalRideShow, setmodalRideShow] = useState(false);
    const [modalPaymentShow, setmodalPaymentShow] = useState(true);

    const [searchLocationonMapMode, setsearchLocationonMapMode] = useState(false);
    const [locationStatus, setlocationStatus] = useState(false);
    const [focus, setfocus] = useState('');

    const [mencariDriver, setmencariDriver] = useState(false);
    const [modalCancel, setmodalCancel] = useState(false);

    const [findDriver, setfindDriver] = useState(false);
    const [statusDriver, setstatusDriver] = useState(0);

    const [initialSearch, setinitialSearch] = useState(false);

    const bookingNow = async () => {
        const formData2 = {
            originLat: pickupLocation.latitude,
            originLon: pickupLocation.longitude,
            destinationLat: destinationLocation.latitude,
            destinationLon: destinationLocation.longitude,
        };
        try {
            const responseFinal = await postData('maps/getDirections', formData2);
            const formData = {
                "createdAt": new Date().toISOString(),
                "updatedAt": new Date().toISOString(),
                "isActive": true,
                "isVerification": false,
                "pickupLocation": {
                    "latitude": pickupLocation.latitude,
                    "longitude": pickupLocation.longitude,
                    "address": responseFinal.asal
                },
                "destinationLocation": {
                    "latitude": destinationLocation.latitude,
                    "longitude": destinationLocation.longitude,
                    "address": responseFinal.tujuan
                },
                "idDriver": "",
                "idMitra": "",
                "status": 0,
                "type": selectedValue.name,
                "service": selectedValue.name,
                "isDeclinebyUser": null,
                "notesDecline": "",
                "hargaLayanan": selectedValue.harga,
                "hargaPotonganDriver": selectedValue.potongan1,
                "hargaPotonganMitra": 0,
                "hargaKenaikan": selectedValue.kenaikanHarga,
                "diskon": 0,
                "jarak": selectedValue.durasi,
                "payment": "",
                "coordinates": coordinates
            };
            try {
                const response = await postData('order/ride', formData);
                navigation.reset({
                    index: 1,
                    routes: [
                        { name: "Home" },
                        { name: "DetailOrder", params: { idInvoice: response.idOrder } } // Screen aktif
                    ],
                });
            } catch (error) {

            }
        } catch (error) {

        }
    }

    const batalMencari = () => {
        setmodalSearchBarShow(true)
        setmodalRideShow(false)
        setrideModal(true)
        setmodalPaymentShow(true)
        setmencariDriver(false)
        setfindDriver(false)
        setmodalCancel(false)
        const paddingMap = { top: 100, right: 100, bottom: 300, left: 100 };
        mapRef.current.fitToCoordinates(
            [{ latitude: pickupLocation.latitude, longitude: pickupLocation.longitude }, destinationLocation].filter(Boolean),
            {
                edgePadding: paddingMap,
                animated: true,
            }
        );
    }

    const handleUserLocationChange = (event) => {
        if (initialSearch === false) {
            const { latitude, longitude } = event.nativeEvent.coordinate;
            setinitialSearch(true)
            setPickupLocation({ latitude: latitude, longitude: longitude });
        }
    };

    const paddingMap = { top: 100, right: 100, bottom: 300, left: 100 }

    const buttonPickup = async (a) => {
        const formData = {
            nameSearch: a.placeId
        };
        try {
            const response = await postData('maps/getPlaceLocation', formData);
            setTimeout(async () => {
                setPickupLocation({
                    latitude: parseFloat(response.data.latitude),
                    longitude: parseFloat(response.data.longitude)
                });
                mapRef.current.fitToCoordinates([{ latitude: parseFloat(response.data.latitude), longitude: parseFloat(response.data.longitude) }, destinationLocation].filter(Boolean), {
                    edgePadding: paddingMap,
                    animated: true,
                });
                const formData2 = {
                    originLat: parseFloat(response.data.latitude),
                    originLon: parseFloat(response.data.longitude),
                    destinationLat: destinationLocation.latitude,
                    destinationLon: destinationLocation.longitude,
                };
                try {
                    const responseFinal = await postData('maps/getDirections', formData2);
                    setCoordinates(responseFinal.coordinate)
                    setregular(responseFinal.listLayanan.filter((item) => item.isHemat === false && item.isPremium === false))
                    sethemat(responseFinal.listLayanan.filter((item) => item.isHemat === true && item.isPremium === false))
                    setpremium(responseFinal.listLayanan.filter((item) => item.isHemat === false && item.isPremium === true))
                    setdestinationChoice({ label: responseFinal.tujuan })
                    setoriginChoice({ label: responseFinal.asal })
                    setSelectedValue("")
                    setlocationStatus(true)
                } catch (error) {

                }
            }, 1000); // 1000 ms delay
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const buttonDestination = async (a) => {
        const formData = {
            nameSearch: a.placeId
        };
        try {
            const response = await postData('maps/getPlaceLocation', formData);
            setTimeout(async () => {
                setDestinationLocation({
                    latitude: parseFloat(response.data.latitude),
                    longitude: parseFloat(response.data.longitude)
                });
                mapRef.current.fitToCoordinates([pickupLocation, { latitude: parseFloat(response.data.latitude), longitude: parseFloat(response.data.longitude) }].filter(Boolean), {
                    edgePadding: paddingMap,
                    animated: true,
                });
                const formData2 = {
                    originLat: pickupLocation.latitude,
                    originLon: pickupLocation.longitude,
                    destinationLat: parseFloat(response.data.latitude),
                    destinationLon: parseFloat(response.data.longitude)
                };
                try {
                    const responseFinal = await postData('maps/getDirections', formData2);
                    setCoordinates(responseFinal.coordinate)
                    setregular(responseFinal.listLayanan.filter((item) => item.isHemat === false && item.isPremium === false))
                    sethemat(responseFinal.listLayanan.filter((item) => item.isHemat === true && item.isPremium === false))
                    setpremium(responseFinal.listLayanan.filter((item) => item.isHemat === false && item.isPremium === true))
                    setdestinationChoice({ label: responseFinal.tujuan })
                    setoriginChoice({ label: responseFinal.asal })
                    setSelectedValue("")
                    setlocationStatus(true)
                } catch (error) {

                }
            }, 1000);
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Geolocation.getCurrentPosition(
        //     (position) => {
        //         const { latitude, longitude } = position.coords;
        //         setPickupLocation({ latitude, longitude }); 
        //     },
        //     (error) => {
        //         console.log("Error getting location", error);
        //     },
        //     { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        // );
    }, []);

    return (
        <View style={[COMPONENT_STYLES.container, { padding: 0 }]}>
            <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
            <MapView
                ref={mapRef}
                // provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={{
                    latitude: pickupLocation.latitude,
                    longitude: pickupLocation.longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                }}
                onUserLocationChange={handleUserLocationChange}
                onRegionChangeComplete={(data) => {
                    if (searchLocationonMapMode) {
                        if (focus === "origin") {
                            setPickupLocation({
                                latitude: data.latitude,
                                longitude: data.longitude,
                            })
                        } else {
                            setDestinationLocation({
                                latitude: data.latitude,
                                longitude: data.longitude,
                            })
                        }
                    }
                }}
                // onPress={handleMapPress}
                showsUserLocation={true}
            >
                <Marker coordinate={pickupLocation} pinColor='red' title='Origin' />
                <Marker coordinate={destinationLocation} pinColor='green' title='Destination' />
                <Polyline coordinates={coordinates} strokeColor="#37AFE1" strokeWidth={4} />
                {driverLocation.latitude !== 0 && statusDriver === 0 && findDriver &&
                    <Polyline coordinates={[pickupLocation, driverLocation]} strokeColor="#37AFE1" strokeWidth={4} />
                }
                {findDriver &&
                    <Marker coordinate={driverLocation} pinColor='blue' title='Driver' />
                }
            </MapView>
            {searchLocationonMapMode && (
                <View style={styles.centerCircle} />
            )}
            {mencariDriver &&
                <>
                    <View style={styles.modalAnimatebackground} />
                    <View style={styles.modalAnimateBottom}>
                        <ButtonComponent style={{ backgroundColor: COLORS.secondary }} title={"Batal Mencari"} onPress={() => batalMencari()} />
                    </View>
                    <LoadingSearchComponent />
                </>
            }
            {findDriver &&
                <ModalDriver
                    title={"asd"}
                    desc={"hjk"}
                    isVisible={findDriver}
                    setModalVisible={setfindDriver}
                    actions={() => setmodalCancel(true)}
                    call={() => navigation.navigate("Call", {
                        idDriver: 0
                    })}
                    chat={() => navigation.navigate("Chat", {
                        idDriver: 0
                    })}
                    selesai={() => navigation.replace("Rating", {
                        idInvoice: 'INV 123.2123'
                    })}
                />
            }
            <ModalInfo
                isVisible={modalCancel}
                setModalVisible={setmodalCancel}
                title={"Cancel Booking"}
                desc={"kamu ingin membatalkan pesanan ?"}
                actions={() => batalMencari()}
            />
            {!searchLocationonMapMode &&
                <ModalSearch
                    listPlace={listPlace}
                    listPlace2={listPlace2}
                    modalSearchBarShow={modalSearchBarShow}
                    setmodalSearchBarShow={setmodalSearchBarShow}
                    originChoice={originChoice.value}
                    setoriginChoice={setoriginChoice}
                    destinationChoice={destinationChoice.value}
                    setdestinationChoice={setdestinationChoice}
                    buttonOrigin={(a) => buttonPickup(a)}
                    buttonDestination={(a) => buttonDestination(a)}
                    setsearchLocationonMapMode={setsearchLocationonMapMode}
                    setfocus={setfocus}
                    setlocationStatus={setlocationStatus}
                    navigation={() => navigation.goBack()}

                    selectedValueTitleOrigin= {selectedValueTitleOrigin}
                    setselectedValueTitleOrigin={setselectedValueTitleOrigin}
                    selectedValueTitleDes={selectedValueTitleDes}
                    setselectedValueTitleDes={setselectedValueTitleDes}
                />
            }
            {searchLocationonMapMode &&
                <>
                    <View style={styles.modalAnimateBottom}>
                        <Text style={[COMPONENT_STYLES.textMedium, { textAlign: 'center', margin: 20, backgroundColor: COLORS.primary, color: 'white', borderRadius: BORDER_RADIUS.medium }]}>Geser Map Untuk Menentukan</Text>
                        <ButtonComponent style={{ backgroundColor: COLORS.secondary }} title={"Selesai"} onPress={async () => {
                            if (destinationLocation.latitude !== 0) {
                                try {
                                    const formData2 = {
                                        originLat: pickupLocation.latitude,
                                        originLon: pickupLocation.longitude,
                                        destinationLat: destinationLocation.latitude,
                                        destinationLon: destinationLocation.longitude,
                                    };

                                    const responseFinal = await postData('maps/getDirections', formData2);
                                    
                                    setselectedValueTitleOrigin(responseFinal.asal)
                                    setselectedValueTitleDes(responseFinal.tujuan)

                                    setCoordinates(responseFinal.coordinate)
                                    setregular(responseFinal.listLayanan.filter((item) => item.isHemat === false && item.isPremium === false))
                                    sethemat(responseFinal.listLayanan.filter((item) => item.isHemat === true && item.isPremium === false))
                                    setpremium(responseFinal.listLayanan.filter((item) => item.isHemat === false && item.isPremium === true))
                                    setSelectedValue("")
                                    setsearchLocationonMapMode(false)
                                    setlocationStatus(true)
                                } catch (error) {

                                }
                            } else {
                                setsearchLocationonMapMode(false)
                            }
                        }} />
                    </View>
                </>
            }
            {locationStatus &&
                <>
                    {rideModal &&
                        <ModalRideComponent
                            modalRideShow={modalRideShow}
                            setmodalRideShow={setmodalRideShow}
                            regular={regular}
                            hemat={hemat}
                            premium={premium}
                            selectedValue={selectedValue}
                            setSelectedValue={setSelectedValue}
                        />
                    }
                    <ModalPaymentComponent
                        navigasi={() => bookingNow()}
                        modalPaymentShow={modalPaymentShow}
                        setmodalPaymentShow={setmodalPaymentShow}
                        selectedValue={selectedValue}
                    />
                </>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    map: {
        flex: 1
    },
    modalAnimateTop: {
        position: 'absolute',
        top: 10, // Position it at the bottom
        left: 10,
        right: 10,
    },
    modalAnimateBottom: {
        position: 'absolute',
        bottom: 10, // Position it at the bottom
        left: 10,
        right: 10,

    },
    modalAnimatebackground: {
        position: 'absolute',
        backgroundColor: '#00000090',
        width: width,
        height: height
    },
    modalAnimateCenter: {
        position: 'absolute',
        top: height / 3, // Position it at the bottom
        left: 50,
        right: 50,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20,
        elevation: 5
    },
    modalComponentTop: {
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: '#00000030',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingBottom: 20,
        elevation: 1
    },
    centerCircle: {
        position: 'absolute',
        width: 10,
        height: 10,
        borderRadius: 10, // Setengah dari width/height agar bulet
        backgroundColor: 'purple',
        alignSelf: 'center', // Posisi horizontal tengah
        top: height / 2 - 10, // Supaya pas di tengah vertikal
    },
});

export default TrasrideScreen;
