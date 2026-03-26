import { 
  ERROR_GET_CONFIGURATION,
  ERROR_POST_ADD_CONFIGURATION, 
  ERROR_POST_ATTENTION_TIME, 
  ERROR_POST_CATEGORIES, 
  METHODOS_SERVICES, 
  SUCCES_SAVE_ADD_CONFIGURATION, 
  SUCCES_SAVE_ATTENTION_TIME,
  SUCCES_SAVE_CATEGORIES
} from "../helpers/const";

import { 
  URL_GET_CONFIGURATION, 
  URL_POST_ADD_CONFIGURATION, 
  URL_POST_ATTENTION_TIME, 
  URL_POST_BUSINESS_CAREGORIES
} from "../helpers/urls";


export const fetchPostAddBusinessConfiguration = async (body, user) => {
  const { token } = user;

  const res =  await fetch(URL_POST_ADD_CONFIGURATION, {
    method: METHODOS_SERVICES.POST,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
    body: JSON.stringify(body),
  })

  if(!res.ok){
    throw ({error:true, status:res.status, message:ERROR_POST_ADD_CONFIGURATION})
  }
  const data = await res.json()
  return {...data, status: res.status, error:false, message:SUCCES_SAVE_ADD_CONFIGURATION}
}



export const fetchGetBusinessConfiguration = async (user) => {
  const { token, business } = user;

  const res =  await fetch(`${URL_GET_CONFIGURATION}?business=${business}`, {
    method: METHODOS_SERVICES.GET,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    }
  })

  if(!res.ok){
    throw ({error:true, status:res.status, message:ERROR_GET_CONFIGURATION})
  }
  const data = await res.json()
  return {...data, status: res.status, error:false}
}

export const fetchPostAttentionTime = async (body, user) => {
  const { token } = user;

  const res =  await fetch(URL_POST_ATTENTION_TIME, {
    method: METHODOS_SERVICES.POST,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
    body: JSON.stringify(body),
  })

  if(!res.ok){
    throw ({error:true, status:res.status, message:ERROR_POST_ATTENTION_TIME})
  }
  const data = await res.json()
  return {...data, status: res.status, error:false, message:SUCCES_SAVE_ATTENTION_TIME}
}

export const fetchPostBusinessCategory = async (body, user) => {

  const { token } = user;  

  const res =  await fetch(URL_POST_BUSINESS_CAREGORIES, {
    method: METHODOS_SERVICES.POST,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
    body: JSON.stringify(body),
  })

  if(!res.ok){
    throw ({error:true, status:res.status, message:ERROR_POST_CATEGORIES})
  }
  const data = await res.json()
  return {...data, status: res.status, error:false, message:SUCCES_SAVE_CATEGORIES}
}