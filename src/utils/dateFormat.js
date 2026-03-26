export const formattedDate = date => {
    let d = new Date(date);
    let day = d.getDate().toString().padStart(2, '0');
    let month = (d.getMonth() + 1).toString().padStart(2, '0');
    let year = d.getFullYear().toString().padStart(4, '0');

    let formatDate = "";
    formatDate = year + "-" + month + "-" + day;
    return formatDate;
};