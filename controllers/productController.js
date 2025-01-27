const Product = require('../models/products');

class ProductController {
  // Constructor to initialize any required values
  constructor() {
    this.getIndex = this.getIndex.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.getAddProduct = this.getAddProduct.bind(this);
    this.postAddProduct = this.postAddProduct.bind(this);
    this.getEditProduct = this.getEditProduct.bind(this);
    this.postEditProduct = this.postEditProduct.bind(this);
    this.postDeleteProduct = this.postDeleteProduct.bind(this);
    this.getAllProducts = this.getAllProducts.bind(this);
  }


  getAllProducts(req, res, next) {
    Product.findAll()
      .then(products => {
        // Respond with JSON
        res.status(200).json({
          products: products,
          message: 'Products fetched successfully!'
        });
      })
      .catch(err => {
        res.status(500).json({ message: 'Failed to fetch products', error: err });
      });
  }


  // Method to fetch all products and render the homepage
  getIndex(req, res, next) {
    Product.findAll()
      .then(products => {
        res.render('index', {
          prods: products,
          pageTitle: 'My Shop',
          path: '/',
          isAuthenticated: req.session.isLoggedIn
        });
      })
      .catch(err => console.log(err));
  }

  // Method to fetch all products and render the products page
  getProducts(req, res, next) {
    Product.findAll()
      .then(products => {
        res.render('products', {
          prods: products,
          pageTitle: 'All Products',
          path: '/admin/products',
          isAuthenticated: req.session.isLoggedIn
        });
      })
      .catch(err => console.log(err));
  }

  // Method to render the add product page
  getAddProduct(req, res, next) {
    res.render('add-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      isAuthenticated: req.session.isLoggedIn
    });
  }

  // Method to handle the post request to add a new product
  postAddProduct(req, res, next) {
    const { title, description, price, imageUrl } = req.body;
    Product.create({
      title,
      description,
      price,
      imageUrl
    })
      .then(result => {
        console.log('CREATED PRODUCT');
        res.redirect('/admin/products');
      })
      .catch(err => {
        console.log(err);
      });
  }

  // Method to render the edit product page
  getEditProduct(req, res, next) {
    const editMode = req.query.edit;
    if (!editMode) {
      return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findByPk(prodId)
      .then(product => {
        if (!product) {
          return res.redirect('/');
        }
        res.render('add-product', {
          pageTitle: 'Edit Product',
          path: '/admin/edit-product',
          editing: editMode,
          product,
          isAuthenticated: req.session.isLoggedIn
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  // Method to handle the post request to edit a product
  postEditProduct(req, res, next) {
    const { productId, title, price, description, imageUrl } = req.body;
    Product.findByPk(productId)
      .then(product => {
        if (!product) {
          return res.redirect('/');
        }
        product.title = title;
        product.price = price;
        product.description = description;
        product.imageUrl = imageUrl;
        return product.save();
      })
      .then(result => {
        console.log('UPDATED PRODUCT!');
        res.redirect('/admin/products');
      })
      .catch(err => console.log(err));
  }

  // Method to handle the post request to delete a product
  postDeleteProduct(req, res, next) {
    const prodId = req.body.productId;
    Product.findByPk(prodId)
      .then(product => {
        if (!product) {
          return res.redirect('/');
        }
        return product.destroy();
      })
      .then(result => {
        console.log('DELETED PRODUCT');
        res.redirect('/admin/products');
      })
      .catch(err => console.log(err));
  }
}

// Exporting an instance of the ProductController
module.exports = new ProductController();
