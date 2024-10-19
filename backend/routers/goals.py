# goals.py

from fastapi import APIRouter, HTTPException
from datetime import datetime
from pydantic import BaseModel
import calendar
import pytz
from backend.firebase import db
from backend.utils import arabic_days, arabic_months

router = APIRouter()

# Set your local timezone (for Riyadh, use UTC+3)
local_tz = pytz.timezone("Asia/Riyadh")

# Helper function to format dates in Arabic
def format_date_in_arabic(date_obj):
    day_name = date_obj.strftime('%A')
    day = date_obj.strftime('%d')
    month_name = date_obj.strftime('%B')
    year = date_obj.strftime('%Y')

    # Translate to Arabic
    return f"{arabic_days[day_name]}, {day} {arabic_months[month_name]} {year}"

# Helper function to get the last day of the current month at 11:59:59 PM local time
def get_last_day_of_month():
    now = datetime.now(local_tz)  # Get the current time in local timezone
    last_day = calendar.monthrange(now.year, now.month)[1]
    # Set the last day of the month to 11:59:59 PM in local timezone
    end_of_month = datetime(now.year, now.month, last_day, 23, 59, 59)
    return local_tz.localize(end_of_month)  # Ensure the datetime is localized

# Pydantic model to validate incoming request for adding/editing goals
class GoalRequest(BaseModel):
    userId: str
    goalAmount: float

# Helper function to get the last day of the current month at 11:59:59 PM local time
def get_last_day_of_month():
    now = datetime.now(local_tz)  # Get the current time in local timezone
    last_day = calendar.monthrange(now.year, now.month)[1]
    # Set the last day of the month to 11:59:59 PM in local timezone
    end_of_month = datetime(now.year, now.month, last_day, 23, 59, 59)
    return local_tz.localize(end_of_month)  # Ensure the datetime is localized

# Pydantic model to validate incoming request for adding/editing goals
class GoalRequest(BaseModel):
    userId: str
    goalAmount: float
   
# Route to ADD active goal for a user
@router.post("/goals")
async def add_goal(goal_request: GoalRequest):
    try:
        if not (1 <= goal_request.goalAmount <= 10000):
            raise HTTPException(status_code=400, detail="Goal amount must be between 1 and 10,000 SAR")
        
        # Get the last day of the month
        end_date = get_last_day_of_month()
        
        # Prepare goal data
        goal_data = {
            "userId": goal_request.userId,
            "goalAmount": goal_request.goalAmount,
            "startDate": datetime.now(local_tz),  # Set start date with local timezone
            "endDate": end_date,
            "status": "Active"
        }
        
        # Add the goal to the 'goals' collection in Firestore
        goals_ref = db.collection("goals")
        goals_ref.add(goal_data)  # Auto-generates goalId
        
        return {"message": "Goal added successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Route to GET the active goal for a specific user
@router.get("/goals/{userId}")
async def get_goal(userId: str):
    try:
        goals_ref = db.collection("goals").where("userId", "==", userId).where("status", "==", "Active").limit(1)
        goal = goals_ref.stream()

        goal_data = None
        for g in goal:
            goal_data = g.to_dict()

        if not goal_data:
            raise HTTPException(status_code=404, detail="No active goal found")

        return goal_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Route to DELETE a goal for a user
@router.delete("/goals/{userId}")
async def delete_goal(userId: str):
    try:
        goals_ref = db.collection("goals").where("userId", "==", userId).where("status", "==", "Active").limit(1)
        goal = goals_ref.stream()

        goal_id = None
        for g in goal:
            goal_id = g.id

        if not goal_id:
            raise HTTPException(status_code=404, detail="No active goal found")

        # Delete the goal
        db.collection("goals").document(goal_id).delete()
        
        return {"message": "Goal deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Route to EDIT a goal for a user
@router.put("/goals/{userId}")
async def edit_goal(userId: str, goal_request: GoalRequest):
    try:
        if not (1 <= goal_request.goalAmount <= 10000):
            raise HTTPException(status_code=400, detail="Goal amount must be between 1 and 10,000 SAR")
        
        goals_ref = db.collection("goals").where("userId", "==", userId).where("status", "==", "Active").limit(1)
        goal = goals_ref.stream()

        goal_id = None
        for g in goal:
            goal_id = g.id

        if not goal_id:
            raise HTTPException(status_code=404, detail="No active goal found")

        # Update the goal
        db.collection("goals").document(goal_id).update({
            "goalAmount": goal_request.goalAmount,
        })

        return {"message": "Goal updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))