FROM node:slim

ADD ./ /usr/src/piletikontroll
RUN cd /usr/src/piletikontroll && npm install

CMD ["node", "/usr/src/piletikontroll/app.js"]
