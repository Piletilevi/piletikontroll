FROM node:4.0-slim

ADD ./ /usr/src/piletikontroll
RUN cd /usr/src/piletikontroll && npm install

CMD ["node", "/usr/src/piletikontroll/master.js"]
