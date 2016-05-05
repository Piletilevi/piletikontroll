FROM node:6-slim

ADD ./ /usr/src/piletikontroll
RUN cd /usr/src/piletikontroll && npm --silent --production install

CMD ["node", "/usr/src/piletikontroll/master.js"]
