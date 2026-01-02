import axios from "axios";

const useAxiosSecure = () => {
  const axiosSecure = axios.create({
    baseURL: "http://localhost:5000",
  });

  return axiosSecure;
};

export default useAxiosSecure;





// import axios from "axios";

// // Create a single axios instance
// const axiosSecure = axios.create({
//   baseURL: "http://localhost:5000", // your backend
//   withCredentials: true,             // ✅ VERY IMPORTANT: send & receive httpOnly cookies
// });

// // Optional: response interceptor
// // Explanation:
// // - This is not a separate package, it comes with axios automatically
// // - It allows you to "catch" responses globally before they reach your components
// // - Here, we're logging or handling 401/403 globally
// // axiosSecure.interceptors.response.use(
// //   (response) => response, // just pass successful responses
// //   (error) => {
// //     if (error.response?.status === 401 || error.response?.status === 403) {
// //       console.error("Unauthorized or Forbidden");
// //       // Optional: redirect user to login page
// //       // window.location.href = "/login";
// //     }
// //     return Promise.reject(error);
// //   }
// // );

// const useAxiosSecure = () => {
//   return axiosSecure;
// };

// export default useAxiosSecure;

