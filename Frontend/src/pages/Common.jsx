import { useEffect, useRef, useState } from "react";

const ROOM_ID = "global-room";

export function Common() {
  const [text, setText] = useState("");
  const wsRef = useRef(null);
  const pcRef = useRef(null);
  const channelRef = useRef(null);
  const isCaller = useRef(false);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/ws/${ROOM_ID}`);
    wsRef.current = ws;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    pcRef.current = pc;

    pc.ondatachannel = (e) => {
      channelRef.current = e.channel;
      e.channel.onmessage = (ev) => setText(ev.data);
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        ws.send(JSON.stringify({ type: "ice", candidate: e.candidate }));
      }
    };

    ws.onmessage = async (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "offer") {
        await pc.setRemoteDescription(msg.offer);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        ws.send(JSON.stringify({ type: "answer", answer }));
      }

      if (msg.type === "answer") {
        await pc.setRemoteDescription(msg.answer);
      }

      if (msg.type === "ice") {
        await pc.addIceCandidate(msg.candidate);
      }
    };

    ws.onopen = () => {
      if (!isCaller.current) {
        isCaller.current = true;

        const channel = pc.createDataChannel("notes");
        channelRef.current = channel;
        channel.onmessage = (e) => setText(e.data);

        pc.createOffer().then(async (offer) => {
          await pc.setLocalDescription(offer);
          ws.send(JSON.stringify({ type: "offer", offer }));
        });
      }
    };

    return () => {
      ws.close();
      pc.close();
    };
  }, []);

  const onChange = (e) => {
    const value = e.target.value;
    setText(value);

    if (channelRef.current?.readyState === "open") {
      channelRef.current.send(value);
    }
  };

  return (
    <textarea
      value={text}
      onChange={onChange}
      placeholder="Type things to be shared"
      style={{
        width: "100%",
        height: "95vh",
        backgroundColor: "#242424",
        color: "#e5e7eb",
        border: "none",
        outline: "none",
        resize: "none",
        fontSize: "18px",
        fontFamily: "monospace",
        boxSizing: "border-box",
      }}
    />
  );
}