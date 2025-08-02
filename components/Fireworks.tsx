import React from 'react';

const Fireworks: React.FC = () => {
    return (
        <div className="fireworks-container" aria-hidden="true">
            {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="firework"></div>
            ))}
        </div>
    );
};

export default Fireworks;