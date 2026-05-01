import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { HomePage } from './pages/HomePage'
import { ShareProfilePage } from './pages/ShareProfilePage'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/u/:username" element={<ShareProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
