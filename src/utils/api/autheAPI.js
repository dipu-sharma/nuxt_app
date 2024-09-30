import { useAuthStore } from "@/stores/auth";

export default function () {
  const { token } = useAuthStore();
  const config = useRuntimeConfig();
  // const BASE_URL = config.public.apiUrl;
  const BASE_URL = "http://localhost:8001";
  const loginApi = async (payload) => {
    const { data, error } = await useFetch(`${BASE_URL}/login`, {
      method: "POST",
      body: payload,
    });

    if (error.value) {
      console.error("Error during login:", error.value);
      return error.value.data;
    }
    return data.value;
  };

  const getCorrentUser = async (token) => {
    const { data, error } = await useFetch(`${BASE_URL}/user/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (error.value) {
      console.error("Error fetching user data:", error.value);
      return error.value.data;
    }
    console.log("User data___________________________", data.value);
    return data.value;
  };

  const resetEmployeePassword = async (payload) => {
    const { data, error } = await useFetch(
      `${BASE_URL}/employee/resetEmployeePassword`,
      {
        method: "PUT",
        body: payload, // Ensure payload is passed correctly as body
      }
    );

    if (error.value) {
      console.error("Error fetching data:", error.value);
      return error.value.data; // Return error data
    }
    return data.value; // Return the successful data
  };

  const resetEmployeePasswordByAdmin = async (payload) => {
    const { data, error } = await useFetch(
      `${BASE_URL}/employee/admin/resetEmployeePasswordByAdmin`,
      {
        method: "PUT",
        body: payload, // Ensure payload is passed correctly as body
        headers: { Authorization: `Bearer ${token}` }, // Include token for authorization
      }
    );

    if (error.value) {
      console.error("Error fetching data:", error.value);
      return error.value.data; // Return error data
    }
    return data.value; // Return the successful data
  };

  return {
    loginApi,
    getCorrentUser,
    resetEmployeePassword,
    resetEmployeePasswordByAdmin,
  };
}
