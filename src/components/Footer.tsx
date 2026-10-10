import Link from 'next/link';
import { Globe, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 text-xs">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        
        {/* Top Links Grid (Udemy Style) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-900">
          <div className="space-y-2.5">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Future Light Business</h4>
            <ul className="space-y-2 text-slate-400 font-medium">
              <li><Link href="/courses" className="hover:text-white transition">Teach on Future Light</Link></li>
              <li><Link href="/courses" className="hover:text-white transition">Get the app</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About Future Light Global</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Careers & Resources</h4>
            <ul className="space-y-2 text-slate-400 font-medium">
              <li><Link href="/courses" className="hover:text-white transition">Explore All Courses</Link></li>
              <li><Link href="/my-courses" className="hover:text-white transition">My Learning</Link></li>
              <li><Link href="/transactions" className="hover:text-white transition">Purchase & Receipt Logs</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Legal & Compliance</h4>
            <ul className="space-y-2 text-slate-400 font-medium">
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/refund-policy" className="hover:text-white transition">Refund Policy</Link></li>
              <li><Link href="/admin/login" className="hover:text-purple-400 transition">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Language Selector Box */}
          <div className="flex justify-start md:justify-end items-start">
            <button className="px-4 py-2 border border-slate-700 rounded-md text-white font-bold flex items-center space-x-2 hover:bg-slate-900 transition">
              <Globe className="h-4 w-4 text-purple-400" />
              <span>English</span>
            </button>
          </div>
        </div>

        {/* Bottom Branding Row */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500">
          <div className="flex items-center space-x-2">
            <div className="h-7 w-7 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-white font-extrabold text-xs">
              FL
            </div>
            <span className="font-extrabold text-white text-sm">Future Light Global Academy</span>
          </div>
          <div>© {new Date().getFullYear()} Future Light Global, Inc. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
