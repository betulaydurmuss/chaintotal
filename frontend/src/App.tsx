import { Routes, Route } from 'react-router-dom'
import { Layout } from '@components/layout/Layout'
import { Dashboard } from '@pages/Dashboard'
import { Results } from '@pages/Results'
import { History } from '@pages/History'
import { Community } from '@pages/Community'
import { NotFound } from '@pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="results/:queryId" element={<Results />} />
        <Route path="history" element={<History />} />
        <Route path="community" element={<Community />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
