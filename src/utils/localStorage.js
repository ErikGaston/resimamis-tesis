export const getIdVolunteer = () => {
    let dataLocalStorage = JSON.parse(localStorage.getItem('voluntaria'));
    let id = dataLocalStorage !== '' ? dataLocalStorage?.id : '';
    return id;
}

export const getFullNameVolunteer = () => {
    let dataLocalStorage = JSON.parse(localStorage.getItem('voluntaria'));
    return `${dataLocalStorage?.nombre ?? ''} ${dataLocalStorage?.apellido ?? ''}`.trim();
}
