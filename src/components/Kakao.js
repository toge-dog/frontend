/*global kakao*/
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './Kakao.css';

const KakaoMap = () => {
  const [map, setMap] = useState(null);
  const [location, setLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [isMatching, setIsMatching] = useState(false); // 매칭 버튼을 눌렀는지 여부

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
            displayCurrentMarker(currentLocation, '지금 위치');
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

  // 서버에서 마커 데이터 가져오기
  const fetchMarkers = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/markers');
      setMarkers(response.data);
    } catch (error) {
      console.error('Error fetching markers:', error);
    }
  }, []);

  // 마커 위치를 백엔드로 저장하는 함수
  const saveMarker = async (latitude, longitude) => {
    try {
      await axios.post('http://localhost:8080/api/saveMarker', {
        latitude,
        longitude
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error saving marker:', error);
    }
  };

  // 현재 위치에 마커 생성
  const createMarkerAtCurrentLocation = () => {
    if (location) {
      const lat = location.getLat();
      const lng = location.getLng();

      const marker = new kakao.maps.Marker({
        map: map,
        position: location,
        image: new kakao.maps.MarkerImage(
          'https://cdn.iconscout.com/icon/premium/png-256-thumb/puppy-3420741-2854815.png?f=webp',
          new kakao.maps.Size(40, 35)
        )
      });

      saveMarker(lat, lng);
      fetchMarkers(); // 마커를 추가한 후 모든 마커 다시 가져오기
    } else {
      console.warn('현재 위치를 가져올 수 없습니다.');
    }
  };

  const displayCurrentMarker = useCallback((locPosition, message) => {
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
  }, [map]);

  // 지도에 저장된 마커 표시
  useEffect(() => {
    if (map && markers.length > 0 && isMatching) {
      markers.forEach(marker => {
        const position = new kakao.maps.LatLng(marker.latitude, marker.longitude);
        new kakao.maps.Marker({
          map: map,
          position: position,
          image: new kakao.maps.MarkerImage(
            'https://cdn.iconscout.com/icon/premium/png-256-thumb/puppy-3420741-2854815.png?f=webp',
            new kakao.maps.Size(40, 35)
          )
        });
      });
    }
  }, [map, markers, isMatching]);

  //매칭하러가기 버튼 눌렀을 때   이 때 
  const handleMatchStart = () => {
    setIsMatching(true);
    getCurrentLocation(); 
    fetchMarkers(); 
  };

  // 컴포넌트가 렌더링될 때 지도 초기화하기
  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  const handleReturnToCurrentLocation = () => {
    if (map && location) {
      map.setCenter(location);
    }
  };

  return (
    <div className="map-container">
      <div id="map"></div>
      {!isMatching && (
        <button 
          onClick={handleMatchStart}
          className="start-matching-button"
        >
          매칭하러가기
        </button>
      )}
      {isMatching && (
        <>
          <button 
            onClick={handleReturnToCurrentLocation}
            className="return-current-location"
          >
            🐶 현재 위치로 이동
          </button>
          <button 
            onClick={createMarkerAtCurrentLocation}
            className="create-marker-button"
          >
            매칭 신청하기 
          </button>
        </>
      )}
    </div>
  );
};

export default KakaoMap;
