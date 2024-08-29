import React, { useState } from 'react';
import styled from 'styled-components';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MainBoardPage.css'; 
import dogIcon1 from '../../../assets/dogicon_1.png';
import dogIcon2 from '../../../assets/dogicon_2.png';
import mainText1 from '../../../assets/mainText_1_remove.png';
import mainText2 from '../../../assets/mainText_2_remove.png';

const MainBoardPage = ({ images, content }) => {
  const cardsPerSlide = 3; // 한 번에 보여줄 카드의 개수
  const totalCards = images.length; // 총 카드 수
  const cardWidth = 18; // 카드 너비(단위: rem)
  const [currentSlide, setCurrentSlide] = useState(0); // 현재 슬라이드 번호
  const [animating, setAnimating] = useState(false); // 애니메이션 상태

  // 다음 슬라이드로 이동 함수
  const nextSlide = () => {
    if (!animating && currentSlide < totalCards - cardsPerSlide) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => prev + 1);
        setAnimating(false);
      }, 500); // 애니메이션 지속 시간
    }
  };

  // 이전 슬라이드로 이동 함수
  const prevSlide = () => {
    if (!animating && currentSlide > 0) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => prev - 1);
        setAnimating(false);
      }, 500); // 애니메이션 지속 시간
    }
  };

  var icon;
  var text;
  if (content === '1') {
    icon = dogIcon1;
    text = mainText1;
  } else {
    icon = dogIcon2;
    text = mainText2;
  }

  return (
    <div 
      className="container d-flex flex-column justify-content-center align-items-center text-center position-relative" 
      style={{
        height: '100vh',  // 화면 높이를 100%로 설정하여 정중앙에 배치
      }}
    >
      {/* 상단 아이콘 및 텍스트 */}
      <img src={icon} alt="강아지 아이콘" className='icon-image' />
      <img src={text} alt="제목" className='text-image' />

      {/* 이미지 카드 그리드 및 좌우 버튼 */}
      <SlideContainer>
        <CircleButton onClick={prevSlide} disabled={currentSlide === 0}>
          &#8249; {/* 왼쪽 화살표 */}
        </CircleButton>
        <GridContainer currentSlide={currentSlide} cardWidth={cardWidth}>
          {images.map((image, index) => (
            <GridItem 
              key={index} 
              isVisible={index >= currentSlide && index < currentSlide + cardsPerSlide}
              isHidden={index < currentSlide || index >= currentSlide + cardsPerSlide}
            >
              <Card>
                <a href={image.link} target="_blank" rel="noopener noreferrer">
                  <CardImage src={image.contentImg} alt={image.title || '이미지'} />
                </a>
                <CardBody>
                  <CardText>{image.title}</CardText>
                </CardBody>
              </Card>
            </GridItem>
          ))}
        </GridContainer>
        <CircleButton onClick={nextSlide} disabled={currentSlide >= totalCards - cardsPerSlide}>
          &#8250; {/* 오른쪽 화살표 */}
        </CircleButton>
      </SlideContainer>
    </div>
  );
};

// 슬라이드 전체 컨테이너: 좌우에 버튼을 배치
const SlideContainer = styled.div`
  display: flex;
  justify-content: space-between; /* 좌우 버튼을 카드 양 옆에 배치 */
  align-items: center;
  width: 100%;
  max-width: 1000px; /* 슬라이드의 전체 너비 */
  margin: 20px 0;
  position: relative;
  z-index: 1;
`;

// 그리드 컨테이너 (카드들이 위치할 공간)
const GridContainer = styled.div`
  display: flex;
  transition: transform 0.5s ease-in-out;
  transform: ${(props) => `translateX(-${(props.currentSlide * props.cardWidth)+(props.currentSlide*1)}rem)`}; 
  /* 카드 하나의 너비(cardWidth)를 기준으로 슬라이드 이동 */
`;

const GridItem = styled.div`
  display: flex;
  justify-content: center;
  margin: 10px; /* 카드 간격 추가 */
  width: 18rem; /* 카드 하나의 고정 너비 */
  transition: opacity 0.5s ease, transform 0.5s ease;
  opacity: ${(props) => (props.isVisible ? 1 : 0)}; /* 카드가 화면에서 사라질 때 점점 투명해짐 */
  transform: ${(props) => (props.isVisible ? 'scale(1)' : 'scale(0.8)')}; /* 카드가 사라지며 작아짐 */
  pointer-events: ${(props) => (props.isHidden ? 'none' : 'auto')}; /* 숨겨진 카드는 클릭 불가 */
`;

const Card = styled.div`
  width: 18rem;
  border-radius: 8px;
  transition: box-shadow 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  background-color: #fff; /* 카드 배경을 흰색으로 설정 */
  margin: 10px; /* 카드 간의 간격 추가 */

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 8px 8px 0 0; /* 상단 모서리만 둥글게 */
`;

const CardBody = styled.div`
  padding: 10px;
`;

const CardText = styled.p`
  margin: 0;
`;

// 원형 버튼 스타일
const CircleButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px; /* 폰트 크기 키움 */
  cursor: pointer;
  position: absolute;
  top: 50%; /* 세로 가운데 정렬 */
  transform: translateY(-50%);
  z-index: 10; /* 카드보다 위에 위치 */
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  /* 왼쪽/오른쪽 버튼 각각 위치 */
  &:nth-child(1) {
    left: -60px; /* 왼쪽 버튼 */
  }
  &:nth-child(3) {
    right: -60px; /* 오른쪽 버튼 */
  }
`;

export default MainBoardPage;
