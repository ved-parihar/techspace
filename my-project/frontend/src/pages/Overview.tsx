import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import StatCard from '../components/StatCard';
import TransactionList from '../components/TransactionList';
import Topbar from '../components/Topbar';
import AddTransactionModal from '../components/AddTransactionModal';
import { getTransactions, deleteTransaction } from '../services/transactionService';
import type { Transaction } from '../types';

export default function Overview() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
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

  // Calculations
  const { totalBalance, totalIncome, totalExpenses, savingsRate } = useMemo(() => {
    let income = 0;
    let expenses = 0;

    transactions.forEach((t) => {
      if (t.amount > 0) {
        income += t.amount;
      } else {
        expenses += Math.abs(t.amount);
      }
    });

    const balance = income - expenses;
    const rate = income > 0 ? ((income - expenses) / income) * 100 : 0;

    return {
      totalBalance: balance,
      totalIncome: income,
      totalExpenses: expenses,
      savingsRate: Math.max(0, rate).toFixed(1),
    };
  }, [transactions]);

  const filtered = useMemo(() => {
    return transactions.filter((t) =>
      `${t.merchant} ${t.category}`.toLowerCase().includes(query.toLowerCase())
    );
  }, [transactions, query]);

  return (
    <>
      <Topbar
        title="Overview"
        query={query}
        onQueryChange={setQuery}
        onAddTransaction={() => setModalOpen(true)}
      />

      <div className="page-content">
        <section className="hero-card">
          <div>
            <p className="card-label">TOTAL BALANCE</p>
            <div className="balance">
              $
              {Math.floor(Math.abs(totalBalance)).toLocaleString()}
              <span>
                .
                {(Math.abs(totalBalance) % 1)
                  .toFixed(2)
                  .substring(2)}
              </span>
            </div>
            <div className="trend positive">
              <Icon name="arrowUp" size={15} /> 8.4% <span>from last month</span>
            </div>
          </div>
          <div className="hero-chart">
            <div className="chart-head">
              <div>
                <span>Income</span>
                <strong>${Math.round(totalIncome).toLocaleString()}</strong>
              </div>
              <div>
                <span>Expenses</span>
                <strong>${Math.round(totalExpenses).toLocaleString()}</strong>
              </div>
            </div>
            <svg viewBox="0 0 500 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#ef8354" stopOpacity=".4" />
                  <stop offset="1" stopColor="#ef8354" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                className="area"
                d="M0 100 C50 90 70 45 125 65 S210 105 260 55 S340 75 390 32 S450 50 500 10 V120 H0Z"
              />
              <path
                className="line"
                d="M0 100 C50 90 70 45 125 65 S210 105 260 55 S340 75 390 32 S450 50 500 10"
              />
            </svg>
          </div>
        </section>

        <section className="stat-grid">
          <StatCard
            title="Income"
            value={`$${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            trend="+12.5%"
            icon="arrowDown"
            color="green"
          />
          <StatCard
            title="Expenses"
            value={`$${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            trend="-4.2%"
            icon="arrowUp"
            color="orange"
          />
          <StatCard
            title="Savings rate"
            value={`${savingsRate}%`}
            trend="+6.8%"
            icon="chart"
            color="purple"
          />
        </section>

        <div className="content-grid">
          <section className="panel transactions-panel">
            <div className="section-head">
              <div>
                <p className="eyebrow">LATEST ACTIVITY</p>
                <h2>Recent transactions</h2>
              </div>
              <button
                className="text-button"
                onClick={() => navigate('/transactions')}
                type="button"
              >
                View all <span>→</span>
              </button>
            </div>
            {loading ? (
              <div style={{ padding: '24px', textAlign: 'center' }}>Loading transactions...</div>
            ) : (
              <TransactionList
                transactions={filtered.slice(0, 5)}
                onDelete={handleDelete}
              />
            )}
          </section>

          <section className="panel budget-panel">
            <div className="section-head">
              <div>
                <p className="eyebrow">MONTHLY BUDGET</p>
                <h2>Monthly spending</h2>
              </div>
              <button className="icon-button" type="button">
                <Icon name="dots" />
              </button>
            </div>
            <div className="budget-ring">
              <div>
                <strong>
                  {Math.min(
                    100,
                    Math.round((totalExpenses / (5000 || 1)) * 100)
                  )}
                  %
                </strong>
                <span>used</span>
              </div>
            </div>
            <div className="budget-total">
              <span>${Math.round(totalExpenses).toLocaleString()} spent</span>
              <span>$5,000 limit</span>
            </div>
            <div className="budget-line">
              <i
                style={{
                  width: `${Math.min(100, (totalExpenses / 5000) * 100)}%`,
                }}
              />
            </div>
            <p className="budget-note">
              <strong>
                ${Math.max(0, 5000 - Math.round(totalExpenses)).toLocaleString()}
              </strong>{' '}
              available for the remaining month
            </p>
          </section>
        </div>
      </div>

      <AddTransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleCreated}
      />
    </>
  );
}
