import React, { useEffect, useRef, useState } from 'react';
import { Motion } from "@legendapp/motion"
import { COLORS, COMPONENT_STYLES } from "../../../../lib/constants"
import { TouchableOpacity, Text, StyleSheet, Dimensions, View, Modal, PanResponder } from 'react-native';
import { useTranslation } from "react-i18next";
import RadioButtonChoiceGroup from '../../../../component/RadioButtonChoiceComponent';
import TextInputComponent from '../../../../component/TextInputComponent';
import { ButtonComponent, ButtonThirdComponent } from '../../../../component/ButtonComponent';
import TextInputStandardComponent from '../../../../component/TextInputStandardComponent';



const ModalRideComponent = ({
    modalRideShow,
    setmodalRideShow,
    options,
    selectedValue,
    setSelectedValue,
    regular,
    hemat,
    premium
}) => {

    const { t } = useTranslation();
    const [choice, setchoice] = useState("regular")
    const [kodeDriver, setkodeDriver] = useState("")
    const [error, setError] = useState("")
    const [loading, setloading] = useState(false);

    const handleLoginPress = async () => {
        if (!phone) {
          setError("");
        } else {
          setError('');
        }
      };

    useEffect(() => {
        if (modalRideShow) {
            const timer = setTimeout(() => {
                setmodalRideShow(true);
            }, 100); // 0.5 seconds delay
            return () => clearTimeout(timer); // Clean up the timer if the modal visibility changes before the timeout
        } else {
            setmodalRideShow(false); // Reset animation when modal is closed
        }
    }, [modalRideShow]);

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => false, // Do not respond to touch events initially
        onMoveShouldSetPanResponder: (evt, gestureState) => {
            // Only respond to vertical movements that exceed a certain threshold
            const { dy } = gestureState;
            return Math.abs(dy) > 10;
        },
        onPanResponderMove: (evt, gestureState) => {
            // Gesture state contains the movement of the touch (in px)
            const { dy } = gestureState;  // dy is the vertical movement of the touch
            if (dy > 50) {
                setmodalRideShow(false);
            } else if (dy < -50) {
                setmodalRideShow(true);
            }
        },
        onPanResponderRelease: (evt, gestureState) => {
            const { dy } = gestureState;
            if (dy > 50) {
                setmodalRideShow(false);
            } else if (dy < -50) {
                setmodalRideShow(true);
            }
        },
    });

    const handleSelect = (option) => {
        setSelectedValue(option);
        setmodalRideShow(false)
    };

    return (
        <Motion.View
            {...panResponder.panHandlers}
            initial={{ y: 0 }}
            animate={{ x: 0, y: modalRideShow ? -1.3 * 100 : 2 * 100 }} // Use the animateModal state for triggering animation
            whileHover={{ scale: 1.2 }}
            whileTap={{ y: 20 }}
            transition={{ type: 'spring' }}
            style={styles.modalAnimate}
        >
            <View style={styles.modalComponent} >
                <View style={{ alignItems: 'center', margin: 10 }}>
                    <View style={{ width: 50, height: 3, backgroundColor: '#00000050' }} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: "center", alignItems: "center" }}>
                    <TouchableOpacity onPress={() => setchoice('regular')}>
                        <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600', textAlign: 'center' }]}>Trasgo</Text>
                        {choice === 'regular' &&
                            <View style={{ alignItems: 'center' }}>
                                <View style={{ width: 50, height: 3, backgroundColor: COLORS.primary }} />
                            </View>
                        }
                    </TouchableOpacity>
                    <View style={{ width: 5, height: 5, backgroundColor: COLORS.primary, borderRadius: 100, marginHorizontal: 10 }} />
                    <TouchableOpacity onPress={() => setchoice('hemat')}>
                        <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600', textAlign: 'center' }]}>Hemat</Text>
                        {choice === 'hemat' &&
                            <View style={{ alignItems: 'center' }}>
                                <View style={{ width: 50, height: 3, backgroundColor: COLORS.primary }} />
                            </View>
                        }
                    </TouchableOpacity>
                    <View style={{ width: 5, height: 5, backgroundColor: COLORS.primary, borderRadius: 100, marginHorizontal: 10 }} />
                    <TouchableOpacity onPress={() => setchoice('premium')}>
                        <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600', textAlign: 'center' }]}>Perioritas</Text>
                        {choice === 'premium' &&
                            <View style={{ alignItems: 'center' }}>
                                <View style={{ width: 50, height: 3, backgroundColor: COLORS.primary }} />
                            </View>
                        }
                    </TouchableOpacity>
                    {/* <View style={{ width: 5, height: 5, backgroundColor: COLORS.primary, borderRadius: 100, marginHorizontal: 10 }} />
                    <TouchableOpacity onPress={() => setchoice('instant')}>
                        <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600', textAlign: 'center' }]}>Instant</Text>
                        {choice === 'instant' &&
                            <View style={{ alignItems: 'center' }}>
                                <View style={{ width: 50, height: 3, backgroundColor: COLORS.primary }} />
                            </View>
                        }
                    </TouchableOpacity> */}
                </View>
                <View style={COMPONENT_STYLES.spacer} />
                {choice === 'regular' &&
                    <RadioButtonChoiceGroup
                        options={regular}
                        selectedValue={selectedValue}
                        onSelect={handleSelect}
                    />
                }
                {choice === 'hemat' &&
                    <RadioButtonChoiceGroup
                        options={hemat}
                        selectedValue={selectedValue}
                        onSelect={handleSelect}
                    />
                }
                {choice === 'premium' &&
                    <RadioButtonChoiceGroup
                        options={premium}
                        selectedValue={selectedValue}
                        onSelect={handleSelect}
                    />
                }
                {choice === 'instant' &&
                    <View style={{ flex: 1 }} >
                        <View style={COMPONENT_STYLES.spacer} />
                        <View style={COMPONENT_STYLES.spacer} />
                        <View style={COMPONENT_STYLES.spacer} />
                        <View style={COMPONENT_STYLES.spacer} />
                        <Text style={[COMPONENT_STYLES.textMedium, { fontWeight: '600' }]}>Kode Driver</Text>
                        <TextInputStandardComponent
                            // label={t('loginScreen.phoneLabel')}
                            placeholder={"Masukkan Kode Driver"}
                            value={kodeDriver}
                            onChangeText={setkodeDriver}
                            keyboardType="phone-pad"
                            errorMessage={error}
                        />
                        <View style={COMPONENT_STYLES.spacer} />
                        <View style={COMPONENT_STYLES.spacer} />
                        <View style={COMPONENT_STYLES.spacer} />
                        <ButtonThirdComponent
                            title={"Cari Driver"}
                            onPress={handleLoginPress}
                            isLoading={loading}
                        />
                    </View>
                }
            </View>
        </Motion.View>
    )
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },
    modalAnimate: {
        position: 'absolute',
        bottom: 0, // Position it at the bottom
        left: 0,
        right: 0,
    },
    modalComponent: {
        backgroundColor: 'white',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingHorizontal: 20,
        paddingBottom: 20,
        height: 550,
    },
});

export {
    ModalRideComponent
}