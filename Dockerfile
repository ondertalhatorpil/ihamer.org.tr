FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

# Vite 'dist' klasörüne build eder, 'build' değil!
CMD ["serve", "-s", "dist", "-l", "80"]