import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Icons from "react-native-heroicons/solid";
import { themeColors } from '../theme'
import { useNavigation } from '@react-navigation/native'
import TopNavBar from '../navigation/TopNavBar';
import BottomNavBar from '../navigation/BottomNavBar';

export default function ConnectScreen() {
    const navigation = useNavigation();
    const [serialNumber, setSerialNumber] = useState('');

    return (
        <View style={{ flex: 1 }}>
            <TopNavBar />
            <SafeAreaView style={styles.container}>

                <View style={styles.formContainer}>
                    <View style={styles.texts}>
                        <Text style={styles.headerText}>مرحبا!</Text>
                        <Text style={styles.subHeaderText}>
                            قم بربط الجهاز للوصول إلى جميع خدمات مرشد والبدء بإدارة منزلك
                        </Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            value={serialNumber}
                            onChangeText={setSerialNumber}
                            placeholder="أدخل الرقم التسلسلي الموجود أسفل الجهاز"
                            placeholderTextColor="black"
                        />
                    
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('ConnectSteps')}>
                        <Icons.PlusCircleIcon size={23} color="black" style={{ marginRight:15 }} />
                        <Text style={styles.buttonText}>ربط الجهاز</Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
            <BottomNavBar />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    formContainer: {
        flex: 1,
        padding: 20,
        paddingBottom: 100,
    },
    texts: {
        flex: 1,
        paddingHorizontal: 8,
        paddingTop: 8,
        justifyContent: 'center',
        paddingBottom: 64,
    },
    headerText: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 6,
        textAlign: 'center',
    },
    subHeaderText: {
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: themeColors.lightb,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'black',
       // marginLeft: 10,
    },
    input: {
        padding: 15,
        backgroundColor: 'rgba(20, 54, 56, 0.3)',
        borderRadius: 15,
        marginBottom: 20,
        textAlign: 'right',
        marginBottom: 30,
        paddingHorizontal: 30,
    },
});
