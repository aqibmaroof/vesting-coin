FROM node:14
WORKDIR /xana-vesting
COPY package.json .
RUN npm install
COPY . .
# RUN npm run translate
RUN npm install axios
RUN npm run prod:build
EXPOSE 3000
ENTRYPOINT [ "npm", "run", "prod:start" ]