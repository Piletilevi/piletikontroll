FROM node:4-slim

ADD ./ /usr/src/piletikontroll
RUN cd /usr/src/piletikontroll && npm --silent --production install

CMD ["node", "/usr/src/piletikontroll/master.js"]
