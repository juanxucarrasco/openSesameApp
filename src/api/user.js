import AsyncStorage from "@react-native-community/async-storage";

const loginUser = async (email, password) => {
  fetchApi(
    `/api/users/login/`,
    {
      email,
      password
    },
    "POST"
  )
    .then(response => {
      if (response.error) {
        alert("Error al iniciar sesión, credenciales incorrectas.");
      } else {
        await AsyncStorage.setItem("token", response.token);
        await AsyncStorage.setItem("user_data", JSON.stringify(response.data));
      }
    })
    .catch(function (err) {
      console.log(err);
      //alert("error");
    });
}