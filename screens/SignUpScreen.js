import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView, Platform, StyleSheet } from 'react-native';
import { themeColors } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import DateTimePicker from '@react-native-community/datetimepicker';
import TopNavBar2 from '../navigation/TopNavBar2';
import { useNavigation } from '@react-navigation/native';
import { doc, setDoc,collection, addDoc,query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { KeyboardAvoidingView } from 'react-native';
//import { Picker } from '@react-native-picker/picker';
import CityDropdown from '../components/CityDropdown';
import * as Icons from 'react-native-heroicons/outline';

export default function SignUpScreen() {
    const navigation = useNavigation();
    const [user, setUser]= useState({
        username: '',
        email: '',
        password:'',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        birthdate: '',
        city: '',
    });

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [city, setCity] = useState('');
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [passwordChecklist, setPasswordChecklist] = useState({
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false,
        isLengthValid: false,
    }); 


    const handleSubmit = async () => {
        try {
          // Check for missing fields
          if (!email || !password || !firstName || !lastName || !phoneNumber || !birthdate || !city) {
            Alert.alert('حقول مفقودة', 'يرجى ملء جميع الحقول المطلوبة');
            return;
          }
      
          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            Alert.alert('بريد إلكتروني غير صحيح', 'يرجى استخدام بريد إلكتروني صحيح');
            return;
          }
      
          // Validate phone number format
          if (phoneNumber.length !== 10 || !phoneNumber.startsWith('05')) {
            Alert.alert('رقم هاتف غير صحيح', 'يجب أن يتكون رقم الهاتف من 10 أرقام ويبدأ بـ "05"');
            return;
          }
      
          // Check if phone number is already in use
          const phoneNumberRef = collection(db, 'users');
          const phoneQuerySnapshot = await getDocs(query(phoneNumberRef, where('phoneNumber', '==', phoneNumber)));
          if (!phoneQuerySnapshot.empty) {
            Alert.alert('رقم الجوال مستخدم بالفعل', 'يرجى اختيار رقم جوال آخر.');
            return;
          }
      
          // Check if the username is in English
          const englishRegex = /^[a-zA-Z0-9]+$/;
          if (!englishRegex.test(username)) {
            Alert.alert('اسم المستخدم يجب أن يحتوي على أحرف إنجليزية فقط');
            return;
          }
      
          // Check if the username is available
          const usernameRef = collection(db, 'users');
          const usernameQuerySnapshot = await getDocs(query(usernameRef, where('username', '==', username)));
          if (!usernameQuerySnapshot.empty) {
            Alert.alert('اسم المستخدم مستخدم بالفعل', 'يرجى اختيار اسم مستخدم آخر.');
            return;
          }
      
          // Check password complexity requirements
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
      
          // Create user with email and password
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
          // If user is successfully created, save additional data to Firestore
          if (userCredential && userCredential.user) {
            await addDoc(collection(db, 'users'), {
              uid: userCredential.user.uid,
              firstName,
              lastName,
              username,
              email,
              phoneNumber,
              birthdate,
              city,
            });
      
            // Reset form after successful sign up
            setUsername('');
            setEmail('');
            setPassword('');
            setFirstName('');
            setLastName('');
            setPhoneNumber('');
            setBirthdate('');
            setCity('');
            Alert.alert('تسجيل', 'تم إنشاء الحساب بنجاح');
            navigation.navigate('ConnectScreen');
          }
        } catch (error) {
          console.error('Error creating user:', error.message);
          let errorMessage = error.message;
          if (errorMessage.includes('auth/email-already-in-use')) {
            errorMessage = 'البريد الإلكتروني مستخدم بالفعل';
          } else if (errorMessage.includes('auth/invalid-email')) {
            errorMessage = 'يرجى استخدام بريد إلكتروني صحيح';
          } else if (errorMessage.includes('auth/weak-password')) {
            errorMessage = 'يجب أن تحتوي كلمة المرور على حرف كبير وصغير ورقم ورمز، وتكون على الأقل 8 أحرف';
          }
          Alert.alert('تسجيل', errorMessage);
        }
      };

    const [isCityDropdownVisible, setIsCityDropdownVisible] = useState(false);

    // Function to handle city selection
    const handleCitySelect = (selectedCity) => {
        setCity(selectedCity);
        setIsCityDropdownVisible(false);
    };
    
    // Function to toggle city dropdown visibility
    const toggleCityDropdown = () => {
        setIsCityDropdownVisible(!isCityDropdownVisible);
    };
    

    
    const saudiArabiaCities = [
        'عنيزة',
        'الرياض',
        'جدة',
        'مكة المكرمة',
        'المدينة المنورة',
        'الدمام',
        'الخبر',
        'الطائف',
        'تبوك',
        'بريدة',
        'خميس مشيط',
        'أبها',
        'الجبيل',
        'نجران',
        'الهفوف',
        'ينبع',
        'حائل',
        'القطيف',
        'الأحساء',
        'عرعر',
        'الظهران',
    ];
    
    
    const toggleDatePicker = () => {
        setShowPicker(!showPicker);
    };

    const onChange = ({ type }, selectedDate) => {
        if (type === 'set') {
            const currentDate = selectedDate;
            setDate(currentDate);
            if (Platform.OS === "android") {
                toggleDatePicker();
                setBirthdate(formatDate(currentDate));
            }
        } else {
            toggleDatePicker();
        }
    };

    const confirmIOSDate = () => {
        setBirthdate(formatDate(date));
        toggleDatePicker();
    }

    const formatDate =(rawDate)=>{
        let date = new Date(rawDate);
        let year = date.getFullYear();
        let month = date.getMonth()+1;
        let day = date.getDay();

        month = month < 10 ? `0${month}`: month;
        day = day < 10 ? `0${day}`: day;
        
        return `${day}-${month}-${year}`;
    }
    const calculateMinimumDate = () => {
        const currentDate = new Date();
        const minDate = new Date(currentDate.getFullYear() - 15, currentDate.getMonth(), currentDate.getDate());
        return minDate;
    };
    const handlePasswordChange = (value) => {
        // Update password state
        setPassword(value);
    
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
    
        // Check if all criteria are met
        const isValidPassword = hasValidUppercase && hasLowercase && hasNumber && hasSpecialChar && isLengthValid;
    
        // Update the UI or perform actions based on password validity
        if (!isValidPassword) {
            // Password is not valid, you can show an error message or take appropriate action
        }
    };
    
    
    
    
    

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : null}>
        <View style={styles.container}>
            <TopNavBar2 />
            <ScrollView style={styles.scrollView}>
                <View style={styles.formContainer }>
                    <Text style={styles.label}>الاسم الأول<Text style={styles.required}> *</Text></Text>
                    <TextInput
                        style={styles.input}
                        value={firstName}
                        onChangeText={value => setFirstName(value)}
                        placeholder='ادخل الاسم الأول'
                    />
                    <Text style={styles.label}>الاسم الأخير<Text style={styles.required}> *</Text></Text>
                    <TextInput
                        style={styles.input}
                        value={lastName}
                        onChangeText={value => setLastName(value)}
                        placeholder='ادخل الاسم الأخير'
                    />
                    <Text style={styles.label}>اسم المستخدم<Text style={styles.required}> *</Text></Text>
                    <TextInput
                        style={styles.input}
                        value={username}
                        onChangeText={value => setUsername(value)}
                        placeholder='ادخل اسم المستخدم باللغة الإنجليزية'
                    />
                    <Text style={styles.label}>البريد الالكتروني<Text style={styles.required}> *</Text></Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={value => setEmail(value)}
                        placeholder='ادخل بريدك الالكتروني'
                    />
                 
                    <Text style={styles.label}>كلمة المرور<Text style={styles.required}> *</Text></Text>
                    <TextInput
    style={styles.input}
    secureTextEntry
    value={password}
    onChangeText={handlePasswordChange}
    placeholder='ادخل كلمة المرور'
