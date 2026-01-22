import json

class Turtle:
    def __init__(self, id, x=None, y=None, z=None, dir=None, ws=None):
        self.id = id
        self.x = x
        self.y = y
        self.z = z
        self.dir = dir
        self.ws = ws
        self.status = self.get_status()

    def get_status(self) -> str:
        if None in [self.x, self.y, self.z, self.dir]:
            return 'position_unknown'
        elif self.ws is not None:
            return 'online'
        else:
            return 'offline'
        
class TurtleCollection:
    def __init__(self):
        self.turtles = {}
        
    def add(self, id, x=None, y=None, z=None, dir=None, ws=None):
        self.turtles[id] = Turtle(id, x, y, z, dir, ws)

    def get(self, id) -> Turtle | None:
        return self.blocks.get(id, None)

    def remove(self, id):
        if id in self.turtles:
            self.turtles.pop(id)

    def to_json(self) -> str:
        simplified_dict = {}
        for k, v in self.turtles.items():
            simplified_dict[k] = {'x': v.x, 'y': v.y, 'z': v.z, 'dir': v.dir}
        return json.dumps(simplified_dict)
    
    def from_json(self, json_string):
        self.turtles = {}
        simplified_dict = json.loads(json_string)
        for k, v in simplified_dict.items():
            self.turtles[k] = Turtle(**v)