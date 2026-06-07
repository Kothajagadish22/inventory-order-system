import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../components/Alert';
import Modal from '../components/Modal';
import { api } from '../api/client';

const emptyLineItem = { product_id: '', quantity: '' };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [lineItems, setLineItems] = useState([{ ...emptyLineItem }]);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      const [ordersData, customersData, productsData] = await Promise.all([
        api.getOrders(),
        api.getCustomers(),
        api.getProducts(),
      ]);
      setOrders(ordersData);
      setCustomers(customersData);
      setProducts(productsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function openModal() {
    setCustomerId('');
    setLineItems([{ ...emptyLineItem }]);
    setErrors({});
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setErrors({});
  }

  function updateLineItem(index, field, value) {
    setLineItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    );
  }

  function addLineItem() {
    setLineItems((current) => [...current, { ...emptyLineItem }]);
  }

  function removeLineItem(index) {
    setLineItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function validateOrder() {
    const nextErrors = {};
    if (!customerId) nextErrors.customerId = 'Select a customer';
    if (lineItems.length === 0) nextErrors.items = 'Add at least one product';

    lineItems.forEach((item, index) => {
      if (!item.product_id) nextErrors[`product_${index}`] = 'Select a product';
      if (!item.quantity || Number(item.quantity) <= 0) {
        nextErrors[`quantity_${index}`] = 'Quantity must be greater than 0';
      }
    });

    const productIds = lineItems.map((item) => item.product_id).filter(Boolean);
    if (new Set(productIds).size !== productIds.length) {
      nextErrors.items = 'Duplicate products are not allowed in one order';
    }

    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateOrder();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await api.createOrder({
        customer_id: Number(customerId),
        items: lineItems.map((item) => ({
          product_id: Number(item.product_id),
          quantity: Number(item.quantity),
        })),
      });
      setMessage('Order created successfully');
      closeModal();
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(orderId) {
    if (!window.confirm('Cancel/delete this order?')) return;
    try {
      await api.deleteOrder(orderId);
      setMessage('Order deleted successfully');
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Orders</h2>
          <p>Create orders and track inventory changes automatically</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openModal}>
          Create Order
        </button>
      </div>

      <Alert type="success" message={message} onClose={() => setMessage('')} />
      <Alert type="error" message={error} onClose={() => setError('')} />

      <section className="panel">
        {loading ? (
          <p className="empty-state">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="empty-state">No orders yet. Create your first order.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customer_name || `Customer #${order.customer_id}`}</td>
                    <td>${Number(order.total_amount).toFixed(2)}</td>
                    <td>{new Date(order.created_at).toLocaleString()}</td>
                    <td className="actions">
                      <Link to={`/orders/${order.id}`} className="btn btn-secondary btn-sm">
                        View
                      </Link>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(order.id)}
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
        <Modal title="Create Order" onClose={closeModal}>
          <form className="form" onSubmit={handleSubmit}>
            <label>
              Customer
              <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
                <option value="">Select customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.full_name} ({customer.email})
                  </option>
                ))}
              </select>
              {errors.customerId && <span className="field-error">{errors.customerId}</span>}
            </label>

            <div className="line-items">
              <div className="line-items-header">
                <h3>Order Items</h3>
                <button type="button" className="btn btn-secondary btn-sm" onClick={addLineItem}>
                  Add Item
                </button>
              </div>

              {errors.items && <span className="field-error">{errors.items}</span>}

              {lineItems.map((item, index) => (
                <div className="line-item-row" key={`line-item-${index}`}>
                  <label>
                    Product
                    <select
                      value={item.product_id}
                      onChange={(e) => updateLineItem(index, 'product_id', e.target.value)}
                    >
                      <option value="">Select product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} (Stock: {product.quantity_in_stock})
                        </option>
                      ))}
                    </select>
                    {errors[`product_${index}`] && (
                      <span className="field-error">{errors[`product_${index}`]}</span>
                    )}
                  </label>

                  <label>
                    Quantity
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(index, 'quantity', e.target.value)}
                    />
                    {errors[`quantity_${index}`] && (
                      <span className="field-error">{errors[`quantity_${index}`]}</span>
                    )}
                  </label>

                  {lineItems.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger btn-sm remove-item"
                      onClick={() => removeLineItem(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Order
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
