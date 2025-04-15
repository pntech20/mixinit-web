import axios from 'axios';

export const getTokenFromRefreshToken = async (refreshToken: string) => {
  try {
    const baseAPIUrl = process.env.REACT_APP_URL_API;

    const response = await axios.post(`${baseAPIUrl}/v1/auth/refresh`, null, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    return response;
  } catch (error) {
    console.log({ error });
  }
};
