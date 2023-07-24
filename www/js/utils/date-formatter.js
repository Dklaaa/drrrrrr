const formattedDate = (date) => {

    let timeStamp;
    let formatted;

    date ? timeStamp = new Date(date._seconds * 1000) : timeStamp = new Date()

    formatted = ("0" + timeStamp.getDate()).slice(-2) + 
                "-" + 
                ("0" + (timeStamp.getMonth() + 1)).slice(-2) + 
                "-" +
                timeStamp.getFullYear() + 
                " @ " + 
                ("0" + timeStamp.getHours()).slice(-2) 
                + ":" 
                + ("0" + timeStamp.getMinutes()).slice(-2);

    return formatted;

}