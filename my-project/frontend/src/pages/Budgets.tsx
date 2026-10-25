import React, { useState, useEffect } from 'react';
import Icon from '../components/Icon';
import Topbar from '../components/Topbar';
import { getBudgets, createBudget } from '../services/budgetService';
import type { Budget, IconName } from '../types';

export default function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('Food & Drinks');
  const [newLimit, setNewLimit] = useState('');

  const fetchBudgets = async () => {
    try {
      const data = await getBudgets();
      setBudgets(data);
    } catch (err) {
      console.error('Failed to load budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleCreateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLimit) return;
    try {
      const limitVal = Number(newLimit);
      await createBudget({
        category: newCategory,
        limit: limitVal,
      });
      setModalOpen(false);
      setNewLimit('');
      fetchBudgets();
    } catch (err) {
      console.error('Failed to save budget:', err);
    }
  };

  const currentMonthName = new Date().toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  }).toUpperCase();

  const getIconForCategory = (cat: string): IconName => {
    switch (cat) {
      case 'Housing':
        return 'home';
      case 'Transport':
        return 'car';
      case 'Shopping':
        return 'bag';
      case 'Food & Drinks':
        return 'coffee';
      default:
        return 'bolt';
    }
  };

  return (
    <>
      <Topbar title="Budgets" />

      <div className="page-content">
        <div className="intro">
          <div>
            <p className="eyebrow">{currentMonthName}</p>
            <h2>Plan every dollar with intention.</h2>
            <p>Set comfortable limits and stay ahead of your monthly goals.</p>
          </div>
          <button
            className="primary-button"
            type="button"
            onClick={() => setModalOpen(true)}
          >
            <Icon name="plus" />
            Create budget
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '24px', textAlign: 'center' }}>Loading budgets...</div>
        ) : (
          <section className="budget-cards">
            {budgets.map((b) => {
              const spent = b.spent || 0;
              const limit = b.limit || 1;
              const percent = Math.min(100, Math.round((spent / limit) * 100));
              const remaining = limit - spent;
              const iconName = b.icon || getIconForCategory(b.category);

              return (
                <article className="category-budget" key={b._id || b.category}>
                  <div className={`transaction-icon ${b.color || 'blue'}`}>
                    <Icon name={iconName} />
                  </div>
                  <div className="budget-copy">
                    <div>
                      <strong>{b.category}</strong>
                      <span>
                        ${Math.round(spent)} of ${Math.round(limit)}
                      </span>
                    </div>
                    <div className="budget-line">
                      <i style={{ width: `${percent}%` }} />
                    </div>
                    <small>
                      {remaining >= 0
                        ? `$${Math.round(remaining)} left`
                        : `$${Math.abs(Math.round(remaining))} over limit`}
                    </small>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>

      {modalOpen && (
        <div className="modal-backdrop" onMouseDown={() => setModalOpen(false)}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p className="eyebrow">BUDGET LIMIT</p>
                <h2>Set monthly budget</h2>
              </div>
              <button
                className="icon-button"
                onClick={() => setModalOpen(false)}
                aria-label="Close"
                type="button"
              >
                <Icon name="close" />
              </button>
            </div>
            <form onSubmit={handleCreateBudget}>
              <label>
                Category
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  <option>Food & Drinks</option>
                  <option>Shopping</option>
                  <option>Housing</option>
                  <option>Transport</option>
                  <option>Other</option>
                </select>
              </label>
              <label>
                Monthly limit ($)
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g. 500"
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  required
                />
              </label>
              <button className="primary-button submit" type="submit">
                Save budget
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
