import mongoose from 'mongoose';

class OrderService {
  constructor(orderRepository, productRepository) {
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
  }

  async createOrder({ user, userId, items, customer }) {
    this.validateItems(items);
    this.validateCustomer(customer);

    const productIds = items.map((item) => item.productId).filter(Boolean);
    if (productIds.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
      throw new Error('One or more product IDs are invalid.');
    }

    const products = await this.productRepository.findByIds(productIds);
    const productMap = new Map(products.map((product) => [String(product._id), product]));
    const normalizedItems = items.map((item) => this.normalizeItem(item, productMap));
    const subtotal = normalizedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shippingFee = subtotal >= 200 ? 0 : 15;
    const total = subtotal + shippingFee;

    const order = await this.orderRepository.create({
      user: user._id,
      userId,
      customer,
      items: normalizedItems,
      subtotal,
      shippingFee,
      total
    });

    return {
      id: order._id,
      subtotal,
      shippingFee,
      total,
      status: order.status
    };
  }

  async getOrderForUser(orderId, userId) {
    return this.orderRepository.findByIdForUser(orderId, userId);
  }

  validateItems(items) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Your cart is empty.');
    }
  }

  validateCustomer(customer) {
    const requiredFields = ['name', 'email', 'address', 'city', 'postalCode', 'country'];
    const missingField = requiredFields.find((field) => !customer?.[field]);

    if (missingField) {
      throw new Error(`Customer ${missingField} is required.`);
    }
  }

  normalizeItem(item, productMap) {
    const product = productMap.get(item.productId);
    if (!product) {
      throw new Error('One or more products no longer exist.');
    }

    const quantity = Math.max(1, Number(item.quantity) || 1);
    return {
      product: product._id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image
    };
  }
}

export default OrderService;
