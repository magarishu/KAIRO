import { Bell, Smartphone, Mail, MessageSquare } from "lucide-react";

export function NotificationsTab() {
  const NotificationRow = ({ title, desc, email, sms, tg }: { title: string, desc: string, email?: boolean, sms?: boolean, tg?: boolean }) => (
    <div className="flex items-center justify-between py-4 border-b border-[#2C2C2E] last:border-0">
      <div className="pr-4">
        <p className="text-sm font-bold text-white mb-1">{title}</p>
        <p className="text-xs text-gray-400">{desc}</p>
      </div>
      <div className="flex items-center gap-6 shrink-0">
        <label className="flex items-center justify-center w-8 h-8 cursor-pointer relative">
          <input type="checkbox" defaultChecked={email} className="peer sr-only" />
          <div className="w-10 h-5 bg-[#2C2C2E] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[6px] after:left-[4px] after:bg-gray-400 peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
        </label>
        <label className="flex items-center justify-center w-8 h-8 cursor-pointer relative">
          <input type="checkbox" defaultChecked={sms} className="peer sr-only" />
          <div className="w-10 h-5 bg-[#2C2C2E] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[6px] after:left-[4px] after:bg-gray-400 peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
        </label>
        <label className="flex items-center justify-center w-8 h-8 cursor-pointer relative">
          <input type="checkbox" defaultChecked={tg} className="peer sr-only" />
          <div className="w-10 h-5 bg-[#2C2C2E] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[6px] after:left-[4px] after:bg-gray-400 peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
        </label>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      <div className="border-b border-[#2C2C2E] pb-5">
        <h2 className="text-xl font-bold text-white tracking-wide">Notifications & Alerts</h2>
        <p className="text-sm text-gray-400 mt-1">Configure how and when you want to be alerted about your account.</p>
      </div>

      <div className="bg-[#161618] border border-[#2C2C2E] rounded-xl overflow-hidden">
        <div className="p-5 border-b border-[#2C2C2E] bg-[#111113] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-purple-400" />
            Alert Preferences
          </h3>
          <div className="flex gap-6 pr-2">
            <div className="w-8 flex justify-center"><Mail className="w-4 h-4 text-gray-500" /></div>
            <div className="w-8 flex justify-center"><Smartphone className="w-4 h-4 text-gray-500" /></div>
            <div className="w-8 flex justify-center"><MessageSquare className="w-4 h-4 text-gray-500" /></div>
          </div>
        </div>
        <div className="p-6">
          <NotificationRow 
            title="Trade Executions" 
            desc="Get notified immediately when a master account places or closes a trade." 
            tg={true}
          />
          <NotificationRow 
            title="Drawdown Warnings" 
            desc="Critical alerts when an account hits your predefined drawdown thresholds." 
            email={true} sms={true} tg={true}
          />
          <NotificationRow 
            title="Connection Errors" 
            desc="Alerts if a broker connection is lost or a trade fails to copy." 
            email={true} sms={true} tg={true}
          />
          <NotificationRow 
            title="Weekly Summary" 
            desc="Receive a weekly report of your aggregate P&L and performance metrics." 
            email={true}
          />
        </div>
      </div>

      {/* External Integration Config */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#161618] border border-[#2C2C2E] rounded-xl overflow-hidden p-6">
          <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#0088cc]" />
            Telegram Integration
          </h3>
          <p className="text-xs text-gray-400 mb-4">Connect our Telegram bot to receive instant push notifications.</p>
          <input 
            type="text" 
            placeholder="Telegram Chat ID"
            defaultValue="129481923"
            className="w-full bg-[#111113] border border-[#2C2C2E] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors mb-3"
          />
          <button className="px-4 py-2 rounded-lg border border-[#2C2C2E] text-xs font-bold text-white hover:bg-[#2C2C2E] transition-colors">
            Verify Connection
          </button>
        </div>
      </div>
      
    </div>
  );
}
