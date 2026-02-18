from flask import Flask, request
from simple_websocket import Server
from dotenv import load_dotenv
import os
import gevent
import json
import signal
import sys

from backend.turtles import TurtleCollection, turtle_connection_handler
from backend.blocks import BlockCollection 
from backend.frontends import UserPointer, frontend_connection_handler

load_dotenv()

app = Flask(__name__, static_url_path='', static_folder='frontend/dist')

userPointer = UserPointer() 
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
    frontend_connection_handler(ws, userPointer, turtles, blocks)
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
        url = f'{prot}://{os.getenv('URL', '127.0.0.1:80')}/'
        file = file.replace('SERVER_URL = \'\' --empty cuz template', f'SERVER_URL = \'{url}\'', 1)
        return file
    
@app.route('/remotetutel.lua')
def wget_remotetutel():
    with open('turtle/remotetutel_template.lua', 'r') as template:
        #Change SERVER_URL in template
        file = template.read()
        prot = os.getenv('SSL', 'false') == 'true' and 'wss' or 'ws'
        url = f'{prot}://{os.getenv('URL', '127.0.0.1:80')}/'
        file = file.replace('SERVER_URL = \'\' --empty cuz template', f'SERVER_URL = \'{url}\'', 1)
        return file




def before_app():
    #load blocks
    print('Loading blocks...')
    try:
        with open('saves/blocks.json', 'r') as file:
            json_string = file.read()
            blocks.from_jsonable_dict(json.loads(json_string))
    except FileNotFoundError:
        print('No blocks.json save file found')
    #load turtles
    print('Loading turtles...')
    try:
        with open('saves/turtles.json', 'r') as file:
            json_string = file.read()
            turtles.from_jsonable_dict(json.loads(json_string))
    except FileNotFoundError:
        print('No turtles.json save file found')

def after_app(*args):
    #save blocks
    print('Saving blocks...')
    with open('saves/blocks.json', 'w') as file:
        json_string = json.dumps(blocks.to_jsonable_dict())
        file.write(json_string)
        print('Saved blocks')
    #save turtles
    print('Saving turtles...')
    with open('saves/turtles.json', 'w') as file:
        json_string = json.dumps(turtles.to_jsonable_dict())
        file.write(json_string)
        print('Saved turtles')
    print('Terminated')
    sys.exit(0)

if __name__ == '__main__':
    before_app()
    signal.signal(signal.SIGTERM, after_app)
    signal.signal(signal.SIGINT, after_app)
    app.run(host='0.0.0.0', port=os.getenv('INTERNAL_PORT') or 80)