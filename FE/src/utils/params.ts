export const encodeString = (str) => {
    return btoa(encodeURIComponent(str));
};

export const decodeString = (str) => {
    return decodeURIComponent(atob(str));
};
