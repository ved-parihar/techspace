import React, { useState, FormEvent } from 'react';
import Icon from './Icon';
import { createTransaction } from '../services/transactionService';
import type { Transaction, IconName } from '../types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newTx: Transaction) => void;
}

const categoryDetails: Record<string, { icon: IconName; color: string }> = {
  'Food & Drinks': { icon: 'coffee', color: 'orange' },
  'Shopping': { icon: 'bag', color: 'purple' },
  'Housing': { icon: 'home', color: 'blue' },
  'Transport': { icon: 'car', color: 'yellow' },
  'Income': { icon: 'wallet', color: 'green' },
  'Other': { icon: 'bolt', color: 'blue' },
};

export default function AddTransactionModal({
  isOpen,
  onClose,
  onCreated,
}: AddTransactionModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const data = new FormData(event.currentTarget);
      const merchant = String(data.get('merchant'));
      const amount = Number(data.get('amount'));
      const type = data.get('type') as 'income' | 'expense';
      const category = String(data.get('category'));

      const details = categoryDetails[category] || { icon: 'bolt', color: 'blue' };

      const newTx = await createTransaction({
        merchant,
        amount,
        type,
        category,
        icon: details.icon,
        color: details.color,
      });

      onCreated(newTx);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save transaction');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="eyebrow">NEW ENTRY</p>
            <h2>Add transaction</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close" type="button">
            <Icon name="close" />
          </button>
        </div>

        {error && <p style={{ color: '#ef4444', marginBottom: '12px' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>
            Merchant or source
            <input name="merchant" placeholder="e.g. Grocery store" required />
          </label>
          <div className="form-row">
            <label>
              Amount
              <input
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                required
              />
            </label>
            <label>
              Type
              <select name="type">
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </label>
          </div>
          <label>
            Category
            <select name="category">
              <option>Food & Drinks</option>
              <option>Shopping</option>
              <option>Housing</option>
              <option>Transport</option>
              <option>Income</option>
              <option>Other</option>
            </select>
          </label>
          <button className="primary-button submit" type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save transaction'}
          </button>
        </form>
      </div>
    </div>
  );
}
