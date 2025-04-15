import axios from 'axios';
import qs from 'qs';

const ApiSearchSpotify = async payload => {
  try {
    const { searchTerm, typeSearch } = payload;

    const {
      data: { access_token },
    } = await axios({
      url: process.env.REACT_APP_API_SPOTIFY_CREATE_TOKEN,
      method: 'post',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify({ grant_type: 'client_credentials' }),
      auth: {
        username: `${process.env.REACT_APP_SPOTIFY_CLIENT_ID}`,
        password: `${process.env.REACT_APP_SPOTIFY_CLIENT_SECRET}`,
      },
    });

    const options = {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    };

    const API_URL = `${
      process.env.REACT_APP_API_SPOTIFY
    }search?query=${encodeURIComponent(
      searchTerm,
    )}&type=${typeSearch}&limit=50`;

    const response = await axios.get(API_URL, options);

    return response?.data;
  } catch (error) {}
};

export { ApiSearchSpotify };
