import React from 'react'
import Loading from '../atoms/loading/Loading'
import Footer from '../molecules/Footer'

export const PageWrapper = ({ loading = false, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, width: '100%' }}>
    {loading && <Loading />}
    {children}
    <Footer />
  </div>
)
