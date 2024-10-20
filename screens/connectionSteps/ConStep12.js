import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { themeColors } from '../../theme';
import * as Icons from 'react-native-heroicons/outline';

export default function ConStep12() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <SafeAreaView style={styles.navcontainer}>
        <View style={styles.navBar}>
          
          <TouchableOpacity onPress={() => navigation.navigate('Support')} style={styles.support}>
          <Icons.WrenchScrewdriverIcon size={30} color="white" style={styles.iconStyle} />
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
          <Text style={styles.stepTitle}>توصيل الأسلاك</Text>
          </View>
          
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackContainer}>
          <Icons.ArrowRightIcon size="30" color="white" style={styles.iconStyle} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>


      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionTitle}>خطوات التوصيل:</Text>

        <View style={styles.stepContainer}>
          
          <Text style={styles.stepText}>
            قم بتثبيت السلك الأبيض من حزمة الأسلاك إلى شريط الحيادي (يمكنك استخدام برغي أسلاك وسلك إضافي إذا لزم الأمر).
          </Text>
          <Text style={styles.stepNumber}> .1</Text>
        </View>

        <View style={styles.stepContainer}>
          
          <Text style={styles.stepText}>
            قم بإيقاف تشغيل ثلاث قواطع 15A متجاورة عمودياً وإزالة أسلاكها.
          </Text>
          <Text style={styles.stepNumber}> .2</Text>
        </View>

        <View style={styles.stepContainer}>
          
          <Text style={styles.stepText}>
            وصّل أحد أسلاك القاطع إلى السلك الأسود من حزمة الأسلاك وسلك إضافي باستخدام برغي أسلاك.
          </Text>
          <Text style={styles.stepNumber}> .3</Text>
        </View>

        <View style={styles.stepContainer}>
          
          <Text style={styles.stepText}>
            قم بتوصيل السلك الثاني للقاطع إلى السلك الأحمر من حزمة الأسلاك وسلك إضافي باستخدام برغي أسلاك.
          </Text>
          <Text style={styles.stepNumber}> .4</Text>
        </View>

        <View style={styles.stepContainer}>
          
          <Text style={styles.stepText}>
            قم بتوصيل السلك الثالث للقاطع إلى السلك الأزرق من حزمة الأسلاك وسلك إضافي باستخدام برغي أسلاك.
          </Text><Text style={styles.stepNumber}> .5</Text>
        </View>

        <View style={styles.stepContainer}>
          
          <Text style={styles.stepText}>
            قم بتثبيت كل من الأسلاك الإضافية إلى أعمدة القواطع الثلاثة.
          </Text>
          <Text style={styles.stepNumber}> .6</Text>
        </View>

        <View style={styles.imageContainer}>
          <Image 
            source={require('../../assets/images/connectionImages/panel6.png')} 
            style={styles.image} 
          />
        </View>
      </ScrollView>

      {/* Next Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Step13')}
      >
        <Text style={styles.buttonText}>التالي</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.bg,
    justifyContent: 'space-between',
  },
  navcontainer: {
    backgroundColor: '#143638', // Set the main background color
    width: '100%',
    height: 120,
  },

  navBar: {
    flexDirection: 'row',
    alignItems: 'flex-end', // Align items to the bottom vertically
    justifyContent: 'center', // Center items horizontally
    height: 120,
    backgroundColor: '#143638',
    paddingHorizontal: 20,
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  titleContainer: {
     justifyContent: 'center', // Vertically center the content inside the container
     marginBottom: 15,
  },

  stepTitle:{
     fontSize: 18,
  fontWeight: 'bold',
  color: themeColors.lightb,
  },

  flexSpace: {
    flex: 1,
  },

  support: {
    position: 'absolute',
    left: 20,
    bottom: 18,
  },
goBackContainer: {
    position: 'absolute',
    right: 20,
    bottom: 18,
  },
  
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'right',
    marginBottom: 10,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  stepNumber: {
    fontSize: 18,
    color: themeColors.lightb,
    marginRight: 5,
  },
  stepText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'right',
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 250, 
    marginBottom: 20,
    resizeMode: 'contain',  
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themeColors.lightb,
    marginBottom: 30,
    marginHorizontal: 20,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
});

