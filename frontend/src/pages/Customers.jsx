import { useEffect, useState } from 'react';
import Alert from '../components/Alert';
import Modal from '../components/Modal';
import { api } from '../api/client';

const emptyCustomer = {
  full_name: '',
  email: '',
  phone: '',
};

function validateCustomer(form) {
  const errors = {};
  if (!form.full_name.trim()) errors.full_name = 'Full name is required';
  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address';
  }
  if (!form.phone.trim()) errors.phone = 'Phone number is required';
  else if (form.phone.trim().length < 5) errors.phone = 'Phone number is too short';
  return errors;
}

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(emptyCustomer);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  async function loadCustomers() {
    try {
      setLoading(true);
      const data = await api.getCustomers();
      setCustomers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  function openModal() {
    setForm(emptyCustomer);
    setErrors({});
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setForm(emptyCustomer);
    setErrors({});
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateCustomer(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await api.createCustomer({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      });
      setMessage('Customer created successfully');
      closeModal();
      await loadCustomers();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(customerId) {
    if (!window.confirm('Delete this customer?')) return;
    try {
      await api.deleteCustomer(customerId);
      setMessage('Customer deleted successfully');
      await loadCustomers();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Customers</h2>
          <p>Manage customer records and contact details</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openModal}>
          Add Customer
        </button>
      </div>

      <Alert type="success" message={message} onClose={() => setMessage('')} />
      <Alert type="error" message={error} onClose={() => setError('')} />

      <section className="panel">
        {loading ? (
          <p className="empty-state">Loading customers...</p>
        ) : customers.length === 0 ? (
          <p className="empty-state">No customers yet. Add your first customer.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.full_name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td className="actions">
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(customer.id)}
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
        <Modal title="Add Customer" onClose={closeModal}>
          <form className="form" onSubmit={handleSubmit}>
            <label>
              Full Name
              <input
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder="Jane Doe"
              />
              {errors.full_name && <span className="field-error">{errors.full_name}</span>}
            </label>

            <label>
              Email Address
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="jane@example.com"
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </label>

            <label>
              Phone Number
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+1 555 0100"
              />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </label>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Customer
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
