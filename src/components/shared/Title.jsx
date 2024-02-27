import React from 'react'
import { Helmet } from 'react-helmet-async'

const Title = ({title="chat app", discription="this is chat app"}) => {
  return (
    <Helmet>
        <title>{title}</title>
        <meta name='discription' content={discription}/>
    </Helmet>
  )
}

export default Title