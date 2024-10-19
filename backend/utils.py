# Arabic translation dictionaries for day and month names
arabic_days = {
    'Monday': 'الإثنين',
    'Tuesday': 'الثلاثاء',
    'Wednesday': 'الأربعاء',
    'Thursday': 'الخميس',
    'Friday': 'الجمعة',
    'Saturday': 'السبت',
    'Sunday': 'الأحد'
}

arabic_months = {
    'January': 'يناير',
    'February': 'فبراير',
    'March': 'مارس',
    'April': 'أبريل',
    'May': 'مايو',
    'June': 'يونيو',
    'July': 'يوليو',
    'August': 'أغسطس',
    'September': 'سبتمبر',
    'October': 'أكتوبر',
    'November': 'نوفمبر',
    'December': 'ديسمبر'
}

# Function to format dates in Arabic
def format_date_in_arabic(date_obj):
    day_name = date_obj.strftime('%A')
    day = date_obj.strftime('%d')
    month_name = date_obj.strftime('%B')
    year = date_obj.strftime('%Y')

    # Translate to Arabic
    return f"{arabic_days[day_name]}, {day} {arabic_months[month_name]} {year}"