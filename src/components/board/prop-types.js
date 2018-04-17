import PropTypes from 'prop-types'
import { list } from '../trello-cards-list/prop-types'

export default {
  error: PropTypes.string,
  lists: PropTypes.arrayOf(
    PropTypes.shape({
      list,
      config: PropTypes.object,
    }),
  ),
  isLoading: PropTypes.bool,
}
