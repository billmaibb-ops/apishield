'use client'
import Link from 'next/link'

const hourlyData = [12, 45, 89, 134, 210, 287, 342, 389, 421, 398, 445, 512, 489, 523, 498, 467, 534, 612, 589, 545, 498, 423, 312, 187]

const endpoints = [
  { path: '/api/v1/users', method: 'GET', calls: 18234, latency: '89ms', errorRate: '0.1%' },
  { path: '/api/v1/products', method: 'GET', calls: 14891, latency: '124ms', errorRate: '0.3%' },
  { path: '/api/v1/orders', method: 'POST', calls: 8743, latency: '203ms', errorRate: '0.8%' },
  { path: '/api/v1/auth/token', method: 'POST', calls: 5234, latency: '67ms', errorRate: '2.1%' },
  { path: '/api/v1/webhooks', method: 'POST', calls: 280, latency: '312ms', errorRate: '0.0%' },
]

const recentErrors = [
  { time: '14:32:01', endpoint: '/api/v1/auth/token', status: 429, message: 'Rate limit exceeded' },
  { time: '14:28:44', endpoint: '/api/v1/orders', status: 500, message: 'Internal server error' },
  { time: '14:19:12', endpoint: '/api/v1/auth/token', status: 401, message: 'Invalid API key' },
  { time: '14:07:33', endpoint: '/api/v1/orders', status: 422, message: 'Validation failed' },
]

const maxHourly = Math.max(...hourlyData)

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <Link href="/" className="text-gray-900 font-bold text-lg">🛡️ APIShield</Link>
        </div>
        <nav className="p-4 flex-1 space-y-1">
          {[
            { label: '📊 Dashboard', href: '/dashboard', active: false },
            { label: '🔑 API Keys', href: '/dashboard', active: false },
            { label: '📈 Analytics', href: '/analytics', active: true },
            { label: '⚙️ Settings', href: '#', active: false },
          ].map(item => (
            <Link key={item.label} href={item.href} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${item.active ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-500 text-sm mb-8">Last 24 hours — updates every 60 seconds</p>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Calls', value: '47,382', change: '+12%', up: true },
            { label: 'Success Rate', value: '99.7%', change: '+0.2%', up: true },
            { label: 'Avg Latency', value: '142ms', change: '-8ms', up: true },
            { label: 'Errors', value: '23', change: '+2', up: false },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="text-2xl font-bold text-gray-900 mb-1">{s.value}</div>
              <div className="text-gray-500 text-sm mb-1">{s.label}</div>
              <div className={`text-xs font-medium ${s.up ? 'text-green-600' : 'text-red-500'}`}>{s.change} vs yesterday</div>
            </div>
          ))}
        </div>

        {/* Hourly chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="font-semibold text-gray-900 mb-6">Requests per hour (last 24h)</h2>
          <div className="flex items-end gap-1 h-32">
            {hourlyData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="relative w-full">
                  <div
                    className="bg-indigo-500 hover:bg-indigo-400 rounded-t transition-colors w-full"
                    style={{ height: `${(val / maxHourly) * 112}px` }}
                    title={`${val} requests`}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span>
          </div>
        </div>

        {/* Top endpoints */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Top Endpoints</h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>{['Endpoint', 'Method', 'Calls', 'Avg Latency', 'Error Rate'].map(h => (
                <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {endpoints.map(e => (
                <tr key={e.path} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono text-gray-900">{e.path}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded ${e.method === 'GET' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{e.method}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-900">{e.calls.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{e.latency}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{e.errorRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent errors */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Recent Errors</h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>{['Time', 'Endpoint', 'Status', 'Message'].map(h => (
                <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentErrors.map((e, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono text-gray-500">{e.time}</td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-900">{e.endpoint}</td>
                  <td className="px-4 py-3"><span className="text-xs font-medium px-2 py-0.5 rounded bg-red-100 text-red-700">{e.status}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-600">{e.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
