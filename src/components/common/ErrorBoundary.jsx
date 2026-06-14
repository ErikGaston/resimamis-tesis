import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.locationKey !== this.props.locationKey && this.state.hasError) {
      this.setState({ hasError: false })
    }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            p: 4,
            gap: 2,
          }}
        >
          <Typography variant="body1" color="error">
            Algo salió mal en esta sección.
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => this.setState({ hasError: false })}
          >
            Reintentar
          </Button>
        </Box>
      )
    }
    return this.props.children
  }
}
