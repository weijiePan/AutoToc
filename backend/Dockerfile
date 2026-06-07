# FROM node:slim
# RUN apk add --no-cache python3 py3-pip


FROM alpine:latest
RUN apk add --no-cache python3 py3-pip 
RUN apk add nodejs npm
WORKDIR /app
COPY ./index.js .
COPY ./requirements.txt .
COPY ./package.json .
COPY ./util ./util
COPY ./import ./import
COPY ./export ./export
RUN npm i
EXPOSE 300
###
RUN python -m venv ./venv
ENV PATH="/app/venv/bin:$PATH"
RUN pip install pypdf
CMD ["node", "./index.js"]