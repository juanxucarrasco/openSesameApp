import AsyncStorage from "@react-native-community/async-storage";
import { fetchApi } from "./config";

export const loginUser = async (email, password) => {
  return fetchApi(
    `/api/users/login/`,
    {
      email,
      password
    },
    "POST"
  ).then(async response => {
    if (!response.error) {
      await AsyncStorage.setItem("token", response.token);
      await AsyncStorage.setItem("usuario", JSON.stringify(response.data));
    }
    return response;
  });
};

export const isValidateTime = async () => {
  return fetchApi(`/api/users/data/isValidTime`);
};
