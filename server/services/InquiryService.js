class InquiryService {
  constructor(messageRepository) {
    this.messageRepository = messageRepository;
  }

  async createInquiry({ name, email, message }) {
    if (!name || !email || !message) {
      throw new Error('Please complete every field.');
    }

    return this.messageRepository.create({ name, email, message });
  }
}

export default InquiryService;
