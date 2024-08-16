import React from 'react'
import { useParams } from 'react-router-dom';
import AnnouncementPage from '../Announcement/AnnouncementPage';
import ReviewPage from '../Review/ReviewPage';
import NotFoundPage from '../ErrorPage/NotFoundPage';
import BoostPage from '../Boost/BoostPage';
import InquiryPage from '../Inquiry/InquiryPage';

const BoardPage = () => {
  const { boardType } = useParams();

  const renderBoardComponent = () => {
    switch(boardType) {
      case 'A':
        return <AnnouncementPage />;
      case 'B':
        return <BoostPage />;
      case 'I':
        return <InquiryPage />;
      case 'R':
        return <ReviewPage />;
      default:
        return <NotFoundPage />;
    }
  }

  return (
    <div>
      {renderBoardComponent()}
    </div>
  )
}

export default BoardPage