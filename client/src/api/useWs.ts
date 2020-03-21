import { useState, useEffect, useRef, useMemo } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { API_URL } from '../config'

const useWs = (endpoint: string) => {
  const didUnmount = useRef(false)

  const options = useMemo(
    () => ({
      shouldReconnect: () => {
        return didUnmount.current === false
      },
      reconnectAttempts: 10,
      reconnectInterval: 3000,
    }),
    []
  )

  const [messageHistory, setMessageHistory] = useState<{}[]>([])
  const [_, lastMessage, readyState] = useWebSocket(
    API_URL.replace('http://', 'ws://').replace('https://', 'wss://') +
      endpoint,
    options
  )

  useEffect(() => {
    return () => {
      didUnmount.current = true
    }
  })

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory(m => [...m, JSON.parse(lastMessage.data)])
    }
  }, [lastMessage])

  useEffect(() => {
    console.log(
      `Connection status changed for ${endpoint} to ${ReadyState[readyState]}`
    )
  }, [readyState, endpoint])

  const connectionStatus = () => {
    switch (readyState) {
      case ReadyState.CONNECTING:
        return 'Connecting'
      case ReadyState.OPEN:
        return 'Open'
      case ReadyState.CLOSING:
        return 'Closing'
      case ReadyState.CLOSED:
        return 'Closed'
    }
  }

  return {
    connectionStatus,
    latestData: messageHistory[messageHistory.length - 1],
  }
}

export default useWs
