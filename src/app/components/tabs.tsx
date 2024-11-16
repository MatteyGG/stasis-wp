'use client'
import React, { useState } from 'react';

interface TabsProps {
  tabs: string[];
  tabContents: React.ReactNode[];
}

function Tabs({ tabs, tabContents }: TabsProps) {
  const [activeTab, setActiveTab] = useState(3);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className="tabs grid">
      <div className="tab-buttons">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab-button ${activeTab === index ? 'active' : ''}`}
            onClick={() => handleTabClick(index)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="tab-content">{tabContents[activeTab]}</div>
    </div>
  );
}

export default Tabs;
