from flask import Flask, request
from simple_websocket import Server
from dotenv import load_dotenv
import os
import gevent
import json

from backend.turtles import TurtleCollection, turtle_connection_handler
from backend.blocks import BlockCollection 
from backend.frontends import User, frontend_connection_handler

load_dotenv()

app = Flask(__name__, static_url_path='', static_folder='frontend/dist')

user: User = None
turtles = TurtleCollection()
blocks = BlockCollection()

#Serve index.html
@app.route('/')
@app.route('/index')
def root():
    return app.send_static_file('index.html')

#Serve websockets for turtles and frontends
@app.route('/ws/turtles', websocket=True)
def ws_turtle():
    ws = Server.accept(request.environ)
    turtle_connection_handler(ws, turtles)
    while ws.connected:
        gevent.sleep(5)
    print('Turtle disconnected')
    return "Connection Closed"
    

@app.route('/ws/frontends', websocket=True)
def ws_frontend():
    ws = Server.accept(request.environ)
    frontend_connection_handler(ws, user, turtles, blocks)
    while ws.connected:
        gevent.sleep(5)
    print('Client disconnected')
    return "Connection Closed"


#Serve wget for turtles
@app.route('/startup.lua')
def wget_startup():
    with open('turtle/startup_template.lua', 'r') as template:
        #Change SERVER_URL in template
        file = template.read()
        prot = os.getenv('SSL', 'false') == 'true' and 'https' or 'http'
        url = f'{prot}://{os.getenv('HOST', '127.0.0.1')}:{os.getenv('PORT', 80)}'
        file = file.replace('SERVER_URL = \'\'', f'SERVER_URL = \'{url}\'', 1)
        return file
    
@app.route('/remotetutel.lua')
def wget_remotetutel():
    with open('turtle/remotetutel_template.lua', 'r') as template:
        #Change SERVER_URL in template
        file = template.read()
        prot = os.getenv('SSL', 'false') == 'true' and 'wss' or 'ws'
        url = f'{prot}://{os.getenv('HOST', '127.0.0.1')}:{os.getenv('PORT', 80)}'
        file = file.replace('SERVER_URL = \'\'', f'SERVER_URL = \'{url}\'', 1)
        return file




def before_app():
    #load blocks
    try:
        with open('saves/blocks.json', 'r') as file:
            json_string = file.read()
            blocks.from_jsonable_dict(json.loads(json_string))
    except FileNotFoundError:
        print('No blocks.json save file found')
    #load turtles
    try:
        with open('saves/turtles.json', 'r') as file:
            json_string = file.read()
            turtles.from_jsonable_dict(json.loads(json_string))
    except FileNotFoundError:
        print('No turtles.json save file found')

def after_app():
    #save blocks
    with open('saves/blocks.json', 'w') as file:
        json_string = json.dumps(blocks.to_jsonable_dict())
        file.write(json_string)
    #save turtles
    with open('saves/turtles.json', 'w') as file:
        json_string = json.dumps(turtles.to_jsonable_dict())
        file.write(json_string)

if __name__ == '__main__':
    before_app()
    app.run(host='0.0.0.0', port=os.getenv('PORT') or 80)
    after_app()