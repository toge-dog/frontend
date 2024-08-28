/*global kakao*/
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './Kakao.css';
import Modal from './modal';
import MarkerModal from './MarkerModal';
import Matchingmodal from './matchingmodal';
import ExampleModal from './matchingmodal';
import { useAuth } from '../hooks/useAuth';
const axiosInstance = axios.create();
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
  const [isMatching, setIsMatching] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isMatchingActive, setIsMatchingActive] = useState(false);
  const { isLoggedIn } = useAuth();
  const userEmail = localStorage.getItem('email');
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showMarkerModal, setShowMarkerModal] = useState(false);
  const [isCancelModalOpen, setCancelModalOpen] = useState(false);
  const [showExampleModal, setShowExampleModal] = useState(false);
  const openExampleModal = () => setShowExampleModal(true);
  const closeExampleModal = () => setShowExampleModal(false);
  

  const initializeMap = useCallback(() => {
    const container = document.getElementById('map');
    const options = { 
      center: new kakao.maps.LatLng(37.365264512305174, 127.10676860117488),
      level: 4,
    };
    const newMap = new kakao.maps.Map(container, options);
    newMap.setMaxLevel(8);
    setMap(newMap);
  }, []);

  const displayCurrentMarker = useCallback(
    (locPosition) => {
      const imageSrc = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjBP7MfoUaEkIg335-IYcfo4-hN7uEDRnms72umPOUQ_cVS0NaFwUYT0Ea6aRCS6abUCN12d-QoxTFFsF-VK5BARj-aOR5FG1hmWrQuHdRSzFKBxklRq1ZvRSVqs1sRMR6yAQIXfNh7mTgQ/s2000/red.png';
      const imageSize = new kakao.maps.Size(40, 40);
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
            if (currentLocationMarker) {
              currentLocationMarker.setMap(null);
            }

            const newMarker = displayCurrentMarker(currentLocation);
            setCurrentLocationMarker(newMarker);
          }
        },
        (error) => {
          console.error('위치 정보를 가져오는 중 오류 발생:', error);
          setLocation(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      console.error('이 브라우저는 Geolocation을 지원하지 않습니다.');
      setLocation(null);
    }
  }, [map, displayCurrentMarker, currentLocationMarker]);

  const fetchMarkers = useCallback(async () => {
    if (isLoggedIn) {
      try {
        const response = await axios.get('http://localhost:8080/api/markers');
        setMarkers(response.data);
      } catch (error) {
        console.error('마커를 가져오는 중 오류 발생:', error);
      }
    }
  }, [isLoggedIn]);

  const saveMarker = async (latitude, longitude) => {
    if (isLoggedIn) {
      try {
        await axios.post('http://localhost:8080/api/save-marker', {
          latitude,
          longitude,
          userEmail,
        });
      } catch (error) {
        console.error('마커 저장 중 오류 발생:', error);
      }
    }
  };

  const cancelMatching = async () => {
    const userConfirmed = window.confirm('매칭을 취소하시겠습니까?');
    if (userConfirmed) {
      if (isLoggedIn && location) {
        try {
          await axios.patch('http://localhost:8080/matchings', {
            matchStatus: 'MATCH_CANCEL',
          });
          alert('매칭이 취소되었습니다!');
          setIsMatchingActive(false);
          if (customMarker) {
            customMarker.setMap(null);
          }
        } catch (error) {
          console.error('매칭 취소 중 오류 발생:', error);
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
        if (customMarker) {
          customMarker.setMap(null);
        }

        const newCustomMarker = new kakao.maps.Marker({
          map: map,
          position: location,
          image: new kakao.maps.MarkerImage(
            'https://icons.veryicon.com/png/256/application/font-awesome/paw-5.png',
            new kakao.maps.Size(40, 35)
          ),
        });
        alert('매칭이 등록되었습니다!');
        setIsMatchingActive(true);
        setCustomMarker(newCustomMarker);
        saveMarker(lat, lng);
        closeModal();
      } catch (error) {
        console.error('현재 위치 전송 중 오류 발생:', error);
      }
    } else if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
    } else {
      console.warn('현재 위치를 가져올 수 없습니다.');
    }
  };

  const createMarkerAtCurrentLocation = () => {
    if (isLoggedIn && location) {
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
        const markerEmail = marker.email.replace('marker:', '');
        const markerImageSrc = markerEmail === userEmail
          ? 'https://cdn.iconscout.com/icon/premium/png-256-thumb/puppy-3420741-2854815.png?f=webp'
          : 'https://icons.veryicon.com/png/o/animal/pet-it/take-a-walk.png';

        const markerInstance = new kakao.maps.Marker({
          map: map,
          position: position,
          image: new kakao.maps.MarkerImage(
            markerImageSrc,
            new kakao.maps.Size(55, 45)
          ),
        });

        kakao.maps.event.addListener(markerInstance, 'click', () => handleMarkerClick(markerEmail));
      });
    }
  }, [map, markers, isMatching, userEmail]);

  const handleMarkerClick = useCallback(async (markerEmail) => {
    try {
      const response = await axios.get(`http://localhost:8080/matchings/${markerEmail}`);
      setSelectedMarker(response.data);
      setShowMarkerModal(true);
    } catch (error) {
      console.error('마커 세부정보를 가져오는 중 오류 발생:', error);
    }
  }, []);

  const closeMarkerModal = () => {
    setShowMarkerModal(false);
    setSelectedMarker(null);
  };

  const handleMatchStart = () => {
    if (isLoggedIn) {
      setIsMatching(true);
      fetchMarkers();
      getCurrentLocation();
      sendCurrentLocationToBackend();
    } else {
      alert('로그인이 필요합니다.');
      window.location.href = '/login';
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
    fetchMarkers(true);
  };
  
  const rerodeMap = () => {
    setShowModal(false);
    fetchMarkers(true);
    window.location.reload(); 
  };

  useEffect(() => {
    if (showModal) {
      // 모달이 열리는 상태일 때만 상태를 확인하거나 데이터를 처리합니다.
    }
  }, [showModal]);

  const openCancelModal = () => setCancelModalOpen(true);
  const closeCancelModal = () => setCancelModalOpen(false);

  const confirmCancel = () => {
    closeModal();
    cancelMatching();
  };

  return (
    <div className="map-container">
      <div id="map"></div>
   
      {/* <ExampleModal 
    
        show={showExampleModal}
        onClose={closeExampleModal}/> */}
      <Matchingmodal show={showModal} onClose={rerodeMap} title="매칭 정보" />
      <MarkerModal
        show={showMarkerModal}
        onClose={closeMarkerModal}
        markerData={selectedMarker}
      />
      <Modal show={showModal} onClose={closeModal} title="">
        <p className='currentMatching'>
          현재 위치에서 매칭을 시작할까요? 
          <button onClick={closeModal} className='claosModal'> x </button>
        </p>
        <button onClick={sendCurrentLocationToBackend} className='goButton'> 🐶 매칭 신청하기 🐶 </button>
        <button onClick={closeModal} className='laterButton'> 🐶 나중에 하기 🐶 </button>
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
            <div>
              <button onClick={cancelMatching} className="create-marker-button">
                🐶 매칭 취소하기
              </button>
              <Modal isOpen={openCancelModal} onClose={closeCancelModal} onConfirm={confirmCancel} />
            </div>
          ) : (
            <button onClick={createMarkerAtCurrentLocation} className="create-marker-button">
              🐶 매칭 신청하기
            </button>
          )}
        </>
      )}

    </div>
  );
};

export default KakaoMap;
