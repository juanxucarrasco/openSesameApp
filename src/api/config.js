import AsyncStorage from "@react-native-community/async-storage";
import fetchival from "fetchival";
export const config = {
  api: "https://opensesameepici.herokuapp.com"
  // api: "http://staff360api.socialpressplugin.xyz:9000"
  // api: "http://localhost:9000"
};

export const getUserData = async () => {
  let userDataString = await AsyncStorage.getItem("usuario");
  if (userDataString) return JSON.parse(userDataString);
  return null;
};

export const clearStorage = async () => {
  await AsyncStorage.clear();
};

export const fetchApi = async (
  endPoint,
  payload = {},
  method = "get",
  headers = {}
) => {
  let token = await AsyncStorage.getItem("token");
  if (token) {
    // console.log("TOKENNNNN: ", token);
    headers["Authorization"] = `Bearer ${token}`;
  }
  // console.log("HEADERS", headers);
  // console.log("URL", `${config.api}${endPoint}`);
  return fetchival(`${config.api}${endPoint}`, {
    headers: headers
  })[method.toLowerCase()](payload);
};
