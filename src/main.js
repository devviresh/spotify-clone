import './style.css'

// document.querySelector('#app').innerHTML = ``

const APP_URL = import.meta.env.VITE_APP_URL

document.addEventListener("DOMContentLoaded", ()=> {
  if (localStorage.getItem("accessToken")){       /*"accessToken" should be ACCESS_TOKEN*/
    window.location.href = `${APP_URL}/dashboard/dashboard.html`;
  } else {
    window.location.href = `${APP_URL}/login/login.html`;
  }
})

