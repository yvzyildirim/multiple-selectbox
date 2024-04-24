import React from 'react'
import noDataImage from '../assets/images/no-data.png'

export const InfoBoard = ({ title, description }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center h-full">
      <img src={noDataImage} className="w-[140px]" alt="no-data-found" />
      <span className="text-primary text-xl font-bold mt-3">{title}</span>
      <span className="text-primary text-sm mt-2 w-6/12 text-center">
        {description}
      </span>
    </div>
  )
}
