import React from 'react'

import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import styled from 'styled-components'

import proptypes from './prop-types'
import UserAvatar from './user-avatar'

const styles = () => ({
  root: {
    padding: '15px !important', // overwrites every padding of CardContent
  },
})

const MemberContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
  text-align: center;
  align-items: center;
`

const Member = props => {
  const { error, isActive, isLoading, member, onClick } = props

  if (error) {
    return <span />
  }
  if (isLoading) {
    return <LinearProgress />
  }

  return (
    <Card
      className={`member_card_${member.id}`}
      style={{
        backgroundColor: isActive ? '#3f51b5' : undefined,
      }}
      onClick={() => onClick()}
    >
      <CardContent className={props.classes.root}>
        <MemberContainer>
          <UserAvatar member={member} />
          <Typography style={{ color: isActive ? '#fff' : undefined, marginLeft: '0.5em' }}>
            {member.username}
          </Typography>
        </MemberContainer>
      </CardContent>
    </Card>
  )
}

Member.propTypes = proptypes
Member.displayName = 'Member'

export default withStyles(styles)(Member)
