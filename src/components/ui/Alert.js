import { createRoot } from 'react-dom/client';
import React from 'react';

const alert = (message = '', info = '') => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const AlertComponent = () => {
        const handleClose = () => {
            root.unmount();
            container.remove();
        };

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-sm w-full" style={{ border: '0.5px solid #3b82f6' }}>
                    <h2 className="text-xl font-semibold mb-2">{info}</h2>
                    <p className="text-gray-700 mb-4">{message}</p>
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        OK
                    </button>
                </div>
            </div>
        );
    };

    const root = createRoot(container);
    root.render(<AlertComponent />);
};

export default alert;