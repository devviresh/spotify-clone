export const ACCESS_TOKEN = "ACCESS_TOKEN";
export const TOKEN_TYPE = "TOKEN_TYPE";
export const EXPIRES_IN = "EXPIRES_IN";
export const LOADED_TRACKS = "LOADED_TRACKS";

const APP_URL = import.meta.env.VITE_APP_URL;

export const ENDPOINT = {
    userInfo: "me",
    featuredPlaylist: "browse/featured-playlists?limit=8",
    topLists: "browse/categories/toplists/playlists?limit=8",
    playlist: "playlists"

};

export const logout = () => {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(EXPIRES_IN);
  localStorage.removeItem(TOKEN_TYPE);
  window.location.href = import.meta.env.VITE_APP_URL;
};

export const setItemsInLocalStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));
export const getItemFromLocalStorage = (key) => JSON.parse(localStorage.getItem(key));

export const SECTIONTYPE = {
    DASHBOARD: "DASHBOARD",
    PLAYLIST: "PLAYLIST",
}