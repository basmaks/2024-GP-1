import { View, Text, ScrollView } from 'react-native';
import { StyleSheet, Image } from "react-native";
import React from 'react';
import { themeColors } from '../theme';
import TopNavBar from '../navigation/TopNavBar';
import BottomNavBar from '../navigation/BottomNavBar';

export default function RecommendationsScreen() {
  return (
    <View style={{ flex: 1 }}>
      <TopNavBar />
      <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.sugg}>
        <Text style={styles.descriptionText}>اقتراحات</Text>
      </View>
      
      
        <View style={styles.recommendationsContent}>
          <View style={styles.recommendationItem}>
            <Text style={styles.recommendationText}>إغلاق أفياش الكهرباء يقلل ٢٠٪ من استهلاك الطاقة</Text>
            <Image source={require('../assets/icons/recommendations.png')} style={[styles.recommendationIcon, { tintColor: 'yellow' }]} />
          </View>
          <View style={styles.recommendationItem}>
            <Text style={styles.recommendationText}>إغلاق الأجهزة الإلكترونية عند عدم الاستخدام يمكن أن يوفر كميات كبيرة من الطاقة.</Text>
            <Image source={require('../assets/icons/recommendations.png')} style={[styles.recommendationIcon, { tintColor: 'yellow' }]} />
          </View>
          <View style={styles.recommendationItem}>  
            <Text style={styles.recommendationText}>إغلاق أفياش الكهرباء يقلل ٢٠٪ من استهلاك الطاقة</Text>
            <Image source={require('../assets/icons/recommendations.png')} style={[styles.recommendationIcon, { tintColor: 'yellow' }]} />
          </View>
          <View style={styles.recommendationItem}>  
            <Text style={styles.recommendationText}>إغلاق أفياش الكهرباء يقلل ٢٠٪ من استهلاك الطاقة</Text>
            <Image source={require('../assets/icons/recommendations.png')} style={[styles.recommendationIcon, { tintColor: 'yellow' }]} />
          </View>
          <View style={styles.recommendationItem}>
            <Text style={styles.recommendationText}>إغلاق أفياش الكهرباء يقلل ٢٠٪ من استهلاك الطاقة</Text>
            <Image source={require('../assets/icons/recommendations.png')} style={[styles.recommendationIcon, { tintColor: 'yellow' }]} />
          </View>
          <View style={styles.recommendationItem}>
            <Text style={styles.recommendationText}>إغلاق الأجهزة الإلكترونية عند عدم الاستخدام يمكن أن يوفر كميات كبيرة من الطاقة.</Text>
            <Image source={require('../assets/icons/recommendations.png')} style={[styles.recommendationIcon, { tintColor: 'yellow' }]} />
          </View>
        </View>
      </ScrollView>

      <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, 
  },
  recommendationsContent: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  sugg: {
    alignItems: 'flex-end', 
    paddingTop: 20,
    marginHorizontal: 20,
  },
  recommendationItem: {
    backgroundColor: themeColors.bg, 
    padding: 10,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20, 
    marginBottom: 35,
    alignItems: 'center',
    
  },
  recommendationIcon: {
    width: 30,
    height: 30,
    marginLeft: 5,
    
  },
  recommendationText: {
    fontSize: 16,
    //fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'right',
    padding: 7,
    marginLeft: 20,
  },
  descriptionText: {
    fontSize: 20,
    color: '#143638', 
    textAlign: 'right',
    fontWeight: 'bold',

  },
});