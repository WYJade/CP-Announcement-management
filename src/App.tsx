import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import OTIFDashboard from './components/Dashboard/OTIFDashboard'
import KPIDashboard from './components/Dashboard/KPIDashboard'
import InvoiceList from './components/Finance/InvoiceList'
import InvoiceDetail from './components/Finance/InvoiceDetail'
import RequestsView from './components/CollaborationCenter/RequestsView'
import SubmitRequestPage from './components/CollaborationCenter/SubmitRequestPage'
import WorkItemDetail from './components/CollaborationCenter/WorkItemDetail'
import InventoryActivity from './components/Inventory/InventoryActivity'
import WholesaleOrders from './components/Orders/WholesaleOrders'
import RetailOrders from './components/Orders/RetailOrders'
import OutboundInquiry from './components/Orders/OutboundInquiry'
import InboundInquiry from './components/Orders/InboundInquiry'
import ReceiptDetail from './components/Inbound/ReceiptDetail'
import Shipments from './components/Shipping/Shipments'
import Tracking from './components/Shipping/Tracking'
import CustomsEntries from './components/International/CustomsEntries'
import CustomsEntryDetail from './components/International/CustomsEntryDetail'
import IntlShipments from './components/International/IntlShipments'
import IntlShipmentDetail from './components/International/IntlShipmentDetail'
import Containers from './components/International/Containers'
import ContainerDetail from './components/International/ContainerDetail'
import DrayageLoads from './components/International/DrayageLoads'
import DrayageLoadDetail from './components/International/DrayageLoadDetail'
import IntlTracking from './components/International/IntlTracking'
import IntlTrackingDetail from './components/International/IntlTrackingDetail'
import AgentWorkstation from './components/Agents/AgentWorkstation'
import UserProfile from './components/UserProfile/UserProfile'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<OTIFDashboard />} />
        <Route path="dashboard/otif" element={<OTIFDashboard />} />
        <Route path="dashboard/kpi" element={<KPIDashboard />} />
        <Route path="finance/invoices" element={<InvoiceList />} />
        <Route path="finance/invoice/:invoiceNumber" element={<InvoiceDetail />} />

        {/* Service & Support — Requests */}
        <Route path="support" element={<Navigate to="/support/requests" replace />} />
        <Route path="support/requests" element={<RequestsView />} />
        <Route path="support/requests/new" element={<SubmitRequestPage />} />
        <Route path="support/item/:id" element={<WorkItemDetail />} />
        {/* Legacy collab redirects */}
        <Route path="collaboration" element={<Navigate to="/support/requests" replace />} />
        <Route path="collaboration/requests" element={<Navigate to="/support/requests" replace />} />
        <Route path="collaboration/requests/new" element={<Navigate to="/support/requests/new" replace />} />
        <Route path="collaboration/item/:id" element={<WorkItemDetail />} />

        {/* Sales Orders */}
        <Route path="sales/wholesale" element={<WholesaleOrders />} />
        <Route path="sales/retail" element={<RetailOrders />} />

        {/* Outbound */}
        <Route path="outbound/inquiry" element={<OutboundInquiry />} />

        {/* Inbound */}
        <Route path="inbound/inquiry" element={<InboundInquiry />} />
        <Route path="inbound/receipt/:id" element={<ReceiptDetail />} />

        {/* Inventory */}
        <Route path="inventory/activity" element={<InventoryActivity />} />

        {/* Shipping */}
        <Route path="shipping/shipments" element={<Shipments />} />
        <Route path="shipping/tracking" element={<Tracking />} />

        {/* International */}
        <Route path="international/customs" element={<CustomsEntries />} />
        <Route path="international/customs/:id" element={<CustomsEntryDetail />} />
        <Route path="international/shipments" element={<IntlShipments />} />
        <Route path="international/shipments/:id" element={<IntlShipmentDetail />} />
        <Route path="international/containers" element={<Containers />} />
        <Route path="international/containers/:id" element={<ContainerDetail />} />
        <Route path="international/drayage" element={<DrayageLoads />} />
        <Route path="international/drayage/:id" element={<DrayageLoadDetail />} />
        <Route path="international/tracking" element={<IntlTracking />} />
        <Route path="international/tracking/:id" element={<IntlTrackingDetail />} />

        {/* Agents / AI Native */}
        <Route path="agents" element={<AgentWorkstation />} />

        {/* User Profile */}
        <Route path="profile" element={<UserProfile />} />
      </Route>
    </Routes>
  )
}

export default App
