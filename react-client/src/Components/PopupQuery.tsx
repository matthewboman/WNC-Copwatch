import React from 'react'
import { Query } from 'react-apollo'

import TrafficStopPopup from './TrafficStopMap/Popup'
import BulletinPopup from './APDBulletinMap/Popup'

const PopupQuery = ({ id, popupQuery }) => (
  <Query query={popupQuery} variables={{ id }}>
    {({ data, loading, error}) => {
      if (!data) return null
      if (loading) return <span>loading</span>
      if (error) <span>error</span>

      if (data.trafficStop) {
        return <TrafficStopPopup stop={data.trafficStop} />
      }

      if (data.apdBulletin) {
        return <BulletinPopup stop={data.apdBulletin} />
      }

      return 'nothing'
    }}
  </Query>
)

export default PopupQuery
