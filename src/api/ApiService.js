import axios from "axios";


const fetchData = async () => {
    try {
        const response = await axios.get('http://localhost:3000/map/data');
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

//get 요청 보내기 
fetchData();


// const apiService = axios.create({
//     baseURL: 'http://localhost:3000', // 기본 URL 설정
//     timeout: 1000, 
    

// });
