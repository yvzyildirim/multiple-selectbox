import React from 'react'
import { VscLoading } from 'react-icons/vsc'

export const Loading = () => {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <VscLoading className="animate-spin text-4xl" />
    </div>
  )
}
