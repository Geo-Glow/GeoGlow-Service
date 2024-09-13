FROM node:18.7.0

WORKDIR .

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

CMD ["node", "app.js"]