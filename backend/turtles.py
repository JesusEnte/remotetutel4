import json

class Turtle:
    def __init__(self, id, x=None, y=None, z=None, dir=None, ws=None):
        self.id = id
        self.x = x
        self.y = y
        self.z = z
        self.dir = dir #0=North, 1=East, 2=South, 3=West
        self.ws = ws
        self.status = self.get_status()

    def set_websocket(self, ws):
        self.ws = ws
        self.status = self.get_status()

    def get_status(self) -> str:
        if None in [self.x, self.y, self.z, self.dir]:
            return 'unknown position'
        elif self.ws is not None and self.ws.connected:
            return 'online'
        else:
            return 'offline'
        
class TurtleCollection:
    def __init__(self):
        self.turtles = {}
        
    def add(self, id, x=None, y=None, z=None, dir=None, ws=None):
        self.turtles[id] = Turtle(id, x, y, z, dir, ws)

    def get(self, id) -> Turtle | None:
        return self.turtles.get(id, None)

    def remove(self, id):
        if id in self.turtles:
            self.turtles.pop(id)

    def to_jsonable_dict(self) -> dict:
        jsonable_dict = {}
        for k, v in self.turtles.items():
            jsonable_dict[k] = {'id': v.id, 'x': v.x, 'y': v.y, 'z': v.z, 'dir': v.dir, 'status': v.status}
        return jsonable_dict
    
    def from_jsonable_dict(self, jsonable_dict):
        self.turtles = {}
        for k, v in jsonable_dict.items():
            self.turtles[k] = Turtle(v['id'], v['x'], v['y'], v['z'], v['dir'])

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