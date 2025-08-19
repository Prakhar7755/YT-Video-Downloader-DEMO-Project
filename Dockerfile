# -------- Build client --------
FROM node:22-alpine AS client-build

WORKDIR /app/client

# Copy client dependencies and install
COPY client/package.json ./
RUN yarn install

# Copy the rest of the client source and build
COPY client ./
RUN yarn build


# -------- Setup server --------
FROM node:22-alpine

WORKDIR /app/server

# Copy server dependencies and install
COPY server/package.json ./

# Set ENV before install to bypass Python check
ENV YOUTUBE_DL_SKIP_PYTHON_CHECK=1
RUN yarn install --production

# Copy the rest of the server source
COPY server ./

# Copy built client into the expected path
COPY --from=client-build /app/client/dist ../client/dist

# Server listens on port 5001
EXPOSE 5001

# Set production environment for runtime
ENV NODE_ENV=production

# Start the app
CMD ["node", "app.js"]
