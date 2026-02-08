FROM python:3-alpine

WORKDIR /usr/src/app
COPY . .

RUN apk add --update nodejs npm

RUN cd frontend && npm i && npm run build && cd ..
RUN pip install --no-cache-dir -r requirements.txt

CMD ["python3", "app.py"]