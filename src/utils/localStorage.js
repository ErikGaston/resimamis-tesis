
export const getIdVolunteer = () => {
    let dataLocalStorage = JSON.parse(localStorage.getItem('voluntaria'));
    let id = dataLocalStorage !== '' ? dataLocalStorage?.id : '';
    return id;
}

export const getNameVolunteer = () => {
    let dataLocalStorage = JSON.parse(localStorage.getItem('voluntaria'));
    let nombre = dataLocalStorage !== '' ? dataLocalStorage?.nombre : '';
    return nombre;
}