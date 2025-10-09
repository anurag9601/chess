import ChessBoard from '@/app/components/chess-board/chessBoard'
import React from 'react'

const page = () => {
  return (
    <div className="chessPlayContainer min-h-screen min-w-screen">
      <ChessBoard />
    </div>
  )
}

export default page