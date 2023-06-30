
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

// const baseURL = 'http://10.10.10.193:8082/api';
const baseURL = 'https://cafe-react-native-1-c46da399ea43.herokuapp.com/api';

const cafeApi = axios.create({ baseURL });

cafeApi.interceptors.request.use( //middleware
    async(config) => {
        const token = await AsyncStorage.getItem('token');
        if ( token ) {
            config.headers['x-token'] = token
        }

        return config;
    }
)


export default cafeApi;