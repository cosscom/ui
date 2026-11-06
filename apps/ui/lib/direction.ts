export const DIRECTION_STORAGE_KEY = "direction";

// Runs before paint so a saved RTL choice doesn't flash LTR on reload.
export const directionScript = `try{if(localStorage.getItem("${DIRECTION_STORAGE_KEY}")==="rtl")document.documentElement.dir="rtl"}catch{}`;
