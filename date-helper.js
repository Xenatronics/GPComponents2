const isWeekend = day => {
    return day % 7 === 0 || day % 7 === 6;
}

const getDayName=(day, date)=>{
    const mydate = new Date(Date.UTC(date.getFullYear(), date.getMonth(),day));
    const options = {weekday: "short"}
    return new Intl.DateTimeFormat("fr-Fr", options).format(mydate);
}
const getMonthName=(date)=>{
    const mydate = new Date(Date.UTC(date.getFullYear(), date.getMonth(),1));
    const options = {monthday: "short"}
    return new Intl.DateTimeFormat("fr-Fr", options).format(mydate);
}

const getNumber= (date) =>{
        return new Date(date.getFullYear(), date.getMonth()+1, -1).getDate()+1;
}

const isToday=(day,date)=>{
    return (day===date.getDate());
}

export {isWeekend}
export {getDayName}
export {getNumber}
export {isToday}