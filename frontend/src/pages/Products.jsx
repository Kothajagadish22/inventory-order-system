import { useEffect, useState } from 'react';
import Alert from '../components/Alert';
import Modal from '../components/Modal';
import { api } from '../api/client';

const emptyProduct = {
  name: '',
  sku: '',
  price: '',
  quantity_in_stock: '',
};

function validateProduct(form, isEdit = false) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Product name is required';
  if (!form.sku.trim()) errors.sku = 'SKU is required';
  if (form.price === '' || Number(form.price) <= 0) errors.price = 'Price must be greater than 0';
  if (form.quantity_in_stock === '' || Number(form.quantity_in_stock) < 0) {
    errors.quantity_in_stock = 'Quantity cannot be negative';
  }
  if (isEdit && Object.keys(form).length === 0) {
    errors.form = 'Provide at least one field to update';
  }
  return errors;
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editProduct, setEditProduct] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function openCreateModal() {
    setForm(emptyProduct);
    setEditProduct(null);
    setErrors({});
    setShowModal(true);
  }

  function openEditModal(product) {
    setEditProduct(product);
    setForm({
      name: product.name,
      sku: product.sku,
      price: String(product.price),
      quantity_in_stock: String(product.quantity_in_stock),
    });
    setErrors({});
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditProduct(null);
    setForm(emptyProduct);
    setErrors({});
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateProduct(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      price: Number(form.price),
      quantity_in_stock: Number(form.quantity_in_stock),
    };

    try {
      if (editProduct) {
        await api.updateProduct(editProduct.id, payload);
        setMessage('Product updated successfully');
      } else {
        await api.createProduct(payload);
        setMessage('Product created successfully');
      }
      closeModal();
      await loadProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(productId) {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.deleteProduct(productId);
      setMessage('Product deleted successfully');
      await loadProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Products</h2>
          <p>Create, update, and manage product inventory</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreateModal}>
          Add Product
        </button>
      </div>

      <Alert type="success" message={message} onClose={() => setMessage('')} />
      <Alert type="error" message={error} onClose={() => setError('')} />

      <section className="panel">
        {loading ? (
          <p className="empty-state">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="empty-state">No products yet. Add your first product.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.sku}</td>
                    <td>${Number(product.price).toFixed(2)}</td>
                    <td>{product.quantity_in_stock}</td>
                    <td className="actions">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => openEditModal(product)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showModal && (
        <Modal title={editProduct ? 'Update Product' : 'Add Product'} onClose={closeModal}>
          <form className="form" onSubmit={handleSubmit}>
            <label>
              Product Name
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Wireless Mouse"
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </label>

            <label>
              SKU / Code
              <input
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                placeholder="WM-001"
              />
              {errors.sku && <span className="field-error">{errors.sku}</span>}
            </label>

            <label>
              Price
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="29.99"
              />
              {errors.price && <span className="field-error">{errors.price}</span>}
            </label>

            <label>
              Quantity in Stock
              <input
                type="number"
                min="0"
                step="1"
                value={form.quantity_in_stock}
                onChange={(e) => setForm({ ...form, quantity_in_stock: e.target.value })}
                placeholder="100"
              />
              {errors.quantity_in_stock && (
                <span className="field-error">{errors.quantity_in_stock}</span>
              )}
            </label>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editProduct ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
