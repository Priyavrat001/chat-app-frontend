import moment from "moment";

const fileFormat = (url = "") => {
    const fileExtension = url.split(".").pop();

    if (fileExtension === "mp4" || fileExtension === "webm" || fileExtension === "ogg") return "video";

    if (fileExtension === "mp4" || fileExtension === "webm") return "audio"

    if (fileExtension === "png" || fileExtension === "jpg" || fileExtension === "jpeg" || fileExtension === "gif") return "image";

    return "file";
}


const transformImage = (url = "", width = 100) => {

    return url;
};

const getLastSevenDays = () => {
    const currentDay = moment();

    const lastSevenDays = [];
    for (let i = 0; i < 7; i++) {
        const dayDate = currentDay.clone().subtract(i, "days");
        const dayName = dayDate.format("dddd");

        lastSevenDays.unshift(dayName)
    }

    return lastSevenDays;
};


const geOrSaveFromStorage = ({ key, value, get }) => {
    // if (get) return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null;
    // else localStorage.setItem(key, JSON.stringify(value));
}

export {
    fileFormat,
    transformImage,
    getLastSevenDays,
    geOrSaveFromStorage
}