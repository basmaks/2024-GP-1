//GoalComponent.js 

import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';  // Import useNavigation
import GoalProgressBar from '../components/GoalProgressBar'; 
import { deleteGoal, editGoal } from './goalUtils'; 

// Helper function to normalize numbers (e.g., convert Arabic numerals and remove commas)
const normalizeNumber = (value) => {
  const arabicNumbers = { '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9' };
  const englishValue = value.replace(/[٠-٩]/g, (d) => arabicNumbers[d]);

  // Remove commas
  const withoutCommas = englishValue.replace(/,/g, '');

  return withoutCommas;
};

// Add the validateGoalAmount function
const validateGoalAmount = (amount) => {
  const parsedAmount = parseFloat(normalizeNumber(amount));
  if (isNaN(parsedAmount) || parsedAmount < 1 || parsedAmount > 10000) {
    Alert.alert('خطأ', 'الرجاء إدخال قيمة بين 1 و 10,000 ريال سعودي');
    return false;
  }
  return true;
};

const GoalComponent = ({ userId }) => {
  const [goalAmount, setGoalAmount] = useState('');
  const [currentUsage, setCurrentUsage] = useState(0); 
  const [goalAdded, setGoalAdded] = useState(false); 
  const [isEditing, setIsEditing] = useState(false); 
  const [editGoalAmount, setEditGoalAmount] = useState(''); 
  const navigation = useNavigation();  // Use useNavigation to get access to navigation

  // Function to fetch the goal when the screen loads
  const fetchGoal = async () => {
    try {
      console.log("Fetching goal for user:", userId);  
      const response = await fetch(`http://127.0.0.1:8000/api/v1/goals/${userId}`);
      if (response.ok) {
        const data = await response.json();
        console.log("Goal data fetched:", data);  
        setGoalAmount(data.goalAmount.toString());  // Set the goal amount from the fetched data
        setGoalAdded(true);  // Mark that a goal has been added
      } else {
        console.log('No goal found for this user');
        setGoalAdded(false);  // If no goal is found, reset goalAdded
      }
    } catch (error) {
      console.error('Error fetching goal:', error);
    }
  };

  useEffect(() => {
    // Fetch the goal initially when the component mounts
    fetchGoal();
    setCurrentUsage(500); // Mock usage 
  }, []);

  useEffect(() => {
    // Fetch the goal again whenever the screen is focused
    const unsubscribe = navigation.addListener('focus', () => {
      console.log("Screen focused, refetching goal...");
      fetchGoal();
    });

    // Cleanup listener on unmount
    return unsubscribe;
  }, [navigation]);  // Dependency on navigation to ensure listener is set up

  // Function to handle adding a goal
  const addGoal = async () => {
    if (!validateGoalAmount(goalAmount)) {
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/goals/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          goalAmount: parseFloat(normalizeNumber(goalAmount)),
        }),
      });
      const data = await response.json();
      setGoalAdded(true);
      Alert.alert('نجاح', 'تم إضافة الهدف بنجاح');
      fetchGoal();  // Refetch the goal after adding
    } catch (error) {
      console.error('Error adding goal:', error);
      Alert.alert('خطأ', 'فشل في إضافة الهدف');
    }
  };

  // Function to apply the edited goal
  const applyEditedGoal = async () => {
    if (!validateGoalAmount(editGoalAmount)) {
      return;
    }

    try {
      await editGoal(userId, parseFloat(normalizeNumber(editGoalAmount)));
      setGoalAmount(editGoalAmount); 
      setIsEditing(false);
      Alert.alert('نجاح', 'تم تعديل الهدف بنجاح');
      fetchGoal();  // Refetch the goal after editing
    } catch (error) {
      console.error('Error applying goal edit:', error);
      Alert.alert('خطأ', 'فشل في تعديل الهدف');
    }
  };

  // Function to handle deleting the goal
  const handleDeleteGoal = async () => {
    Alert.alert(
      "حذف",
      "هل أنت متأكد أنك تريد حذف هذا الهدف؟",
      [
        { text: "إلغاء", style: "cancel" },
        { text: "حذف", onPress: async () => {
          try {
            await deleteGoal(userId); // Mocked delete function
            setGoalAmount('');  // Clear the goal amount
            setGoalAdded(false);  // Mark that there is no goal set
            Alert.alert('نجاح', 'تم حذف الهدف بنجاح');
          } catch (error) {
            console.error('Error deleting goal:', error);
            Alert.alert('خطأ', 'فشل في حذف الهدف');
          }
        }},
      ],
      { cancelable: true }
    );
  };

  const handleGoalAmountChange = (value) => {
    const normalizedValue = normalizeNumber(value); 
    setGoalAmount(normalizedValue);
  };

  const handleEditGoalAmountChange = (value) => {
    const normalizedValue = normalizeNumber(value); 
    setEditGoalAmount(normalizedValue);
  };

  const handleEditGoal = () => {
    setIsEditing(true); // Set the editing state to true
    setEditGoalAmount(goalAmount); // Set the current goal amount to edit
  };

  return (
    <View style={styles.container}>
  {!goalAdded ? (
    <>
      <View style={styles.goalIntro}>
        <Text style={styles.goalText}>تحديد الهدف الشهري لفاتورة الكهرباء</Text>
      </View>
      <View style={styles.goalContainer}>
        <Text style={styles.goalDescription}>أدخل هدف فاتورتك لهذا الشهر:</Text>
          <TextInput
            style={styles.input}
            placeholder="أدخل المبلغ المستهدف لفاتورة الكهرباء (ر.س.)"
            value={goalAmount}
            keyboardType="numeric"
            onChangeText={handleGoalAmountChange}
          />
          
          {/* Conditionally render the إضافة button when the user starts typing */}
          {goalAmount.length > 0 && (
            <TouchableOpacity style={styles.buttonWithoutIcon} onPress={addGoal}>
              <Text style={styles.buttonText}>إضافة</Text>
            </TouchableOpacity>
  )}
</View>

    </>
  ) : (
    <>
      <View style={styles.goalIntro2}>
        <TouchableOpacity onPress={handleEditGoal}>
          <Image source={require('../assets/icons/editGoal.png')} style={styles.editIcon} />
        </TouchableOpacity>
        <Text style={styles.goalText}>تقدمك نحو الهدف</Text>
      </View>
      <View style={styles.goalContainer}>
        <Text style={styles.goalDescription}>
          هدفك لهذا الشهر هو تقليل فاتورة الكهرباء إلى{' '}
          <Text style={{ fontWeight: 'bold' }}>{goalAmount}</Text>{' '}
          ريال سعودي،{' '}
          بينما بلغ استهلاكك الحالي {' '}
          <Text style={{ fontWeight: 'bold' }}>{currentUsage}</Text>
          {' '}ريال سعودي.
        </Text>

        <GoalProgressBar current={currentUsage} target={parseFloat(normalizeNumber(goalAmount))} style={{ width: 300 }} />

        {currentUsage > goalAmount && (
          <Text style={styles.warningText}>لقد تجاوزت هدفك المحدد لفاتورة الكهرباء</Text>
        )}

        {currentUsage >= goalAmount * 0.9 && currentUsage <= goalAmount && (
          <Text style={styles.warningText}>تنبيه: استهلاكك الحالي يقترب من الهدف المحدد!</Text>
        )}

        {isEditing && (
          <>
            <Text style={styles.goalDescription2}>
              أدخل قيمة الفاتورة المعدلة:
            </Text>
            <TextInput
              style={styles.input}
              placeholder="تعديل قيمة فاتورة الكهرباء المستهدفة (ريال سعودي)"
              value={editGoalAmount}
              keyboardType="numeric"
              onChangeText={handleEditGoalAmountChange}
            />
            <View style={styles.buttonContainer}>
             <TouchableOpacity style={styles.buttonWithIcon} onPress={handleDeleteGoal}>
                <Text style={styles.buttonText}>حذف</Text>
                <Image source={require('../assets/icons/delete.png')} style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonWithIcon} onPress={applyEditedGoal}>
                <Text style={styles.buttonText}>تعديل</Text>
                <Image source={require('../assets/icons/edit.png')} style={styles.icon} />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </>
  )}
</View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  goalIntro: {
    textAlign: 'right',
  },
  goalIntro2: {
    textAlign: 'right',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editIcon: {
    width: 25,
    height: 25,
    marginLeft: 180,
  },
  goalText: {
    textAlign: 'right',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 20,
  },
  goalContainer: {
    backgroundColor: 'rgba(192, 192, 192, 0.4)',
    borderRadius: 20,
    padding: 20,
  },
  goalDescription: {
    fontSize: 16,
    color: '#000',
    textAlign: 'right',
    marginBottom: 10,
  },
  goalDescription2: {
    fontSize: 16,
    color: '#000',
    textAlign: 'right',
    marginBottom: 10,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    textAlign: 'right',
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
  warningText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  icon: {
    width: 20,
    height: 20,
    marginLeft: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',  
    marginTop: 10,
  },
  buttonWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#82C7FA',  
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    marginHorizontal: 20,  
  },
  buttonWithoutIcon: {
    backgroundColor: '#82C7FA',  
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 110,
    justifyContent: 'center',
    alignItems: 'center',  
  },  
  buttonText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },  
});

export default GoalComponent;