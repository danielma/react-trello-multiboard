import React from 'react'
import { get, map } from 'lodash'
import { LinearProgress } from 'material-ui/Progress'
import Typography from 'material-ui/Typography'
import styled from 'styled-components'

import proptypes from './prop-types'
import { getBoardName } from '../../utils/get-board-name'
import Board from '../board'
import { Container } from '../styled-components'

// Styled Component
const BoardContent = styled.div`
  flex: 1;
  margin-right: 10px;
`

const BoardsList = props => {
  const { boards, isLoading, error } = props

  if (error) {
    return <span />
  }
  if (isLoading) {
    return <LinearProgress />
  }

  return (
    <Container>
      {map(boards, (board, idx) => {
        const boardName = getBoardName(get(board, 'board.name', ''))
        return (
          <BoardContent key={idx}>
            <Typography variant="headline">{boardName}</Typography>
            <Board board={board.board} config={board.config} />
          </BoardContent>
        )
      })}
    </Container>
  )
}
BoardsList.displayName = 'BoardsList'
BoardsList.propTypes = proptypes

export default BoardsList
