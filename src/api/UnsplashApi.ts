import axios from 'axios';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const UNSPLASH_API_URL = 'https://api.unsplash.com/photos/random';

export const fetchWallpapers = async (page: number = 1, perPage: number = 10) => {
    try {
        const randomParam = Math.random();
        const response = await axios.get(UNSPLASH_API_URL, {
            headers: {
                Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
            },
            params: {
                client_id: UNSPLASH_ACCESS_KEY,
                page: page,
                count: perPage,
                random: randomParam
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching wallpapers:', error);
        throw error;
    }
};
