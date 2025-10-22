import ChessBoard from '@/components/chess-board/chessBoard'
import Players from '@/components/players/Players'
import React from 'react'

const page = () => {
  return (
    <div className="chessPlayContainer min-h-screen min-w-screen flex items-center justify-between px-[10%] py-[20px]">
      <Players />
      <ChessBoard />
    </div>
  )
}

export default page