import React from 'react'
import { useBoostQuery } from '../../../hooks/useBoost'

const Banner = () => {
    const { data } = useBoostQuery()
    
  return (
    <div>
      Banner
    </div>
  )
}

export default Banner
