import React from 'react';

const names = ['خينش', 'مازوزي', 'عريبي', 'مراد البزنطي', 'مراد الماغولي', 'العيد', 'السبع'];

// A fixed set of styles for a more designed chaos, rather than pure random
const styles = [
    { top: '15%', left: '20%', transform: 'rotate(-15deg)', fontSize: '3.5rem', opacity: 0.1 },
    { top: '25%', left: '80%', transform: 'rotate(20deg) translateX(-50%)', fontSize: '4rem', opacity: 0.08 },
    { top: '80%', left: '15%', transform: 'rotate(10deg)', fontSize: '3.5rem', opacity: 0.09 },
    { top: '60%', left: '85%', transform: 'rotate(-10deg) translateX(-50%)', fontSize: '5rem', opacity: 0.07 },
    { top: '90%', left: '50%', transform: 'rotate(15deg) translateX(-50%)', fontSize: '4rem', opacity: 0.11 },
    { top: '40%', left: '10%', transform: 'rotate(-25deg)', fontSize: '4.5rem', opacity: 0.08 },
    { top: '8%', left: '55%', transform: 'rotate(5deg)', fontSize: '3.2rem', opacity: 0.09 },
];

const ChaoticNames: React.FC = () => {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {names.map((name, i) => (
                <span
                    key={name}
                    className="absolute font-black text-slate-200 whitespace-nowrap"
                    style={{
                        ...styles[i % styles.length]
                    }}
                >
                    {name}
                </span>
            ))}
        </div>
    );
};

export default ChaoticNames;