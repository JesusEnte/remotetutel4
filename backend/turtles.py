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
    
    def forwards_math(self, distance) -> dict:
        match (self.dir):
            case 0: #North
                return {'x': self.x, 'y': self.y, 'z': self.z - distance}
            case 1: #East
                return {'x': self.x + distance, 'y': self.y, 'z': self.z}
            case 2: #South
                return {'x': self.x, 'y': self.y, 'z': self.z + distance}
            case 3: #West
                return {'x': self.x - distance, 'y': self.y, 'z': self.z}
    
    def update_blocks(self, blocks: BlockCollection) -> BlockCollection:
        """
        Updates the given BlockCollection and also returns a BlockCollection of only the updated blocks
        """
        blocks_dict = self.eval("""
            inspect = {
                {turtle.inspectUp()},
                {turtle.inspect()},
                {turtle.inspectDown()}
            }
            for i, v in ipairs(inspect) do
                if v[1] then
                    inspect[i] = {name = v[2]['name'], color = v[2]['mapColor']}
                else
                    inspect[i] = {}
                end
            end
            return {
                top = inspect[1],
                front = inspect[2],
                bottom = inspect[3]
            }
        """)[0]
        updated_blocks = BlockCollection()
        front_coords = self.forwards_math(1)
        #top / front / bottom coordinate stuff
        if blocks_dict['top']:
            blocks.add(self.x, self.y + 1, self.z, blocks_dict['top']['name'], blocks_dict['top']['color'])
            updated_blocks.add(self.x, self.y + 1, self.z, blocks_dict['top']['name'], blocks_dict['top']['color'])
        else:
            blocks.remove(self.x, self.y + 1, self.z)
            updated_blocks.add(self.x, self.y + 1, self.z, None, None)
        if blocks_dict['front']:
            blocks.add(name=blocks_dict['front']['name'], color=blocks_dict['front']['color'], **front_coords)
            updated_blocks.add(name=blocks_dict['front']['name'], color=blocks_dict['front']['color'], **front_coords)
        else:
            blocks.remove(**front_coords)
            updated_blocks.add(name=None, color=None, **front_coords)
        if blocks_dict['bottom']:
            blocks.add(self.x, self.y - 1, self.z, blocks_dict['bottom']['name'], blocks_dict['bottom']['color'])
            updated_blocks.add(self.x, self.y - 1, self.z, blocks_dict['bottom']['name'], blocks_dict['bottom']['color'])
        else:
            blocks.remove(self.x, self.y - 1, self.z)
            updated_blocks.add(self.x, self.y - 1, self.z, None, None)
        #own position
        blocks.remove(self.x, self.y, self.z)
        updated_blocks.add(self.x, self.y, self.z, None, None)

        return updated_blocks
    
    def update_fuel(self):
        self.fuel = self.eval("return turtle.getFuelLevel()")[0]

    def go(self, direction, blocks: BlockCollection) -> BlockCollection:
        match (direction):
            case 'forward' | 'back' | 'up' | 'down':
                success = self.eval(f'return turtle.{direction}()')[0]
            case 'left':
                success = self.eval(f'return turtle.turnLeft()')[0]
            case 'right':
                success = self.eval(f'return turtle.turnRight()')[0]
        if success:
            match (direction):
                case 'forward':
                    new_pos = self.forwards_math(1)
                    self.x, self.y, self.z = new_pos.values()
                case 'back':
                    new_pos = self.forwards_math(-1)
                    self.x, self.y, self.z = new_pos.values()
                case 'up':
                    self.y += 1
                case 'down':
                    self.y -= 1
                case 'left':
                    self.dir = (self.dir - 1) % 4
                case 'right':
                    self.dir = (self.dir + 1) % 4
        return self.update_blocks(blocks)

    def right_click(self, direction: str, blocks: BlockCollection) -> BlockCollection:
        match (direction):
            case 'normal':
                self.eval("turtle.place()")
            case 'up':
                self.eval("turtle.placeUp()")
            case 'down':
                self.eval("turtle.placeDown()")
        return self.update_blocks(blocks)
    
    def left_click(self, direction: str, blocks: BlockCollection) -> BlockCollection:
        match (direction):
            case 'normal':
                self.eval("turtle.dig() turtle.attack()")
            case 'up':
                self.eval("turtle.digUp() turtle.attackUp()")
            case 'down':
                self.eval("turtle.digDown() turtle.attackDown()")
        return self.update_blocks(blocks)
    
    def suck(self, direction: str):
        match (direction):
            case 'all':
                self.eval("turtle.suck() turtle.suckUp() turtle.suckDown()")
            case 'up':
                self.eval("turtle.suckUp()")
            case 'normal':
                self.eval("turtle.suck()")
            case 'down':
                self.eval("turtle.suckDown()")

    def get_inventory(self) -> dict:
        return self.eval(f"""
            inventory = {{}}
                         
            for i=1,16 do
                item = turtle.getItemDetail(i, true)
                item = item and {{name = item.name, count = item.count, color = item.mapColor}} or {{}}
                inventory[tostring(i)] = item
            end
                         
            inventory.selected = tostring(turtle.getSelectedSlot())
                         
            return inventory
        """)[0]
    
    def set_selected(self, slot):
        self.eval(f'turtle.select({slot})')

    def craft(self, count):
        self.eval(f'turtle.craft({count})')

    def transferTo(self, f, t, count):
        self.set_selected(f)
        self.eval(f'turtle.transferTo({t}, {count})')

    def refuel(self, slot, count):
        self.set_selected(slot)
        self.eval(f'turtle.refuel({count})')

    def drop(self, slot, count, direction):
        self.set_selected(slot)
        match (direction):
            case 'normal':
                self.eval(f'turtle.drop({count})')
            case 'up':
                self.eval(f'turtle.dropUp({count})')
            case 'down':
                self.eval(f'turtle.dropDown({count})')
        
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