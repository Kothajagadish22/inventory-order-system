import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../components/Alert';
import { api } from '../api/client';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const data = await api.getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return <div className="panel">Loading dashboard...</div>;
  }

  if (error) {
    return <Alert type="error" message={error} onClose={() => setError('')} />;
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>Overview of inventory, customers, and orders</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Total Products</span>
          <strong>{stats.total_products}</strong>
        </div>
        <div className="stat-card">
          <span>Total Customers</span>
          <strong>{stats.total_customers}</strong>
        </div>
        <div className="stat-card">
          <span>Total Orders</span>
          <strong>{stats.total_orders}</strong>
        </div>
        <div className="stat-card warning">
          <span>Low Stock Items</span>
          <strong>{stats.low_stock_products.length}</strong>
        </div>
      </div>

      <section className="panel">
        <div className="panel-header">
          <h3>Low Stock Products</h3>
          <Link to="/products" className="text-link">
            Manage products
          </Link>
        </div>

        {stats.low_stock_products.length === 0 ? (
          <p className="empty-state">All products are above the low stock threshold.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {stats.low_stock_products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.sku}</td>
                    <td>${Number(product.price).toFixed(2)}</td>
                    <td>
                      <span className="badge badge-warning">{product.quantity_in_stock}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
