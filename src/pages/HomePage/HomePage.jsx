import React from 'react'
import styled from 'styled-components'
import banner from '../../assets/banner.jpg'

const HomePage = () => {
  return (
    <div>
      <BannerImage src={banner} alt="Home Banner" />
    </div>
  )
}

const BannerImage = styled.img`
  width: 100%;
  max-height: 600px;
  object-fit: cover;
  margin-top: 100px;
`

export default HomePage
