FROM alpine:latest

# Install dependencies and setup venv
RUN apk add --no-cache python3 py3-pip nodejs npm build-base && \
    python3 -m venv /venv

# Bind venv to PATH and set system environment variables
ENV VIRTUAL_ENV=/venv
ENV PATH="/venv/bin:$PATH"

WORKDIR /app

# Copy dependency files
COPY package*.json ./
COPY requirements.txt ./

# Install Node & Python packages
RUN npm ci --only=production && \
    /venv/bin/pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Ensure working directory for temporary processing exists
RUN mkdir -p /app/dist/tmp/export

EXPOSE 3001

CMD ["node", "./dist/routes/server.js"]