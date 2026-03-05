FROM node:alpine AS frontend-build
WORKDIR /usr/src/app/frontend
COPY /frontend .
RUN npm install
RUN npm run build


FROM python:3-alpine
WORKDIR /usr/src/app
COPY . .
COPY --from=frontend-build /usr/src/app/frontend/dist ./frontend/dist
RUN pip install --no-cache-dir -r requirements.txt

CMD ["python3", "app.py"]