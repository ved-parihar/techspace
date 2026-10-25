import React from 'react';
import Icon from './Icon';
import type { IconName } from '../types';

interface StatProps {
  title: string;
  value: string;
  trend: string;
  icon: IconName;
  color: string;
}

export default function StatCard({ title, value, trend, icon, color }: StatProps) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${color}`}>
        <Icon name={icon} />
      </div>
      <div>
        <p>{title}</p>
        <strong>{value}</strong>
      </div>
      <span className={color === 'orange' ? 'metric down' : 'metric'}>{trend}</span>
    </article>
  );
}