/>


                        {/* Password checklist */}
                        <View style={styles.passwordChecklist}>
                        <ChecklistItem icon={<Icons.CheckCircleIcon stroke={passwordChecklist.hasUppercase ? 'green' : 'gray'} />} text="يحتوي على حرف كبير" isCompleted={passwordChecklist.hasUppercase} />
<ChecklistItem icon={<Icons.CheckCircleIcon stroke={passwordChecklist.hasLowercase ? 'green' : 'gray'} />} text="يحتوي على حرف صغير" isCompleted={passwordChecklist.hasLowercase} />
<ChecklistItem icon={<Icons.CheckCircleIcon stroke={passwordChecklist.hasNumber ? 'green' : 'gray'} />} text="يحتوي على رقم" isCompleted={passwordChecklist.hasNumber} />
<ChecklistItem icon={<Icons.CheckCircleIcon stroke={passwordChecklist.hasSpecialChar ? 'green' : 'gray'} />} text="يحتوي على رمز خاص" isCompleted={passwordChecklist.hasSpecialChar} />
<ChecklistItem icon={<Icons.CheckCircleIcon stroke={passwordChecklist.isLengthValid ? 'green' : 'gray'} />} text="طوله 8 أحرف على الأقل" isCompleted={passwordChecklist.isLengthValid} />


                        </View>
                    <Text style={styles.label}>رقم الجوال<Text style={styles.required}> *</Text></Text>
                    <TextInput
                        style={styles.input}
                        value={phoneNumber}
                        onChangeText={value => setPhoneNumber(value)}
                        placeholder='05XXXXXXXX'
                    />
                    <Text style={styles.label}>تاريخ الميلاد<Text style={styles.required}> *</Text></Text>
                    {showPicker && (
                        <DateTimePicker
                            mode='date'
                            display='spinner'
                            value={date}
                            onChange={onChange}
                            minimumDate={new Date('1940-1-1')}
                            maximumDate={calculateMinimumDate()}
                            style={styles.datePicker}
                        />
                    )}

                    
                    {showPicker && Platform.OS === "ios" && (
                        <View style={styles.iosCancelButton}>
                            <TouchableOpacity onPress={toggleDatePicker} style={[styles.button,
                            styles.pickerButton,{backgroundColor:'lightgray'}]} >
                                <Text>الغاء</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={confirmIOSDate} style={[styles.button,
                            styles.pickerButton]} >
                                <Text>تأكيد</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {!showPicker && (
                        <TouchableOpacity onPress={toggleDatePicker}>
                            <TextInput
                                style={styles.input}
                                value={birthdate}
                                placeholder='ادخل تاريخ الميلاد'
                                editable={false}
                                onPressIn={toggleDatePicker}
                            />
                        </TouchableOpacity>
                    )}

 

                      <Text style={styles.label}>المدينة<Text style={styles.required}> *</Text></Text>
                      <TouchableOpacity style={styles.input} onPress={toggleCityDropdown}>
                      <Text style={[{ textAlign: 'right' }, {color: city ? 'black' : '#aaa' }]}>{city || 'اختر المدينة'}</Text>
                      </TouchableOpacity>
                      <CityDropdown
                        visible={isCityDropdownVisible}
                        cities={saudiArabiaCities}
                        onSelect={handleCitySelect}
                        onClose={toggleCityDropdown}
                    />
                    
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.buttonText}>إنشاء حساب</Text>
                    </TouchableOpacity>
                    <View style={styles.signInContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.signInText}>تسجيل الدخول</Text>
                    </TouchableOpacity>
                    <Text style={styles.orText}>لديك حساب؟</Text>
                </View>
                </View>
                
            </ScrollView>
        </View></KeyboardAvoidingView>
    );
}
const ChecklistItem = ({ icon, text, isCompleted }) => (
    <View style={[styles.checklistItem, { flexDirection: 'row-reverse' }]}>
        {icon}
        <Text style={[styles.checklistText, { color: isCompleted ? 'green' : 'gray' }]}>{text}</Text>
    </View>
);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themeColors.bg,
        
    },
    scrollView: {
        flex: 1,
        
    },
    formContainer: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingTop: 30,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        paddingBottom:50,
        justifyContent: 'space-around',
        
    },
    label: {
        color: 'black',
        marginRight:15 ,
        textAlign: 'right',
        marginTop:16,
    },
    input: {
        padding: 15,
        backgroundColor: '#f2f2f2',
        color: '#555',
        borderRadius: 8,
        marginBottom: 10,
        textAlign: 'right',
        marginTop:10,
    },
    passwordChecklist: {
        marginTop: 10,
    },
    checklistItem: {
        flexDirection: 'row'},
    button: {
        padding: 15,
        backgroundColor: themeColors.lightb,
        borderRadius: 20,
        marginTop: 25,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'black',
    },
    signInContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25,
    },
    signInText: {
        fontWeight: 'bold',
        color: '#82C8FF',
        textDecorationLine: 'underline',
    },
    orText: {
        color: 'black',
        fontWeight: 'bold',
    },
    iosCancelButton: {
        flexDirection: 'row',
        justifyContent:'space-around',
    },
    pickerButton:{
        paddingHorizontal:20,
    },
    required: {
        color: 'red',
        fontSize: 16,
        marginLeft: 5,
      },
});
