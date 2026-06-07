import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Alert from '../components/Alert';
import { api } from '../api/client';

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);
        const data = await api.getOrder(id);
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [id]);

  if (loading) {
    return <div className="panel">Loading order details...</div>;
  }

  if (error) {
    return (
      <div className="page">
        <Alert type="error" message={error} />
        <Link to="/orders" className="text-link">
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Order #{order.id}</h2>
          <p>Detailed view of order items and totals</p>
        </div>
        <Link to="/orders" className="btn btn-secondary">
          Back to Orders
        </Link>
      </div>

      <section className="panel">
        <div className="detail-grid">
          <div>
            <span className="detail-label">Customer</span>
            <strong>{order.customer_name || `Customer #${order.customer_id}`}</strong>
          </div>
          <div>
            <span className="detail-label">Created</span>
            <strong>{new Date(order.created_at).toLocaleString()}</strong>
          </div>
          <div>
            <span className="detail-label">Total Amount</span>
            <strong>${Number(order.total_amount).toFixed(2)}</strong>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3>Order Items</h3>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Line Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.product_name || `Product #${item.product_id}`}</td>
                  <td>{item.quantity}</td>
                  <td>${Number(item.unit_price).toFixed(2)}</td>
                  <td>${Number(item.line_total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
