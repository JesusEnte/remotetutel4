import json

class Block:
    def __init__(self, name):
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

    def to_json(self) -> str:
        return json.dumps(self.blocks)
    
    def from_json(self, json_string):
        self.blocks = {}
        dict = json.loads(json_string)
        for k, v in dict.items():
            self.blocks[k] = Block(**v)