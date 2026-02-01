import json
import os
import simple_websocket
from backend.turtles import TurtleCollection
from backend.blocks import BlockCollection

class User:
    def __init__(self, ws: simple_websocket.Server = None):
        self.ws = ws

    def on_message(self, message, turtles: TurtleCollection, blocks: BlockCollection):
        if message.get('type') is None:
            return
        match (message['type']):
            case 'get turtles':
                self.ws.send(json.dumps({'type': 'turtles', 'turtles': turtles.to_jsonable_dict()}))
            case 'get blocks':
                self.ws.send(json.dumps({'type': 'blocks', 'blocks': blocks.to_jsonable_dict()}))
            case 'update info':
                turtle = turtles.get(message['id'])
                for k, v in message['info'].items():
                    setattr(turtle, k, v)
                    print(k, v)
                turtle.status = turtle.get_status()
                self.ws.send(json.dumps({'type': 'turtles', 'turtles': {turtle.id: turtle.to_jsonable_dict()}}))

def frontend_connection_handler(ws, user, turtles: TurtleCollection, blocks: BlockCollection):
    message = json.loads(ws.receive())
    if message.get('type') != 'authentication':
        return
    if message.get('password') == os.getenv('PASSWORD'):
        ws.send(json.dumps({'type': 'authentication', 'status': 'success'}))
        user = User(ws)
        print('Client connected')
        while ws.connected:
            try:
                user.on_message(json.loads(ws.receive()), turtles, blocks)
            except simple_websocket.ConnectionClosed:
                return
    else:
        ws.send(json.dumps({'type': 'authentication', 'status': 'wrong password'}))
        print('Client tried to connect with wrong password')