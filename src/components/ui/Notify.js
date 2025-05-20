import { createRoot } from 'react-dom/client';
import React from 'react';

const notify = (message, type = 'info') => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500'
    };

    const NotifyComponent = () => {
        React.useEffect(() => {
            const timer = setTimeout(() => {
                root.unmount();
                container.remove();
            }, 3000); // 3 detik

            return () => clearTimeout(timer);
        }, []);

        return (
            <div 
                className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 px-4 py-2 rounded text-white shadow-lg ${colors[type]}`}
            >
                {message}
            </div>
        );
    };

    const root = createRoot(container);
    root.render(<NotifyComponent />);
};

export default notify;