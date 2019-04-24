import React from 'react'
import { Query } from 'react-apollo'

import TrafficStopPopup from './TrafficStopPopup'
import BulletinPopup from './BulletinPopup'

const PopupQuery = ({ id, popupQuery }) => (
  <Query query={popupQuery} variables={{ id }}>
    {({ data, loading, error}) => {
      if (!data) return null
      if (loading) return <span>loading</span>
      if (error) <span>error</span>

      console.log(data)

      if (data.trafficStop) {
        return <TrafficStopPopup stop={data.trafficStop} />
      }

      if (data.apd_bulletin) {
        return <BulletinPopup stop={data.apd_bulletin} />
      }

      return 'nothing'
    }}
  </Query>
)

export default PopupQuery
