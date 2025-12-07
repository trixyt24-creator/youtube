import axios from "axios";

// Create a central axios instance
const api = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
});

// This is where the magic happens
// We create a function to "inject" the navigate function once React loads
export const setupAxiosInterceptors = (navigate) => {
    api.interceptors.response.use(
        // If the response is successful (2xx), just return it
        (response) => {
            return response;
        },
        // If the response is an error
        (error) => {
            if (error.response) {
                // Check for the 429 Rate Limit error
                if (error.response.status === 429) {
                    console.error("Rate limit exceeded. Navigating...");
                    navigate("/rate-limited"); // Navigate to your rate limit page
                }

                // You could also handle 401 Unauthorized errors here
                if (error.response.status === 401) {
                    navigate("/login");
                }
            }

            // IMPORTANT: Reject the promise so the .catch() in your store still works
            return Promise.reject(error);
        }
    );
};

export default api; // Export the configured axios instance