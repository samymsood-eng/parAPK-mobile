
import React, { useState, useMemo } from 'react';
import { 
  Shield, UserPlus, Trash2, ShieldCheck, ShieldAlert, UserCog, Check, 
  X, Search, Zap, Info, Lock, User, MoreHorizontal, ChevronRight, 
  Activity, Settings, UserCheck, Camera, UserCircle, Save, AlertTriangle, Eye, EyeOff, Clock, LogOut as LogOutIcon, LogIn as LogInIcon
} from 'lucide-react';
import { UserAccount, UserRole } from '../types';

interface UserPermissionsProps {
  users: UserAccount[];
  currentUser: UserAccount | null;
  onTogglePermission: (userId: string, permission: keyof UserAccount['permissions']) => void;
  onAddUser: (user: Omit<UserAccount, 'id' | 'lastLogin'>) => void;
  onDeleteUser: (userId: string) => void;
}

const UserPermissions: React.FC<UserPermissionsProps> = ({ 
  users, 
  currentUser, 
  onTogglePermission, 
  onAddUser, 
  onDeleteUser 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [newUserRole, setNewUserRole] = useState<UserRole>('operator');
  
  const isAdmin = useMemo(() => currentUser?.role === 'admin', [currentUser]);

  const filteredUsers = useMemo(() => 
    users.filter(user => 
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    ), [users, searchTerm]
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserPassword.trim()) return;
    
    onAddUser({
      username: newUserName,
      password: newUserPassword,
      role: newUserRole,
      permissions: {
        canScan: true,
        canConnect: true,
        canManageUsers: newUserRole === 'admin'
      }
    });
    
    setNewUserName('');
    setNewUserPassword('');
    setNewUserRole('operator');
    setIsAddModalOpen(false);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-[10px] font-bold uppercase tracking-wider">
            <Shield size={10} /> مدير عام
          </div>
        );
      case 'operator':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-bold uppercase tracking-wider">
            <UserCog size={10} /> مشغل نظام
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-500/10 border border-slate-500/20 rounded-full text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <Activity size={10} /> مشاهد
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 text-right font-['Noto Kufi Arabic'] pb-20 animate-in fade-in duration-500">
      
      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-500">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center flex-row-reverse">
                <h3 className="text-xl font-bold text-white flex items-center gap-3 flex-row-reverse">
                  <UserPlus className="text-blue-500" /> إضافة عضو للفريق
                </h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mr-1 block">اسم المستخدم</label>
                  <input 
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-4 text-sm text-right focus:outline-none focus:border-blue-500/50 transition-all text-slate-200"
                    placeholder="اسم الدخول..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mr-1 block">كلمة المرور</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      required
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pr-4 pl-12 text-sm text-right focus:outline-none focus:border-blue-500/50 transition-all text-slate-200 font-mono tracking-widest"
                      placeholder="••••••••"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mr-1 block">نوع الصلاحية (الدور)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      type="button"
                      onClick={() => setNewUserRole('operator')}
                      className={`py-3 rounded-2xl border text-xs font-bold transition-all ${newUserRole === 'operator' ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
                    >
                      مشغل نظام
                    </button>
                    <button 
                      type="button"
                      onClick={() => setNewUserRole('admin')}
                      className={`py-3 rounded-2xl border text-xs font-bold transition-all ${newUserRole === 'admin' ? 'bg-red-600 border-red-500 text-white shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
                    >
                      مدير عام
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                   <button 
                    type="submit"
                    className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-sm transition-all shadow-xl shadow-blue-900/30 flex items-center justify-center gap-2"
                  >
                    <Save size={18} /> حفظ العضو
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10 flex-row-reverse">
          <div className="flex items-center gap-4 flex-row-reverse">
             <div className="w-16 h-16 bg-emerald-500/10 rounded-[1.5rem] flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-inner">
               <ShieldCheck size={32} />
             </div>
             <div>
                <h2 className="text-2xl font-bold text-white mb-1">إدارة أمن الفريق</h2>
                <p className="text-sm text-slate-500 font-medium">تتبع أوقات التواجد والتحكم في صلاحيات الوصول.</p>
             </div>
          </div>
          
          {isAdmin ? (
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-7 py-4 rounded-2xl text-sm font-bold flex items-center gap-2.5 transition-all shadow-xl shadow-blue-900/30 active:scale-95"
            >
              <UserPlus size={18} />
              إضافة عضو جديد
            </button>
          ) : (
            <div className="px-5 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3 flex-row-reverse text-amber-500">
               <Lock size={16} />
               <span className="text-[11px] font-bold">وضع العرض فقط - لا تملك صلاحيات التعديل</span>
            </div>
          )}
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative">
        <div className="flex items-center justify-between mb-10 flex-row-reverse gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
            <input 
              type="text" 
              placeholder="ابحث عن عضو..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pr-12 pl-4 text-sm text-right focus:outline-none focus:border-blue-500/50 transition-all text-slate-200 placeholder:text-slate-700 shadow-inner"
            />
          </div>
          <div className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] hidden lg:block">Total Access Control Panel</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredUsers.map(user => (
            <div key={user.id} className={`bg-slate-950/40 border rounded-[2.2rem] p-7 transition-all group relative overflow-hidden ${isAdmin ? 'hover:border-slate-600 border-slate-800/80' : 'border-slate-800/40 opacity-80'}`}>
              
              <div className="flex items-center justify-between mb-8 flex-row-reverse">
                <div className="flex items-center gap-4 flex-row-reverse text-right">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg border transition-all ${user.role === 'admin' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                    {user.username.charAt(0)}
                  </div>
                  <div>
                    <p className="text-base font-bold text-white mb-1.5">{user.username}</p>
                    <div className="flex items-center gap-2 flex-row-reverse">
                       {getRoleBadge(user.role)}
                       <div className="px-2 py-0.5 bg-slate-800 rounded-md border border-slate-700 flex items-center gap-1.5 text-[9px] text-slate-500 font-mono">
                         <Lock size={8} /> {user.password ? '••••' : 'NO PASS'}
                       </div>
                    </div>
                  </div>
                </div>
                
                {isAdmin && user.id !== currentUser?.id && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button 
                      onClick={() => onDeleteUser(user.id)}
                      className="p-2.5 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all" 
                      title="إزالة العضو"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>

              {/* Activity Monitoring */}
              <div className="bg-slate-900/40 rounded-2xl p-4 mb-6 border border-slate-800/50 space-y-3">
                 <div className="flex justify-between items-center flex-row-reverse">
                    <div className="flex items-center gap-2 flex-row-reverse text-emerald-400">
                       <LogInIcon size={12} />
                       <span className="text-[10px] font-bold">آخر دخول:</span>
                    </div>
                    <span className="text-[10px] text-slate-300 font-mono">{user.lastLogin}</span>
                 </div>
                 <div className="flex justify-between items-center flex-row-reverse">
                    <div className="flex items-center gap-2 flex-row-reverse text-amber-400">
                       <LogOutIcon size={12} />
                       <span className="text-[10px] font-bold">آخر خروج:</span>
                    </div>
                    <span className="text-[10px] text-slate-300 font-mono">{user.lastLogout || '---'}</span>
                 </div>
              </div>

              {/* Permissions Grid */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'canScan' as const, label: 'المسح', icon: Camera, color: 'emerald' },
                  { key: 'canConnect' as const, label: 'الربط', icon: Zap, color: 'blue' },
                  { key: 'canManageUsers' as const, label: 'الإدارة', icon: Shield, color: 'amber' }
                ].map(({ key, label, icon: Icon, color }) => (
                  <button 
                    key={key}
                    onClick={() => isAdmin && user.id !== currentUser?.id && onTogglePermission(user.id, key)}
                    disabled={!isAdmin || user.id === currentUser?.id}
                    className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 ${
                      user.permissions[key] 
                        ? `bg-${color}-500/10 border-${color}-500/30 text-${color}-400 shadow-lg shadow-${color}-950/20` 
                        : 'bg-slate-900/50 border-slate-800 text-slate-700 grayscale'
                    } ${!isAdmin || user.id === currentUser?.id ? 'cursor-default' : 'hover:scale-[1.05] hover:border-slate-500 active:scale-95 shadow-xl'}`}
                  >
                    <Icon size={20} className={user.permissions[key] ? 'animate-in zoom-in duration-300' : ''} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-600 font-bold pt-4 mt-6 border-t border-slate-800/40 flex-row-reverse">
                <span className="flex items-center gap-1.5"><Clock size={10} className="text-blue-500" /> سجل الحضور الذكي</span>
                <span className="flex items-center gap-1.5 uppercase opacity-40 tracking-tighter font-mono">ID-{user.id.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center text-slate-800">
            <UserCheck size={64} className="mb-6 opacity-10" />
            <p className="text-sm font-bold text-slate-700">لم يتم العثور على أعضاء يطابقون بحثك.</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-3 text-slate-600 py-6">
        <ShieldCheck size={14} className="text-blue-500" />
        <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Republika Presence Monitoring System</p>
      </div>
    </div>
  );
};

export default UserPermissions;
