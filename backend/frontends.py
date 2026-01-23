import json
import os

class User:
    def __init__(self, ws=None):
        self.ws = ws
        while self.ws.connected:
            self.on_message(json.loads(ws.receive()))

    def on_message(self, message):
        print('message')

def frontend_connection_handler(ws, user):
    message = json.loads(ws.receive())
    if message.get('type') != 'authentication':
        return
    if message.get('password') == os.getenv('PASSWORD'):
        ws.send(json.dumps({'type': 'authentication', 'status': 'success'}))
        user = User(ws)
        print('Client connected')
    else:
        ws.send(json.dumps({'type': 'authentication', 'status': 'wrong password'}))
        print('Client tried to connect with wrong password')