class InquiryController {
  constructor(inquiryService) {
    this.inquiryService = inquiryService;
  }

  createInquiry = async (req, res) => {
    try {
      const inquiry = await this.inquiryService.createInquiry(req.body);
      return res.status(201).json({
        message: 'Message sent successfully.',
        inquiryId: inquiry._id
      });
    } catch (error) {
      const statusCode = error.message === 'Please complete every field.' ? 400 : 500;
      return res.status(statusCode).json({
        error: error.message || 'Unable to save your message right now.'
      });
    }
  };
}

export default InquiryController;
