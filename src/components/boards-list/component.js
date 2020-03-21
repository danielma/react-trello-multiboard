import React from 'react'
import { get, map } from 'lodash'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'

import { getBoardName } from '../../utils/get-board-name'

import proptypes from './prop-types'
import { ScrollContainer } from '../styled-components'
import Board from '../board'

// Styled Component
const BoardContent = styled.div`
  flex: 1;
  margin-right: 10px;
`

const BoardsList = props => {
  const { boards, error, isLoading } = props

  if (error) {
    return <span />
  }
  if (isLoading) {
    return <LinearProgress />
  }

  return (
    <ScrollContainer>
      {map(boards, board => {
        const boardName = getBoardName(get(board, 'board.name', ''))
        return (
          <BoardContent key={board.board.id}>
            <Typography variant="headline" style={{ marginBottom: 20, textAlign: 'center' }}>
              {boardName}
            </Typography>
            <Board board={board.board} config={board.config} />
          </BoardContent>
        )
      })}
    </ScrollContainer>
  )
}
BoardsList.displayName = 'BoardsList'
BoardsList.propTypes = proptypes

export default BoardsList
