import React, { useState, useEffect, useMemo } from 'react';
import TransactionList from '../components/TransactionList';
import Topbar from '../components/Topbar';
import AddTransactionModal from '../components/AddTransactionModal';
import { getTransactions, deleteTransaction } from '../services/transactionService';
import type { Transaction } from '../types';

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [modalOpen, setModalOpen] = useState(false);

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error('Failed to delete transaction:', err);
    }
  };

  const handleCreated = (newTx: Transaction) => {
    setTransactions((prev) => [newTx, ...prev]);
  };

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchesQuery = `${t.merchant} ${t.category}`
        .toLowerCase()
        .includes(query.toLowerCase());
      if (!matchesQuery) return false;
      if (filterType === 'all') return true;
      return t.type === filterType;
    });
  }, [transactions, query, filterType]);

  return (
    <>
      <Topbar
        title="Transactions"
        query={query}
        onQueryChange={setQuery}
        onAddTransaction={() => setModalOpen(true)}
      />

      <div className="page-content">
        <section className="panel full-panel">
          <div className="section-head">
            <div>
              <p className="eyebrow">CASH FLOW</p>
              <h2>{query ? `Results for "${query}"` : 'All transactions'}</h2>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className={`secondary-button ${filterType === 'all' ? 'active' : ''}`}
                onClick={() => setFilterType('all')}
                type="button"
              >
                All
              </button>
              <button
                className={`secondary-button ${filterType === 'income' ? 'active' : ''}`}
                onClick={() => setFilterType('income')}
                type="button"
              >
                Income
              </button>
              <button
                className={`secondary-button ${filterType === 'expense' ? 'active' : ''}`}
                onClick={() => setFilterType('expense')}
                type="button"
              >
                Expense
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ padding: '24px', textAlign: 'center' }}>Loading transactions...</div>
          ) : (
            <TransactionList transactions={filtered} onDelete={handleDelete} />
          )}
        </section>
      </div>

      <AddTransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleCreated}
      />
    </>
  );
}
