/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { LandingPage } from './LandingPage';
import { ConfiguratorPage } from './components/Configurator/ConfiguratorPage';
import { Navbar } from './components/Navigation/Navbar';
import { ManagerDashboard } from './components/Dashboard/ManagerDashboard';
import { CustomerDashboard } from './components/Dashboard/CustomerDashboard';
import { ProductPage } from './components/Product/ProductPage';
import { CartPage } from './components/Cart/CartPage';

type View = 'landing' | 'product' | 'cart' | 'configurator' | 'manager_dashboard' | 'customer_dashboard';

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [productId, setProductId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const showOrders = (message: string) => {
    setNotice(message);
    setView('customer_dashboard');
  };

  return (
    <div className="min-h-screen bg-pink-50/10">
      <Navbar currentView={view} onNavigate={setView} />

      <div className={`pt-16 min-h-[calc(100vh-64px)] ${view === 'configurator' ? '' : 'pb-20 sm:pb-0'}`}>
        {view === 'landing' && (
          <LandingPage
            onStart={() => setView('configurator')}
            onOpenProduct={(id) => {
              setProductId(id);
              setView('product');
            }}
          />
        )}
        {view === 'product' && productId && (
          <ProductPage productId={productId} onBack={() => setView('landing')} />
        )}
        {view === 'cart' && (
          <CartPage onShop={() => setView('landing')} onPlaced={showOrders} />
        )}
        {view === 'configurator' && (
          <ConfiguratorPage
            onBack={() => setView('landing')}
            onPlaced={showOrders}
          />
        )}
        {view === 'manager_dashboard' && (
          <div className="p-4 md:p-8">
            <ManagerDashboard />
          </div>
        )}
        {view === 'customer_dashboard' && (
          <div className="p-4 md:p-8">
            <CustomerDashboard
              notice={notice}
              onDismissNotice={() => setNotice(null)}
              onShop={() => setView('landing')}
            />
          </div>
        )}
      </div>
    </div>
  );
}
