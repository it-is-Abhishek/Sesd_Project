import Order from '../models/Order.js';

class OrderRepository {
  async create(orderData) {
    return Order.create(orderData);
  }

  async findByIdForUser(orderId, userId) {
    return Order.findOne({ _id: orderId, userId });
  }
}

export default OrderRepository;
