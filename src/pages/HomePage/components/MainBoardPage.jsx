import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MainBoardPage.css'; // 애니메이션을 위한 CSS

const images = [
  {
    src: 'https://via.placeholder.com/300x200',
    caption: '[1] 2023년 올해의 TOPS 영상',
    link: 'https://example.com/tops-video-2023',
  },
  {
    src: 'https://via.placeholder.com/300x200',
    caption: '[2] 산책 베테랑 우수 영상',
    link: 'https://example.com/veteran-walk-video',
  },
  {
    src: 'https://via.placeholder.com/300x200',
    caption: '[3] 조화로운 TOPS 사진',
    link: 'https://example.com/tops-photo',
  },
  {
    src: 'https://via.placeholder.com/300x200',
    caption: '[4] 행복한 멍멍이 순간',
    link: 'https://example.com/happy-dog-photo',
  },
  {
    src: 'https://via.placeholder.com/300x200',
    caption: '[5] 귀여운 강아지들',
    link: 'https://example.com/cute-dogs-video',
  },
  {
    src: 'https://via.placeholder.com/300x200',
    caption: '[6] 산책하는 강아지',
    link: 'https://example.com/walking-dog-photo',
  },
  {
    src: 'https://via.placeholder.com/300x200',
    caption: '[7] 행복한 멍멍이 순간',
    link: 'https://example.com/happy-dog-photo',
  },
  {
    src: 'https://via.placeholder.com/300x200',
    caption: '[8] 귀여운 강아지들',
    link: 'https://example.com/cute-dogs-video',
  },
  {
    src: 'https://via.placeholder.com/300x200',
    caption: '[9] 산책하는 강아지',
    link: 'https://example.com/walking-dog-photo',
  },
];

const MainPage = () => {
  const cardsPerSlide = 3; // 한 번에 보여줄 카드의 개수
  const totalCards = images.length; // 총 카드 수
  const [currentSlide, setCurrentSlide] = useState(0); // 현재 슬라이드 번호

  // 이전 슬라이드로 이동하는 함수
  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // 다음 슬라이드로 이동하는 함수
  const nextSlide = () => {
    if (currentSlide < totalCards - cardsPerSlide) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  // 현재 보여줄 이미지 슬라이드를 추출 (항상 3개를 보여줌)
  const visibleImages = images.slice(currentSlide, currentSlide + cardsPerSlide);

  return (
    <div className="container mt-5 text-center position-relative">
      {/* 상단 텍스트 */}
      <h1>함께 자랑해요</h1>
      <p className="text-muted">함께걸에서 멍멍이와의 소중한 추억을 자랑해요</p>

      {/* 이전/다음 버튼 */}
      <button className="btn btn-primary prev-btn" onClick={prevSlide} disabled={currentSlide === 0}>
        이전
      </button>

      {/* 이미지 카드 그리드 */}
      <div className="d-flex justify-content-center" style={{ overflow: 'hidden' }}>
        {visibleImages.map((image, index) => (
          <div
            className="mb-3 d-flex justify-content-center"
            key={index}
            style={{ margin: '0 20px' }}  // 카드들 사이에 간격 설정
          >
            <div className="card mx-auto" style={{ width: '18rem' }}>
              <a href={image.link} target="_blank" rel="noopener noreferrer">
                <img src={image.src} className="card-img-top" alt="강아지 사진" />
              </a>
              <div className="card-body">
                <p className="card-text">{image.caption}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        className="btn btn-primary next-btn"
        onClick={nextSlide}
        disabled={currentSlide >= totalCards - cardsPerSlide}
      >
        다음
      </button>
    </div>
  );
};

export default MainPage;
