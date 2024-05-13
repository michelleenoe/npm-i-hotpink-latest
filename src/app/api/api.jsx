// api.jsx
const URL = process.env.NEXT_PUBLIC_LOCAL_URL;


export const fetchAPI = async (endpoint) => {
  const url = `${baseURL}${endpoint}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
};
