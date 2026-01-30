echo installing frontend dependencies
cd frontend
call npm i

echo building frontend
call npm run build
cd ..

echo creating backend environment
call python -m venv .venv
call .venv/scripts/activate

echo installing backend dependencies
call pip install -r requirements.txt
call deactivate

