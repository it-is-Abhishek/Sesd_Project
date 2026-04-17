class CatalogController {
  constructor(catalogService) {
    this.catalogService = catalogService;
  }

  getHealth = (req, res) => {
    res.json({ status: 'ok' });
  };

  getCategories = async (req, res) => {
    try {
      const categories = await this.catalogService.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Unable to load categories.' });
    }
  };

  getProducts = async (req, res) => {
    try {
      const products = await this.catalogService.getProducts(req.query);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Unable to load products.' });
    }
  };

  getProductByIdentifier = async (req, res) => {
    try {
      const product = await this.catalogService.getProductByIdentifier(req.params.identifier);
      if (!product) {
        return res.status(404).json({ error: 'Product not found.' });
      }

      return res.json(product);
    } catch (error) {
      return res.status(500).json({ error: 'Unable to load product.' });
    }
  };
}

export default CatalogController;
