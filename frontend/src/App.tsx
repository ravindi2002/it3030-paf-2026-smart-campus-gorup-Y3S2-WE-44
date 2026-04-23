import { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={isOpen} />
      <div className="flex-1 flex flex-col">
        <Navbar toggle={() => setIsOpen(!isOpen)} isOpen={isOpen} />
        <div className="p-6 bg-gray-100 flex-1 overflow-auto">
          <AppRoutes />
        </div>
      </div>
    </div>
  );
}