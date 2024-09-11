require('dotenv').config();
const amqp = require('amqplib');
const playlistService = require('./PlaylistService');
const MailSender = require('./MailSender');
const Listener = require('./Listener');

const init = async () => {
  const PlaylistService = new playlistService();
  const mailSender = new MailSender();
  const listener = new Listener(PlaylistService, mailSender);
 
  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();
 
  await channel.assertQueue('export:playlist', {
    durable: true,
  });

  channel.consume('export:playlist', listener.listen, { noAck: true });
  console.log("Run: ");
  
};

init();
