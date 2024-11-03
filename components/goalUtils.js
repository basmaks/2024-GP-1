export const deleteGoal = async (userId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/goals/${userId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      console.log('Goal deleted:', data);
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };
  
  export const editGoal = async (userId, newGoalAmount) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/goals/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,  // Include the userId here
          goalAmount: parseFloat(newGoalAmount),  // Ensure the goal amount is parsed to a float
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error editing goal:", errorData);
        return;
      }
  
      const data = await response.json();
      console.log('Goal edited:', data);
    } catch (error) {
      console.error('Error editing goal:', error);
    }
  };  
   
  