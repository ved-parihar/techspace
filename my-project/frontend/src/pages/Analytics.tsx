import React from 'react';
import Icon from '../components/Icon';
import Topbar from '../components/Topbar';

export default function Analytics() {
  return (
    <>
      <Topbar title="Analytics" />

      <div className="page-content">
        <div className="intro">
          <div>
            <p className="eyebrow">YOUR MONEY STORY</p>
            <h2>Spending analytics</h2>
            <p>Understand where your money goes and spot trends early.</p>
          </div>
          <select className="period-select">
            <option>Last 6 months</option>
            <option>This year</option>
          </select>
        </div>

        <div className="analytics-grid">
          <section className="panel bars-panel">
            <div className="section-head">
              <h2>Income vs. expenses</h2>
              <span className="legend">
                <i /> Income <i /> Expenses
              </span>
            </div>
            <div className="bars">
              {[62, 78, 55, 86, 68, 74].map((h, i) => (
                <div className="bar-group" key={i}>
                  <div>
                    <i style={{ height: `${h}%` }} />
                    <i style={{ height: `${h - 22}%` }} />
                  </div>
                  <span>{['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'][i]}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel insight-panel">
            <p className="eyebrow">TOP INSIGHT</p>
            <div className="insight-icon">
              <Icon name="bolt" />
            </div>
            <h2>Your savings are growing.</h2>
            <p>
              You're on track to save <strong>$18,400</strong> this year—24% more than last year.
            </p>
            <button className="secondary-button" type="button">
              See full report
            </button>
          </section>
        </div>
      </div>
    </>
  );
}
