import { useState, useEffect } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { API_URL } from '../config'

const useWs = (endpoint: string) => {
  const [messageHistory, setMessageHistory] = useState<{}[]>([])
  const [_, lastMessage, readyState] = useWebSocket(
    API_URL.replace('http://', 'ws://').replace('https://', 'wss://') + endpoint
  )

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
