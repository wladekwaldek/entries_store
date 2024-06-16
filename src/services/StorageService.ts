import { Category, Entry } from "../types/Types";

export const KEYS = {
  categories: "categories",
  password: "password",
  isChecked: "isChecked",
};

export const getAllData = () => {
  const allData: any[] = [];
  const categoriesList = getCategories();
  const categoriesListObj = { [KEYS.categories]: categoriesList };
  allData.push(categoriesListObj);

  const categoriesId = categoriesList.map((category: Category) => category.id);
  categoriesId.map((categoryId: string) => {
    const data = getEntries(categoryId);
    const entriesListObj = { [categoryId]: data };
    allData.push(entriesListObj);
  });
  return allData;
};

// export const setAllData = async (data: any[]) => {
//   try {
//     await removeAllExcept([KEYS.password, KEYS.isChecked]);
//     const promises = data.map(async (obj: any) => {
//       const key = Object.keys(obj)[0];
//       const value = obj[key];
//       localStorage.setItem(key, JSON.stringify(value));
//       console.log(`Saved data for key: ${key}`);
//     });
//     await Promise.all(promises);
//     console.log("All data saved successfully");
//   } catch (e) {
//     console.error("Error setting all data:", e);
//   }
// };

// async function removeAllExcept(keysToKeep: string[]) {
//   try {
//     const allKeys = localStorage.getAllKeys();
//     const keysToRemove = allKeys.filter(
//       (key: any) => !keysToKeep.includes(key)
//     );
//     await localStorage.multiRemove(keysToRemove);
//     console.log("Keys removed successfully");
//   } catch (error) {
//     console.error("Error removing keys:", error);
//   }
// }

export const generateId = () => {
  return (
    Math.random().toString(36).substring(2) +
    Math.random().toString(36).substring(2)
  );
};

export const getCategories = () => {
  const categoriesList: Category[] = JSON.parse(
    localStorage.getItem(KEYS.categories) || "[]"
  );
  return categoriesList;
};

export const addCategory = (category: Category) => {
  const categoriesList = getCategories();
  localStorage.setItem(
    KEYS.categories,
    JSON.stringify([...categoriesList, category])
  );
};

export const deleteCategory = (category: Category) => {
  const categoriesList = getCategories();
  const newList = categoriesList.filter((item) => item.id !== category.id);
  localStorage.setItem(KEYS.categories, JSON.stringify(newList));
  localStorage.removeItem(category.id);
};

export const editCategory = (category: Category, newCategoryName: string) => {
  const categoriesList = getCategories();
  const newList = categoriesList.map((item: Category) =>
    item.id === category.id ? { ...item, category_name: newCategoryName } : item
  );
  localStorage.setItem(KEYS.categories, JSON.stringify(newList));
};

export const getEntries = (categoryId: string) => {
  const entriesList: Entry[] = JSON.parse(
    localStorage.getItem(categoryId) || "[]"
  );
  return entriesList;
};

export const getEntry = (categoryId: string, id: string) => {
  const entriesList = getEntries(categoryId);
  const entry = entriesList.find((item: Entry) => item.id === id);
  return entry;
};

export const addEntry = (entry: Entry, categoryId: string) => {
  const entriesList = getEntries(categoryId);
  localStorage.setItem(categoryId, JSON.stringify([entry, ...entriesList]));
};

export const updateEntries = (id: string, entry: Entry, categoryId: string) => {
  const entriesList = getEntries(categoryId);
  const newList = entriesList.map((item: Entry) =>
    item.id === id ? entry : item
  );
  localStorage.setItem(categoryId, JSON.stringify(newList));
};

export const deleteEntry = (id: string, categoryId: string) => {
  const entriesList = getEntries(categoryId);
  const newList = entriesList.filter((item: Entry) => item.id !== id);
  localStorage.setItem(categoryId, JSON.stringify(newList));
};

export const getPassword = () => {
  const data = localStorage.getItem(KEYS.password);
  return data;
};

export const setPassword = (value: string) => {
  localStorage.setItem(KEYS.password, value);
};

export const storageGetIsChecked = () => {
  const data = localStorage.getItem(KEYS.isChecked);
  return data;
};

export const storageSetIsChecked = () => {
  localStorage.setItem(KEYS.isChecked, "true");
};

export const storageDeleteIsChecked = () => {
  localStorage.removeItem(KEYS.isChecked);
};
