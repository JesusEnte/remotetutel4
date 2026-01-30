import json

class Block:
    def __init__(self, x, y, z, name):
        self.x = x
        self.y = y
        self.z = z
        self.name = name

class BlockCollection:
    def __init__(self):
        self.blocks = {}
    
    def __key(self, x, y, z) -> str:
        return f'{x}/{y}/{z}'

    def add(self, x, y, z, name):
        key = self.__key(x, y, z)
        self.blocks[key] = Block(x, y, z, name)

    def get(self, x, y, z) -> Block | None:
        key = self.__key(x, y, z)
        return self.blocks.get(key, None)

    def remove(self, x, y, z):
        key = self.__key(x, y, z)
        if key in self.blocks:
            self.blocks.pop(key)

    def to_jsonable_dict(self) -> dict:
        jsonable_dict = {}
        for k, v in self.blocks.items():
            jsonable_dict[k] = {'x': v.x, 'y': v.y, 'z': v.z, 'name': v.name}
        return jsonable_dict
    
    def from_jsonable_dict(self, jsonable_dict):
        self.blocks = {}
        for k, v in jsonable_dict.items():
            self.blocks[k] = Block(**v)