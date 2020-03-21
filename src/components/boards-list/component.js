import React from 'react'
import { map } from 'lodash'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'

import proptypes from './prop-types'
import Board from '../board'

// Styled Component
const BoardContent = styled.div`
  margin-right: 20px;
`

const BoardsList = props => {
  const { boards, error, isLoading, toggleList } = props

  if (error) {
    return <span />
  }
  if (isLoading) {
    return <LinearProgress />
  }

  return (
    <BoardContent>
      <Typography variant="headline" style={{ marginBottom: 20, textAlign: 'center' }}>
        {toggleList}
      </Typography>
      {map(boards, board => (
        <div key={board.board.id}>
          <Board board={board.board} config={board.config} toggleList={toggleList} />
        </div>
      ))}
    </BoardContent>
  )
}
BoardsList.displayName = 'BoardsList'
BoardsList.propTypes = proptypes

export default BoardsList
