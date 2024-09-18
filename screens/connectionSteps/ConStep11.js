import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { themeColors } from '../../theme';
import * as Icons from 'react-native-heroicons/outline';

export default function ConStep11() {
  const navigation = useNavigation();

  const instructions = [
    "الأبيض يتصل بالحيادي",
    "الأسود يوفر الطاقة وقياس الجهد",
    "الأزرق والأحمر يمكّنان من قياس الجهد فقط"
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Support')} style={styles.support}>
          <Icons.WrenchScrewdriverIcon size={30} color="white" style={styles.iconStyle} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>توصيل حزمة الأسلاك</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackContainer}>
          <Icons.ArrowRightIcon size={30} color="white" style={styles.iconStyle} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.description}>
          أدخل حزمة الأسلاك لمصدر الطاقة في أسفل جهاز مراقبة الطاقة حتى تنقر في مكانها بأمان. تتيح حزمة الأسلاك قياس الطاقة الأحادية والجهد الثلاثي:
        </Text>
        
        {instructions.map((instruction, index) => (
          <View key={index} style={styles.bulletPointContainer}>
            
            <Text style={styles.instructions}>{instruction}</Text>
            <Text style={styles.bulletPoint}>•</Text>
          </View>
        ))}

        <View style={styles.imageContainer}>
          <Image 
            source={require('../../assets/images/connectionImages/panel5.png')} 
            style={styles.image} 
          />
        </View>
      </ScrollView>

      {/* Next Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Step12')}
      >
        <Text style={styles.buttonText}>التالي</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.bg,
    justifyContent: 'space-between',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 120,
    backgroundColor: '#143638',
    paddingHorizontal: 20,
    width: '100%',
  },
  goBackContainer: {
    padding: 10,
  },
  support: {
    padding: 10,
  },
  iconStyle: {},
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: themeColors.lightb,
    textAlign: 'center',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  bulletPointContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    alignItems: 'center',
  },
  bulletPoint: {
    fontSize: 24,
    color: themeColors.lightb,
    marginLeft: 10,
  },
  description: {
    fontSize: 16,
    color: 'white',
    textAlign: 'right',
    flex: 1,
    marginBottom:10,
  },
  instructions: {
    fontSize: 16,
    color: 'white',
    textAlign: 'right',
    flex: 1,
    
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 300,
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
