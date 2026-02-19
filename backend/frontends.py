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

    def update_chest(self, turtle: Turtle, direction: str):
        chest = turtle.get_chest(direction)
        self.ws.send(json.dumps({'type': 'chest', 'chest': chest}))

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
                turtle.update_fuel()
                self.update_turtle(turtle)
            case 'right click':
                block_changes = turtle.right_click(message['direction'], blocks)
                self.update_blocks(block_changes)
                self.update_inventory(turtle)
            case 'left click':
                block_changes = turtle.left_click(message['direction'], blocks)
                self.update_blocks(block_changes)
                self.update_inventory(turtle)
            case 'suck':
                turtle.suck(message['direction'])
                self.update_inventory(turtle)
            case 'get inventory':
                self.update_inventory(turtle)
            case 'set selected':
                turtle.set_selected(message['slot'])
                self.update_inventory(turtle)
            case 'craft':
                turtle.craft(message['count'])
                self.update_inventory(turtle)
            case 'transferTo':
                turtle.transferTo(message['from'], message['to'], message['count'])
                self.update_inventory(turtle)
            case 'refuel':
                turtle.refuel(message['slot'], message['count'])
                self.update_inventory(turtle)
                turtle.update_fuel()
                self.update_turtle(turtle)
            case 'drop':
                turtle.drop(message['slot'], message['count'], message['direction'])
                self.update_inventory(turtle)
            case 'get chest':
                self.update_chest(turtle, message['direction'])
            case 'pull from chest':
                turtle.pull_from_chest(message['direction'], message['from'], message['count'], message['to'])
                self.update_chest(turtle, message['direction'])
                self.update_inventory(turtle)
            case 'push to chest':
                turtle.push_to_chest(message['direction'], message['from'], message['count'])
                self.update_chest(turtle, message['direction'])
                self.update_inventory(turtle)
            case 'move in chest':
                turtle.move_in_chest(message['direction'], message['from'], message['count'], message['to'])
                self.update_chest(turtle, message['direction'])
            case _:
                print(message)

class UserPointer:
    def __init__(self):
        self.user = None
    def set(self, user: User):
        self.user = user
    def get(self) -> User:
        return self.user

def frontend_connection_handler(ws, userPointer: UserPointer, turtles: TurtleCollection, blocks: BlockCollection):
    message = json.loads(ws.receive())
    if message.get('type') != 'authentication':
        return
    if message.get('password') == os.getenv('PASSWORD'):
        ws.send(json.dumps({'type': 'authentication', 'status': 'success'}))
        try:
            userPointer.get().ws.close()
        except:
            pass
        user = User(ws)
        userPointer.set(user)
        print('Client connected')
        while ws.connected:
            try:
                user.on_message(json.loads(ws.receive()), turtles, blocks)
            except simple_websocket.ConnectionClosed:
                return
    else:
        ws.send(json.dumps({'type': 'authentication', 'status': 'wrong password'}))
        print('Client tried to connect with wrong password')