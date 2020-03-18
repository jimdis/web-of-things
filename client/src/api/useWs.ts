import { useState, useEffect } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { API_URL } from '../config'

const useWs = (endpoint: string) => {
  const [messageHistory, setMessageHistory] = useState<{}[]>([])
  const [sendMessage, lastMessage, readyState, getWebSocket] = useWebSocket(
    API_URL.replace('http://', 'ws://').replace('https://', 'wss://') + endpoint
  )

  useEffect(() => {
    if (lastMessage !== null) {
      const currentWebsocketUrl = getWebSocket().url
      console.log('received a message from ', currentWebsocketUrl)

      setMessageHistory([...messageHistory, JSON.parse(lastMessage.data)])
    }
  }, [lastMessage])

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
  }[readyState]
  return {
    connectionStatus,
    latestData: messageHistory[messageHistory.length - 1],
  }
}

export default useWs
