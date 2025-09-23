FROM node:18

# Working dir
WORKDIR /usr/src/app

# Install deps
COPY package*.json ./
RUN npm install

# Copy code
COPY . .

# Expose port
EXPOSE 4000

CMD ["npm", "start"]
