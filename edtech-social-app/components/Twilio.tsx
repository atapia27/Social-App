// Twilio Video Chat Component

import React, { useEffect, useRef } from "react"
import * as Video from "twilio-video"

interface TwilioProps {
  token: string
  roomName: string
}

const Twilio: React.FC<TwilioProps> = ({ token, roomName }) => {
  // Connect to a Room
  const connect = async () => {
    Video.connect(token, {
      name: roomName,
      video: { width: 640 },
    })
      .then((room) => {
        console.log(`Successfully joined a Room: ${room.sid}`)
        room.on("participantConnected", (participant) => {
          console.log(`A remote Participant connected: ${participant.sid}`)
        })
      })
      .catch((error) => {
        console.error(`Unable to connect to Room: ${error.message}`)
      })
  }

  useEffect(() => {
    connect()
  }, [token, roomName])

  // Create a LocalVideoTrack
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLDivElement>(null)

  // return the video elements
  return (
    <div>
      <video ref={localVideoRef} autoPlay muted style={{ width: 640 }} />
      <div ref={remoteVideoRef} style={{ display: "flex" }} />
    </div>
  )
}

export default Twilio
