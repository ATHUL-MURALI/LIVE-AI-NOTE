from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import Dict, List

app = FastAPI()
rooms: Dict[str, List[WebSocket]] = {}

@app.websocket("/ws/{room_id}")
async def ws_endpoint(ws: WebSocket, room_id: str):
    await ws.accept()

    rooms.setdefault(room_id, []).append(ws)

    try:
        while True:
            data = await ws.receive_text()
            for client in rooms[room_id]:
                if client != ws:
                    await client.send_text(data)
    except WebSocketDisconnect:
        rooms[room_id].remove(ws)