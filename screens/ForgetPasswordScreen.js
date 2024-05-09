import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Alert } from "react-native";
import { themeColors } from "../theme";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";
import TopNavBar2 from "../navigation/TopNavBar2";

const ForgetPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const navigation = useNavigation();

  const resetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setIsPasswordReset(true);
      // Display success message as an alert
      Alert.alert(
        "إذا كان بريدك الإلكتروني مسجلا لدينا، تم إرسال رابط إعادة تعيين كلمة المرور إليه بنجاح."
      );
    } catch (error) {
      console.error("حدث خطأ، حاول مرة أخرى", error);
      // Handle error if necessary
    }
  };

  return (
    <View style={styles.container}>
      <TopNavBar2 />
      <Text style={styles.title}>استرجاع كلمة المرور</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>ادخل بريدك الالكتروني </Text>
        <TextInput
          style={styles.input}
          placeholder="البريد الالكتروني"
          placeholderTextColor="#fff"
          keyboardType="email-address"
          value={email}
          onChangeText={(e) => setEmail(e)}
        />
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.button}
          disabled={!email}
          onPress={resetPassword}
        >
          <Text style={styles.buttonText}>استرجاع</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.bg,
    paddingHorizontal: 20,
  },
  inputContainer: {
    height: "28%",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    color: "white",
    fontWeight: "300",
    textAlign: "center",
    marginTop: 100,
  },
  input: {
    backgroundColor: "rgba(238,238,238,0.2)",
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    color: "#fff",
    textAlign: "right",
  },
  /*bottomContainer: {
    height: "20%",
    width: "100%",
    position: "absolute",
    bottom: 0,
    paddingHorizontal: 20,
  },*/
  button: {
    backgroundColor: themeColors.lightb,
    padding: 13,
    borderRadius: 8,
    marginTop: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  label: {
    color: "white",
    textAlign: "right",
    marginTop: 16,
  },
});

export default ForgetPasswordScreen;
