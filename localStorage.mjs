import { LocalStorage } from 'node-localstorage';
const localstorage = new LocalStorage('./scratch');

export const getLocalStorage = (key) => {
  const localData = localstorage.getItem(key);

  if (!localData) return null;

  return JSON.parse(localData);
};

export const setLocalStorage = (key, value) => {
  localstorage.setItem(key, JSON.stringify(value));
};

export const deleteLocalStorage = (key) => {
  localstorage.removeItem(key);
};
