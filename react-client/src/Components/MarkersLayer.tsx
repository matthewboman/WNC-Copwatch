import React from 'react'
import { Marker, Popup } from 'react-leaflet'
import { Query } from 'react-apollo'

import PopupQuery from './PopupQuery'

/**
 * This is different from HeatMap. We don't want to re-render the map with every query.
 */
export default ({
  name,
  query,
  variables,
  popupQuery
}) => (
  <Query query={query} variables={variables}>
    {({ data, loading, error }) => {
      if (!data) return null
      if (loading) return <span>loading</span>
      if (error) return <span>error</span>

      const markers = data[name]

      return markers
        .filter(m => m.geometry != null)
        .map(m => (
          <Marker
            key={m.id}
            position={[ m.geometry.lat as number, m.geometry.lng as number ]}
          >
            <Popup>
               <PopupQuery
                 id={m.id}
                 popupQuery={popupQuery}
               />
            </Popup>
          </Marker>
        ))
    }}
  </Query>
)
