import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import axios from 'axios'; // axios import
import banner from '../../assets/main_banner2.png';
import background1 from '../../assets/bg_1.png';
import background2 from '../../assets/bg_2.png';
import KakaoMap from '../../components/Kakao';
import { useAuth } from '../../hooks/useAuth'; 
import MainBoardPage from './components/MainBoardPage'; // MainBoardPage import

const safelyParseJSON = (jsonString) => {
  try {
    return jsonString ? JSON.parse(jsonString) : null;
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return null;
  }
};

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [pet, setPet] = useState(null);
  const [photoData, setPhotoData] = useState([]); // 자랑 사진 데이터를 저장할 상태
  const [announcement, setAnnouncementData] = useState([]); // 공지 사진 데이터를 저장할 상태
  const { isLoggedIn, logout } = useAuth(); 

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const petStr = localStorage.getItem('pet');
    setUser(safelyParseJSON(userStr));
    setPet(safelyParseJSON(petStr));

    // 사진 데이터 GET 요청
    const fetchPhotos = async () => {
      try {
        const response = await axios.get('http://localhost:8080/boards?type=boast&page=1&size=10');  // 실제 API 엔드포인트로 대체
        const data = response.data.data; // 서버에서 받은 data 배열

        // contentImg와 title만 추출해서 새로운 배열 생성
        const filteredData = data.map((item) => ({
          contentImg: item.contentImg, // 이미지
          title: item.title,           // 제목
          link: 'http://localhost:3000/boards/boast/'+item.boardId,
        }));

        setPhotoData(filteredData); // 상태에 저장
      } catch (error) {
        console.error('사진 데이터를 가져오는 중 오류 발생:', error);
      }
      try {
        const response = await axios.get('http://localhost:8080/boards?type=announcement&page=1&size=10');  // 실제 API 엔드포인트로 대체
        const data = response.data.data; // 서버에서 받은 data 배열

        // contentImg와 title만 추출해서 새로운 배열 생성
        const filteredData = data.map((item) => ({
          contentImg: item.contentImg, // 이미지
          title: item.title,           // 제목
          link: 'http://localhost:3000/boards/announcement/'+item.boardId,
        }));

        setAnnouncementData(filteredData); // 상태에 저장
      } catch (error) {
        console.error('사진 데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchPhotos();
  }, []);

  return (
    <FullPageContainer>
      <BannerImage src={banner} alt="Home Banner" />
      <Wrap1>
        <KakaoMap style={{ zIndex: 1 }} />
      </Wrap1>
      <Wrap2 background={background1}>
        <MainBoardPage 
          images={photoData} 
          content='1'
        />
      </Wrap2>
      <Wrap2 background={background2}>
        <MainBoardPage 
          images={announcement} 
          content='2'
        />
      </Wrap2>
    </FullPageContainer>
  );
};

const FullPageContainer = styled.div`
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
  height: 100vh;
`;

const Wrap1 = styled.div`
  background-color: #9fc362;
  height: 100vh;
  justify-content: center;
  align-items: center;
  scroll-snap-align: start;
`;

const BannerImage = styled.img`
  width: 100%;
  height: 100vh;
  object-fit: cover;
  margin-top: 0px;
  scroll-snap-align: start;
`;

const Wrap2 = styled.div`
  background-image: url(${(props) => props.background});
  background-size: 100%;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh;
  object-fit: cover;
  margin-top: 0px;
  scroll-snap-align: start;
`;

export default HomePage;
