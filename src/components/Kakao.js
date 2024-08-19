/*global kakao*/
import React, { useEffect, useState, useCallback } from 'react';
import './Kakao.css'; 

const KakaoMap = () => {
  const [map, setMap] = useState(null);
  const [location, setLocation] = useState(null);

  // 지도 초기화 함수
  const initializeMap = useCallback(() => {
    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(37.365264512305174, 127.10676860117488),
      level: 3,
    };
    const newMap = new kakao.maps.Map(container, options);
    setMap(newMap);
  }, []);

  // 현재 위치 가져오기 함수
  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const currentLocation = new kakao.maps.LatLng(lat, lng);
          setLocation(currentLocation);
          if (map) {
            map.setCenter(currentLocation);
          }
        },
        (error) => {
          console.error('Error fetching location:', error);
          setLocation(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setLocation(null);
    }
  }, [map]);

// 마커 
  const displayMarker = useCallback((locPosition, message) => {
    const imageSrc = 'https://cdn-icons-png.flaticon.com/512/9909/9909149.png';
    const imageSize = new kakao.maps.Size(40, 35); 
    const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

    const marker = new kakao.maps.Marker({
      map: map,
      position: locPosition,
      image: markerImage,
    });

    const infowindow = new kakao.maps.InfoWindow({
      content: message,
      removable: true,
    });

    infowindow.open(map, marker);
    map.setCenter(locPosition);
  }, [map]);

  // 랜더링 시 지도 초기화하기
  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  // 현재위치 가져오기 
  useEffect(() => {
    if (map) {
      getCurrentLocation();
    }
  }, [map, getCurrentLocation]);

  // 지도된다면 위치 , 마커 표시하기
  useEffect(() => {
    if (map && location) {
      displayMarker(location, '지금 위치');
    }
  }, [map, location, displayMarker]);


  // 브라우저 크기 변경 시 지도 크기 조정 및 위치 재설정 중요
  useEffect(() => {
    const handleResize = () => {
      if (map && location) {
        map.relayout();
        map.setCenter(location); //중앙 위치 
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [map, location]);


  //지도 돌아갔을 때 현재위치로 돌리기 
  const handleReturnToCurrentLocation = () => {
    if (map && location) {
      map.setCenter(location); // 지도 중심을 현재 위치로 설정
    }
  };

  return (
    <div className="map-container">
      <div
        id='map'z
      ></div>
      <button 
        onClick={handleReturnToCurrentLocation}
        className="return-current-location"
      >
      🐶
      </button>
    </div>
  );
};

export default KakaoMap;
