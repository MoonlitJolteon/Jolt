module.exports = {
    numToDay(dayNum, shortened) {
        switch(dayNum) {
            case 0: return shortened ? "Sun" : "Sunday";
            case 1: return shortened ? "Mon" : "Monday";
            case 2: return shortened ? "Tue" : "Tuesday";
            case 3: return shortened ? "Wed" : "Wednesday";
            case 4: return shortened ? "Thu" : "Thursday";
            case 5: return shortened ? "Fri" : "Friday";
            case 6: return shortened ? "Sat" : "Saturday";
        }
    },

    numToMonth(monthNum, shortened) {
        switch(monthNum) {
            case 0: return shortened ? "Jan" : "January";
            case 1: return shortened ? "Feb" : "February";
            case 2: return shortened ? "Mar" : "March";
            case 3: return shortened ? "Apr" : "April";
            case 4: return shortened ? "May" : "May";
            case 5: return shortened ? "Jun" : "June";
            case 6: return shortened ? "Jul" : "July";
            case 7: return shortened ? "Aug" : "August";
            case 8: return shortened ? "Sep" : "September";
            case 9: return shortened ? "Oct" : "October";
            case 10: return shortened ? "Nov" : "November";
            case 11: return shortened ? "Dec" : "December";
        }
    }
}