import json
import os
import simple_websocket
from backend.turtles import TurtleCollection, Turtle
from backend.blocks import BlockCollection

class User:
    def __init__(self, ws: simple_websocket.Server = None):
        self.ws = ws

    def update_turtles(self, turtles: TurtleCollection):
        self.ws.send(json.dumps({'type': 'turtles', 'turtles': turtles.to_jsonable_dict()}))

    def update_turtle(self, turtle: Turtle):
        self.ws.send(json.dumps({'type': 'turtles', 'turtles': {turtle.id: turtle.to_jsonable_dict()}}))
    
    def update_blocks(self, blocks: BlockCollection):
        self.ws.send(json.dumps({'type': 'blocks', 'blocks': blocks.to_jsonable_dict()}))

    def update_inventory(self, turtle: Turtle):
        inventory = turtle.get_inventory()
        self.ws.send(json.dumps({'type': 'inventory', 'inventory': inventory}))

    def on_message(self, message, turtles: TurtleCollection, blocks: BlockCollection):
        if message.get('type') is None:
            return

        turtle: Turtle = turtles.get(message.get('id'))
            
        match (message['type']):
            case 'get turtles':
                self.update_turtles(turtles)
            case 'get blocks':
                self.update_blocks(blocks)
            case 'set info':
                turtle.update_info(message.get('info', {}))
                self.ws.send(json.dumps({'type': 'turtles', 'turtles': {turtle.id: turtle.to_jsonable_dict()}}))
            case 'go':
                block_changes = turtle.go(message['direction'], blocks)
                self.update_blocks(block_changes)
                self.update_turtle(turtle)
            case 'right click':
                block_changes = turtle.right_click(message['direction'], blocks)
                self.update_blocks(block_changes)
            case 'left click':
                block_changes = turtle.left_click(message['direction'], blocks)
                self.update_blocks(block_changes)
            case 'suck':
                turtle.suck(message['direction'])
            case 'get inventory':
                self.update_inventory(turtle)
            case 'set selected':
                turtle.set_selected(message['slot'])
                self.update_inventory(turtle)
            case 'craft':
                turtle.craft(message['count'])
                self.update_inventory(turtle)
            case _:
                print(message)

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