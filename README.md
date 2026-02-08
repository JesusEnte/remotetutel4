# **Remotetutel4**
A Control Panel for Turtles from the Minecraft [CC: Tweaked](https://modrinth.com/mod/cc-tweaked) Mod

Inspired by [Ottomated](https://github.com/ottomated)'s [Turtle Gambit](https://www.youtube.com/watch?v=pwKRbsDbxqc)

React frontend built with vite / nodejs, Python Flask backend

## Setup
Requirements: Python and Node

When both of those are installed you should be just using the `setup.sh` or `setup.bat` file

That will install the frontend dependencies, build the frontend, create a virtual environment for python and install all of it's dependencies as well 

You'll also want to take a look at the `.env.example` file and create your own `.env` file

## Start
Finally you'll just want to run the app.py file

## Docker
When you use Docker, make sure to use to -p flag to listen to the set ports and use -v to assign a volume to the /usr/src/app/saves path  
Then things might look like something this:  
```
docker build --tag=remotetutel .
docker run --rm -p 80:80 -v mysaves:/usr/src/app/saves remotetutel 
```