FROM node:0.12-slim

ADD ./ /usr/src/piletikontroll
RUN cd /usr/src/piletikontroll && npm install

CMD ["node", "/usr/src/piletikontroll/master.js"]
