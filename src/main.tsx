import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { I18nProvider } from './context/I18nContext'
import { BannerProvider } from './context/BannerContext'
import { MessageCenterProvider } from './context/MessageCenterContext'
import { CollaborationProvider } from './context/CollaborationContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <I18nProvider>
        <BannerProvider>
          <MessageCenterProvider>
            <CollaborationProvider>
              <App />
            </CollaborationProvider>
          </MessageCenterProvider>
        </BannerProvider>
      </I18nProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
