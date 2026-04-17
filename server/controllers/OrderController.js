class OrderController {
  constructor(orderService, authService) {
    this.orderService = orderService;
    this.authService = authService;
  }

  createOrder = async (req, res) => {
    try {
      const user = await this.authService.ensureUser(req);
      const order = await this.orderService.createOrder({
        user,
        userId: user.clerkUserId,
        items: req.body.items,
        customer: req.body.customer
      });

      return res.status(201).json({
        message: 'Order placed successfully.',
        order
      });
    } catch (error) {
      const statusCode = error.message === 'Authentication required.' ? 401 : 400;
      return res.status(statusCode).json({ error: error.message || 'Unable to place order.' });
    }
  };

  getOrderById = async (req, res) => {
    try {
      const user = await this.authService.ensureUser(req);
      const order = await this.orderService.getOrderForUser(req.params.id, user.clerkUserId);

      if (!order) {
        return res.status(404).json({ error: 'Order not found.' });
      }

      return res.json(order);
    } catch (error) {
      const statusCode = error.message === 'Authentication required.' ? 401 : 500;
      return res.status(statusCode).json({ error: error.message || 'Unable to load order.' });
    }
  };

  getCurrentUser = async (req, res) => {
    try {
      const user = await this.authService.ensureUser(req);
      return res.json({
        userId: user.clerkUserId,
        email: user.email,
        fullName: user.fullName,
        imageUrl: user.imageUrl
      });
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  };
}

export default OrderController;
