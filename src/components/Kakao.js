/*global kakao*/
import React, { useEffect, useState } from 'react';

const KakaoMap = () => {
  const [map, setMap] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // 지도 초기화 함수
    const initializeMap = () => {
      const container = document.getElementById('map');
      const options = {
        center: new kakao.maps.LatLng(37.365264512305174, 127.10676860117488), // 초기 중심 좌표
        level: 3, // 초기 확대 레벨
      };
      const newMap = new kakao.maps.Map(container, options);
      setMap(newMap); // 상태에 지도 객체 저장
    };

    initializeMap();
  }, []);

  useEffect(() => {
    if (!map) return; // 지도가 초기화되지 않은 경우 반환

    // 현재 위치를 가져오는 함수
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const currentLocation = new kakao.maps.LatLng(lat, lng);
            setLocation(currentLocation); // 상태에 현재 위치 저장
          },
          (error) => {
            console.error('Error fetching location:', error);
            setLocation(null); // 위치 가져오기에 실패한 경우
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
        setLocation(null); // 브라우저가 Geolocation을 지원하지 않는 경우
      }
    };

    getCurrentLocation();
  }, [map]);

  useEffect(() => {
    if (!map || !location) return; //지도도 없고 로케이션도 없을 때 

    // 지도에 마커 띄우기 
    const displayMarker = (locPosition, message) => {
      const imageSrc = 'https://cdn-icons-png.flaticon.com/512/9909/9909149.png'; // 마커 이미지 URL
      const imageSize = new kakao.maps.Size(40, 35); // 마커 이미지 크기
      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

      const marker = new kakao.maps.Marker({
        map: map,
        position: locPosition,
        image: markerImage,
      });

      const iwContent = message; // text 올리는 말풍선
      const iwRemoveable = true; // 인포윈도우 제거 가능 설정

      const infowindow = new kakao.maps.InfoWindow({
        content: iwContent,
        removable: iwRemoveable,
      });

      infowindow.open(map, marker); // 마커 위에 인포윈도우 띄우기 
      map.setCenter(locPosition); // 지도 중심 현재위치로 옮기기 
    };

    const message = '지금 위치'; 
    displayMarker(location, message); // 현재 위치에 마커 표시
  }, [map, location]); // map과 location 상태가 변경될 때마다 실행

  return (
    <div
      id='map'
      style={{ width: '500px', height: '400px' }} // 지도의 크기 설정
    ></div>
  );
};

export default KakaoMap;
