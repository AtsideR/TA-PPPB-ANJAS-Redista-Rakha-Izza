import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { DataProvider } from './contexts/DataContext'


createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<BrowserRouter>
			<DataProvider>
				<App />
			</DataProvider>
		</BrowserRouter>
	</React.StrictMode>
)


if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW failed:', err))
	})
}