import { useState, useEffect } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { API_URL } from '../config'

const useWs = (endpoint: string) => {
  const [messageHistory, setMessageHistory] = useState<any[]>([])
  const [sendMessage, lastMessage, readyState, getWebSocket] = useWebSocket(
    API_URL.replace('https://', 'wss://').replace('http://', 'wss://') +
      endpoint
  )

  useEffect(() => {
    if (lastMessage !== null) {
      const currentWebsocketUrl = getWebSocket().url
      console.log('received a message from ', currentWebsocketUrl)

      setMessageHistory([...messageHistory, lastMessage])
    }
  }, [lastMessage])

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
  }[readyState]
  return { connectionStatus, messageHistory }
}

export default useWs
