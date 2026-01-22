echo installing frontend dependencies
cd frontend
npm i

echo building frontend
npm run build
cd ..

echo creating backend environment
python3 -m venv .venv
. .venv/bin/activate

echo installing backend dependencies
pip install -r requirements.txt
deactivate

