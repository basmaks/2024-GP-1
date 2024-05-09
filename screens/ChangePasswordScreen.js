//need to add password rules like signup

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../config/firebase'; // Assuming your firebase config is correctly imported
import TopNavBar2 from '../navigation/TopNavBar2';
import BottomNavBar from '../navigation/BottomNavBar';
import { themeColors } from '../theme';
import { EmailAuthProvider, updatePassword, reauthenticateWithCredential } from "firebase/auth"; // Import necessary Firebase auth methods
import * as Icons from 'react-native-heroicons/outline';
import { KeyboardAvoidingView } from 'react-native';

const ChangePasswordScreen = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordChecklist, setPasswordChecklist] = useState({
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isLengthValid: false,
  });
  const navigation = useNavigation();

  const handlePasswordChange = (value) => {
    // Update password state
    setNewPassword(value);

    // Update password checklist
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\|\-=]/.test(value);
    const isLengthValid = value.length >= 8;

    // Ensure at least one uppercase letter is present
    const hasValidUppercase = hasUppercase;

    // Update password checklist state
    setPasswordChecklist({
      hasUppercase: hasValidUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
      isLengthValid,
    });
  };

  const handleChangePasswordPress = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("خطأ", "تأكد من تطابق كلمة المرور");
      return;
    }

    // Check password complexity
    const passwordComplexityMet = passwordChecklist.hasUppercase &&
      passwordChecklist.hasLowercase &&
      passwordChecklist.hasNumber &&
      passwordChecklist.hasSpecialChar &&
      passwordChecklist.isLengthValid;

    if (!passwordComplexityMet) {
      Alert.alert(
        'تسجيل',
        'يجب أن تحتوي كلمة المرور على حرف كبير وصغير ورقم ورمز خاص، وتكون على الأقل 8 أحرف'
      );
      return;
    }

    try {
      const user = auth.currentUser;
      
      // Re-authenticate the user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Change the password
      await updatePassword(user, newPassword);

      Alert.alert("تم بنجاح", "تم تغيير كلمة المرور بنجاح");
      navigation.goBack(); // Navigate back to previous screen
    } catch (error) {
      console.error("خطأ في تغيير كلمة المرور:", error);
      Alert.alert("خطأ", "فشل في تغيير كلمة المرور. يرجى المحاولة مرة أخرى.");
    }
  };


  return (
    <View style={{ flex: 1 }}>
      <TopNavBar2 />

    <View style={styles.container}>
      <View style={styles.greetingContainer}>
      <Text style={styles.greetingText}>تغيير كلمة المرور</Text>
      <Text style={styles.descriptionText}>قم بإدخال البيانات التالية</Text>
  </View>
        <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="كلمة المرور الحالية"
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="كلمة المرور الجديدة"
          value={newPassword}
          onChangeText={handlePasswordChange}
        />
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="تأكيد كلمة المرور الجديدة"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

         {/* Password checklist */}
         <View style={styles.passwordChecklist}>
            <ChecklistItem icon={<Icons.CheckCircleIcon stroke={passwordChecklist.hasUppercase ? 'green' : 'gray'} />} text="يحتوي على حرف كبير" isCompleted={passwordChecklist.hasUppercase} />
            <ChecklistItem icon={<Icons.CheckCircleIcon stroke={passwordChecklist.hasLowercase ? 'green' : 'gray'} />} text="يحتوي على حرف صغير" isCompleted={passwordChecklist.hasLowercase} />
            <ChecklistItem icon={<Icons.CheckCircleIcon stroke={passwordChecklist.hasNumber ? 'green' : 'gray'} />} text="يحتوي على رقم" isCompleted={passwordChecklist.hasNumber} />
            <ChecklistItem icon={<Icons.CheckCircleIcon stroke={passwordChecklist.hasSpecialChar ? 'green' : 'gray'} />} text="يحتوي على رمز خاص" isCompleted={passwordChecklist.hasSpecialChar} />
            <ChecklistItem icon={<Icons.CheckCircleIcon stroke={passwordChecklist.isLengthValid ? 'green' : 'gray'} />} text="طوله 8 أحرف على الأقل" isCompleted={passwordChecklist.isLengthValid} />
          </View>

        <TouchableOpacity style={styles.button} onPress={handleChangePasswordPress}>
          <Text style={styles.buttonText}>تغيير كلمة المرور</Text>
        </TouchableOpacity>
      </View>
      
    </View>
    <BottomNavBar/>

    </View>
  );
};

// Define ChecklistItem component here
const ChecklistItem = ({ icon, text, isCompleted }) => (
  <View style={[styles.checklistItem, { flexDirection: 'row-reverse' }]}>
    {icon}
    <Text style={[styles.checklistText, { color: isCompleted ? 'green' : 'gray' }]}>{text}</Text>
  </View>
);


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
        marginTop:20,
    paddingHorizontal: 20,

  },
  title: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 100,
  },
  input: {
    paddingVertical: 12,
    color: 'black',//new info color
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 20,
    textAlign: 'right',
    paddingHorizontal: 20,
    borderWidth: 1, // Add border width
    borderColor: '#ccc',
  },
  /*button: {
    backgroundColor: themeColors.lightb,
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },*/
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline', // Underline the text,
    color: '#82C8FF',
    paddingVertical: 35,
  },
  greetingContainer: {
    alignItems: 'flex-end', // Align to the right
    paddingTop: 20,
    paddingHorizontal: 20, // Add horizontal padding
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

});

export default ChangePasswordScreen;