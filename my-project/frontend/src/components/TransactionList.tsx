import React from 'react';
import Icon from './Icon';
import type { Transaction } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete?: (id: string) => void;
}

export default function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="transaction-list">
      {transactions.length ? (
        transactions.map((t) => (
          <div className="transaction" key={t._id}>
            <div className={`transaction-icon ${t.color}`}>
              <Icon name={t.icon || 'bolt'} />
            </div>
            <div className="transaction-name">
              <strong>{t.merchant}</strong>
              <span>{t.category}</span>
            </div>
            <span className="transaction-date">{formatDate(t.createdAt || t.date)}</span>
            <strong className={t.amount > 0 ? 'amount income' : 'amount'}>
              {t.amount > 0 ? '+' : '-'}$
              {Math.abs(t.amount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </strong>
            {onDelete ? (
              <button
                className="icon-button row-menu"
                title="Delete transaction"
                onClick={() => onDelete(t._id)}
              >
                <Icon name="close" size={16} />
              </button>
            ) : (
              <button className="icon-button row-menu">
                <Icon name="dots" />
              </button>
            )}
          </div>
        ))
      ) : (
        <div className="empty-state">No matching transactions found.</div>
      )}
    </div>
  );
}
