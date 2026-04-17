class CatalogController {
  constructor(catalogService) {
    this.catalogService = catalogService;
  }

  getHealth = (req, res) => {
    res.json({
      status: 'ok',
      database: req.app.locals.databaseReady ? 'connected' : 'fallback'
    });
  };

  getCategories = async (req, res) => {
    try {
      if (!req.app.locals.databaseReady) {
        return res.json(this.catalogService.getFallbackCategories());
      }

      const categories = await this.catalogService.getCategories();
      return res.json(categories);
    } catch (error) {
      return res.status(500).json({ error: 'Unable to load categories.' });
    }
  };

  getProducts = async (req, res) => {
    try {
      if (!req.app.locals.databaseReady) {
        return res.json(this.catalogService.getFallbackProducts(req.query));
      }

      const products = await this.catalogService.getProducts(req.query);
      return res.json(products);
    } catch (error) {
      return res.status(500).json({ error: 'Unable to load products.' });
    }
  };

  getProductByIdentifier = async (req, res) => {
    try {
      if (!req.app.locals.databaseReady) {
        const fallbackProduct = this.catalogService.getFallbackProductByIdentifier(req.params.identifier);
        if (!fallbackProduct) {
          return res.status(404).json({ error: 'Product not found.' });
        }

        return res.json(fallbackProduct);
      }

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
