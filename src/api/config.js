import AsyncStorage from "@react-native-community/async-storage";

export const config = {
  api: "https://shielded-thicket-71693.herokuapp.com"
  // api: "http://staff360api.socialpressplugin.xyz:8000"
  // api: "http://localhost:8000"
};

export const getUserData = async () => {
  let userDataString = await AsyncStorage.getItem("user_data");
  if (userDataString) return JSON.parse(userDataString);
  return null;
};

export const fetchApi = async (
  endPoint,
  payload = {},
  method = "get",
  headers = {}
) => {
  let token = await AsyncStorage.getItem("token");
  if (token) {
    console.log("TOKENNNNN: ", token);
    headers["Authorization"] = `Bearer ${token}`;
  }
  //console.log('HEADERS', headers);
  //console.log('URL', `${config.url}${endPoint}`);
  return fetchival(`${config.url}${endPoint}`, {
    headers: headers
  })[method.toLowerCase()](payload);
};
