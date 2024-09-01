
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../config/firebase'; // Assuming your firebase config is correctly imported
import TopNavBar2 from '../navigation/TopNavBar2';
import BottomNavBar from '../navigation/BottomNavBar';
import { themeColors } from '../theme';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Import Firestore functions

export default function ContactUsScreen() {

    const navigation = useNavigation();
    const [message, setMessage] = useState(""); // State to hold the message entered by the user

    const db = getFirestore();

    const sendMessageToFirestore = async () => {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          console.error("User not authenticated");
          return;
        }
    
        const userId = currentUser.uid;
        //const username = currentUser.usrname;
        const userEmail = currentUser.email;
    
        // Add message to Firestore collection along with user information
        await addDoc(collection(db, 'messages'), {
          userId,
          //username,
          userEmail,
          message: message.trim(),
          timestamp: serverTimestamp(),
        });

          Alert.alert("تم بنجاح", "تم إرسال رسالتك بنجاح!");
          setMessage(""); // Clear message input
      } catch (error) {
        console.error("خطأ في إرسال الرسالة:", error);
        Alert.alert("خطأ", "فشل في إرسال الرسالة. الرجاء المحاولة مرة أخرى.");
      }
  };

    return (
      <View style={{ flex: 1 }}>
      <TopNavBar2 />

    <View style={styles.container}>
      <View style={styles.greetingContainer}>
      <Text style={styles.greetingText}>تواصل معنا</Text>
      <Text style={styles.descriptionText}>قم بإدخال رسالتك وسوف يتم الرد عليك في أقرب وقت</Text>
  </View>
      <TextInput
                    style={styles.input}
                    multiline
                    numberOfLines={4}
                    placeholder="أكتب رسالتك هنا"
                    value={message}
                    onChangeText={setMessage}
                />
                <TouchableOpacity style={styles.button} onPress={sendMessageToFirestore}>
                    <Text style={styles.buttonText}>إرسال الرسالة</Text>
                </TouchableOpacity>
    </View>
    <BottomNavBar/>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20, // Add horizontal padding
  },

  greetingContainer: {
    alignItems: 'flex-end', // Align to the right
    paddingTop: 20,
  },
  
  greetingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#143638',
    
  },
  
  descriptionText: {
    fontSize: 16,
    color: '#143638', // Adjust color as needed
    marginTop: 15,
  
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 20,
    textAlignVertical: 'top',
    textAlign: 'right',
    height: 260,
    paddingTop: 5,
    marginBottom: 30,
},
/*button: {

    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
},*/
buttonText: {
  textAlign: 'center',
  fontSize: 16,
  fontWeight: 'bold',
  textDecorationLine: 'underline', // Underline the text,
  color: '#82C8FF',
  paddingVertical: 35,
},

});
