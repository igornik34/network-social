# используем  образ линукс alpine с версией node 14
FROM node:19.5.0-alpine

# Указываем нашу рабочую директорию
WORKDIR /app

# Скопировать package.json и package-lock.json внутрь контейнера'
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем оставшееся приложение в контейнер
COPY . .

# Установить prisma
RUN npm install -g prisma

# Генерируем prisma client
RUN prisma generate

# Копируем prisma schema
COPY prisma/schema.prisma ./prisma/

# Открыть порт в контейнере
EXPOSE 3000

# Запускаем сервер
CMD ["npm", "start"]