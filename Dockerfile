FROM node:12.14.1

WORKDIR /app/src/phonebook-old

COPY ./ ./

RUN npm install    

CMD ["/bin/bash"]