import Message from '../models/Message.js';

class MessageRepository {
  async create(messageData) {
    return Message.create(messageData);
  }
}

export default MessageRepository;
