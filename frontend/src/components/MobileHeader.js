// 在 Navbar.js 的 return 顶部替换为你需要的结构：
<nav className="md:hidden bg-white sticky top-0 z-50">
  <div className="flex items-center justify-between px-4 py-2">
    {/* 左侧 Logo */}
    <div className="text-xl font-black text-black italic">
      <span className="text-[#b2d235]">FRESH</span>CO
    </div>
    
    {/* 右侧图标 */}
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-1 border rounded px-2 py-0.5">
        <span>🇺🇸</span>
        <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </div>
      <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
    </div>
  </div>
</nav>
