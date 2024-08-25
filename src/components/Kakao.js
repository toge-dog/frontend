/*global kakao*/
import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import './Kakao.css';
import Modal from './modal';
import { useAuth } from '../hooks/useAuth';

const axiosInstance = axios.create();
//인터셉터 요청보내기전에 헤더에 토큰 자동 추가 
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

const KakaoMap = () => {
  const [map, setMap] = useState(null);
  const [location, setLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [currentLocationMarker, setCurrentLocationMarker] = useState(null);
  const [customMarker, setCustomMarker] = useState(null);
  const currentLocationMarkerRef = useRef(null);
  const customMarkerRef = useRef(null);
  const [isMatching, setIsMatching] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isMatchingActive, setIsMatchingActive] = useState(false); // Active state of matching
  const { isLoggedIn } = useAuth();
  const userEmail = localStorage.getItem('email');

  const initializeMap = useCallback(() => {
    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(37.365264512305174, 127.10676860117488),
      level: 3,
    };
    const newMap = new kakao.maps.Map(container, options);
    setMap(newMap);
  }, []);

  const displayCurrentMarker = useCallback(
    (locPosition) => {
      const imageSrc = 'https://cdn-icons-png.flaticon.com/512/9909/9909149.png';
      const imageSize = new kakao.maps.Size(40, 35);
      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
      const marker = new kakao.maps.Marker({
        map: map,
        position: locPosition,
        image: markerImage,
      });

      return marker;
    },
    [map]
  );

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

            if (currentLocationMarkerRef.current) {
              currentLocationMarkerRef.current.setMap(null);
            }

            const newMarker = displayCurrentMarker(currentLocation);
            setCurrentLocationMarker(newMarker);
            currentLocationMarkerRef.current = newMarker;
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
  }, [map, displayCurrentMarker]);

  const fetchMarkers = useCallback(async () => {
    if (isLoggedIn) {
      try {
        const response = await axios.get('http://localhost:8080/api/markers');
        setMarkers(response.data);
      } catch (error) {
        console.error('Error fetching markers:', error);
      }
    }
  }, [isLoggedIn]);

  const saveMarker = async (latitude, longitude) => {
    if (isLoggedIn) {
      try {
        await axios.post('http://localhost:8080/api/save-marker', {
          latitude,
          longitude,
          userEmail 
        });
      } catch (error) {
        console.error('Error saving marker:', error);
      }
    }
  };

  const cancelMatching = async () => {
    const userConfirmed = window.confirm('매칭을 취소하시겠습니까?'); // Confirm dialog
  
    if (userConfirmed) {
      if (isLoggedIn && location) {
        try {
          await axios.patch('http://localhost:8080/matchings', {
            matchStatus: 'MATCH_CANCEL',
          });
          alert('매칭이 취소되었습니다!');
          setIsMatchingActive(false); // Set matching to inactive

          // Remove the custom marker if it exists
          if (customMarkerRef.current) {
            customMarkerRef.current.setMap(null);
          }
        } catch (error) {
          console.error('Error canceling matching:', error);
        }
      } else if (!isLoggedIn) {
        alert('로그인이 필요합니다.');
      } else {
        console.warn('현재 위치를 가져올 수 없습니다.');
      }
    } 
  };
  

  const sendCurrentLocationToBackend = async () => {
    if (isLoggedIn && location) {
      try {
        const lat = location.getLat();
        const lng = location.getLng();
        await axios.post('http://localhost:8080/matchings', {
          latitude: lat,
          longitude: lng,
          userEmail 
        });
        alert('매칭이 등록되었습니다!');
        closeModal();
        setIsMatchingActive(true); // Mark matching as active
      } catch (error) {
        console.error('Error sending current location:', error);
      }
    } else if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
    } else {
      console.warn('현재 위치를 가져올 수 없습니다.');
    }
  };

  const createMarkerAtCurrentLocation = () => {
    if (isLoggedIn && location) {
      const lat = location.getLat();
      const lng = location.getLng();

      if (customMarkerRef.current) {
        customMarkerRef.current.setMap(null);
      }

      const newCustomMarker = new kakao.maps.Marker({
        map: map,
        position: location,
        image: new kakao.maps.MarkerImage(
          'https://cdn.iconscout.com/icon/premium/png-256-thumb/puppy-3420741-2854815.png?f=webp',
          new kakao.maps.Size(40, 35)
        ),
      });
      console.log('나 타고있나요?? 1번')
      setCustomMarker(newCustomMarker);
      customMarkerRef.current = newCustomMarker;

      saveMarker(lat, lng);
      fetchMarkers();
      setShowModal(true);
    } else {
      console.warn('현재 위치를 가져올 수 없습니다.');
    }
  };

  useEffect(() => {
    if (map && markers.length > 0 && isMatching) {
      markers.forEach((marker) => {
        const position = new kakao.maps.LatLng(marker.latitude, marker.longitude);
        var marker_email = marker.email.replace('marker:','');
        // "key" : "makers:"
        const markerImageSrc = marker_email === userEmail
        ? 'https://cdn.iconscout.com/icon/premium/png-256-thumb/puppy-3420741-2854815.png?f=webp'
        : 'https://s3.peing.net/t/uploads/user/icon/14456592/1d9c72cc.jpeg';
        console.log('아래 두 줄을 비교할 꺼에요')
        console.log(marker_email)
        console.log(userEmail)
        console.log('-----------------------')
      
        new kakao.maps.Marker({
          map: map,
          position: position,
          image: new kakao.maps.MarkerImage(
            markerImageSrc,
            new kakao.maps.Size(40, 35)
          ),
        });
      });
    }
  }, [map, markers, isMatching, userEmail]);

  const handleMatchStart = () => {
    if (isLoggedIn) {
      setIsMatching(true);
      fetchMarkers();
      getCurrentLocation();
      sendCurrentLocationToBackend();
    } else {
      alert('로그인이 필요합니다.');
      window.location.href = '/login'; // Redirect to the login page
    }
  };

  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  const handleReturnToCurrentLocation = () => {
    if (isLoggedIn && map && location) {
      map.setCenter(location);
      getCurrentLocation();
    } else {
      alert('로그인이 필요합니다.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="map-container">
      <div id="map"></div>
      <Modal show={showModal} onClose={closeModal} title="매칭 정보">
        <p>현재 위치에서 매칭을 시작합니다.</p>
        <button onClick={sendCurrentLocationToBackend}>매칭 신청!</button>
      </Modal>
      {!isMatching && (
        <button onClick={handleMatchStart} className="start-matching-button">
          매칭하러가기
        </button>
      )}
      {isMatching && (
        <>
          <button onClick={handleReturnToCurrentLocation} className="return-current-location">
            🐶 현재 위치로 이동
          </button>
          {isMatchingActive ? (
            <button onClick={cancelMatching} className="create-marker-button">
              매칭 취소하기
            </button>
          ) : (
            <button onClick={createMarkerAtCurrentLocation} className="create-marker-button">
              매칭 신청하기
            </button>
          )}
        </>
      )}
    </div>
  );
};export default KakaoMap;