import json
from backend.blocks import BlockCollection

class Turtle:
    def __init__(self, id, x=None, y=None, z=None, dir=None, fuel=None, ws=None):
        self.id = id
        self.x = x
        self.y = y
        self.z = z
        self.dir = dir #0=North, 1=East, 2=South, 3=West
        self.ws = ws
        self.fuel = fuel
        self.status = self.get_status()

    def to_jsonable_dict(self):
        self.status = self.get_status()
        return {
            'id': self.id, 
            'x': self.x, 
            'y': self.y, 
            'z': self.z, 
            'dir': self.dir, 
            'fuel': self.fuel, 
            'status': self.status
        }
    
    def update_info(self, info: dict):
        for k, v in info.items():
            setattr(self, k, v)
        self.status = self.get_status()
    

    def set_websocket(self, ws):
        self.ws = ws

    def get_status(self) -> str:
        if None in [self.x, self.y, self.z, self.dir]:
            return 'unknown position'
        elif self.ws is not None and self.ws.connected:
            return 'online'
        else:
            return 'offline'
    
    def eval(self, lua_code: str):
        self.ws.send(json.dumps({'type': 'eval', 'code': lua_code}))
        response = json.loads(self.ws.receive())
        if response.get('type') != 'eval': return
        if response.get('error', None) is not None:
            print(response.get('error'))
            return 'error'
        return response.get('data')

    def go(self, direction, user):
        match (direction):
            case 'forward' | 'back' | 'up' | 'down':
                print(self.eval(f'return turtle.{direction}()'))
            case 'left':
                print(self.eval(f'return turtle.turnLeft()'))
            case 'right':
                print(self.eval(f'return turtle.turnRight()'))
        
class TurtleCollection:
    def __init__(self):
        self.turtles = {}
        
    def add(self, id, x=None, y=None, z=None, dir=None, fuel=None, ws=None):
        self.turtles[id] = Turtle(id, x, y, z, dir, fuel, ws)

    def get(self, id) -> Turtle | None:
        return self.turtles.get(id, None)

    def remove(self, id):
        if id in self.turtles:
            self.turtles.pop(id)

    def to_jsonable_dict(self) -> dict:
        jsonable_dict = {}
        for k, v in self.turtles.items():
            jsonable_dict[k] = v.to_jsonable_dict()
        return jsonable_dict
    
    def from_jsonable_dict(self, jsonable_dict):
        self.turtles = {}
        for k, v in jsonable_dict.items():
            self.turtles[k] = Turtle(v.get('id'), v.get('x'), v.get('y'), v.get('z'), v.get('dir'), v.get('fuel'))

def turtle_connection_handler(ws, turtles):
    message = json.loads(ws.receive())
    if message.get('type') != 'authentication':
        return
    id = message.get('id')
    turtle = turtles.get(id)
    if turtle is not None:
        turtle.set_websocket(ws)
    else:
        turtles.add(id, ws=ws)
    print(f'Turtle #{id} connected')