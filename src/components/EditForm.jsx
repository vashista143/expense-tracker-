<<<<<<< HEAD
import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react"; 

const EditModal = ({ isOpen, onClose, item, onSave, dark }) => {
  const [formData, setFormData] = useState(item);
  const [isUpdating, setIsUpdating] = useState(false); 

  useEffect(() => {
    if (item) {
      setFormData(item);
      setIsUpdating(false); 
    }
  }, [item]);

  if (!isOpen || !formData) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true); 
    const success = await onSave(formData);
    if (!success) setIsUpdating(false);
  };

  const theme = {
    overlay: "fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4",
    modal: `w-full max-w-lg rounded-3xl border-2 p-8 shadow-2xl transition-all ${dark ? 'bg-[#1a1c1e] border-gray-800' : 'bg-white border-gray-100'}`,
    input: `w-full p-3 rounded-xl border-2 outline-none ${dark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-100'}`,
    label: "text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block"
  };

  return (
    <div className={theme.overlay}>
      <div className={theme.modal}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-black ${dark ? 'text-white' : 'text-gray-900'}`}>Edit Transaction</h2>
          <button onClick={onClose} disabled={isUpdating} className="text-gray-500 hover:text-red-500 disabled:opacity-50">
            <X size={20} />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={theme.label}>Description</label>
              <input 
                disabled={isUpdating}
                className={theme.input} 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
              />
            </div>
            <div>
              <label className={theme.label}>Amount</label>
              <input 
                disabled={isUpdating}
                type="number" 
                className={theme.input} 
                value={formData.amount} 
                onChange={e => setFormData({...formData, amount: Number(e.target.value)})} 
              />
            </div>
            <div>
              <label className={theme.label}>Date</label>
              <input 
                disabled={isUpdating}
                type="date" 
                className={theme.input} 
                value={formData.date} 
                onChange={e => setFormData({...formData, date: e.target.value})} 
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={isUpdating}
              className={`flex-1 py-3 rounded-xl font-bold border transition-all ${dark ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'} disabled:opacity-50`}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isUpdating}
              className="flex-1 py-3 rounded-xl font-bold bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all disabled:bg-blue-400 flex items-center justify-center gap-2"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Updating...
                </>
              ) : (
                'Update Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

=======
import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react"; 

const EditModal = ({ isOpen, onClose, item, onSave, dark }) => {
  const [formData, setFormData] = useState(item);
  const [isUpdating, setIsUpdating] = useState(false); 

  useEffect(() => {
    if (item) {
      setFormData(item);
      setIsUpdating(false); 
    }
  }, [item]);

  if (!isOpen || !formData) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true); 
    const success = await onSave(formData);
    if (!success) setIsUpdating(false);
  };

  const theme = {
    overlay: "fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4",
    modal: `w-full max-w-lg rounded-3xl border-2 p-8 shadow-2xl transition-all ${dark ? 'bg-[#1a1c1e] border-gray-800' : 'bg-white border-gray-100'}`,
    input: `w-full p-3 rounded-xl border-2 outline-none ${dark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-100'}`,
    label: "text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block"
  };

  return (
    <div className={theme.overlay}>
      <div className={theme.modal}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-black ${dark ? 'text-white' : 'text-gray-900'}`}>Edit Transaction</h2>
          <button onClick={onClose} disabled={isUpdating} className="text-gray-500 hover:text-red-500 disabled:opacity-50">
            <X size={20} />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={theme.label}>Description</label>
              <input 
                disabled={isUpdating}
                className={theme.input} 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
              />
            </div>
            <div>
              <label className={theme.label}>Amount</label>
              <input 
                disabled={isUpdating}
                type="number" 
                className={theme.input} 
                value={formData.amount} 
                onChange={e => setFormData({...formData, amount: Number(e.target.value)})} 
              />
            </div>
            <div>
              <label className={theme.label}>Date</label>
              <input 
                disabled={isUpdating}
                type="date" 
                className={theme.input} 
                value={formData.date} 
                onChange={e => setFormData({...formData, date: e.target.value})} 
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={isUpdating}
              className={`flex-1 py-3 rounded-xl font-bold border transition-all ${dark ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'} disabled:opacity-50`}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isUpdating}
              className="flex-1 py-3 rounded-xl font-bold bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all disabled:bg-blue-400 flex items-center justify-center gap-2"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Updating...
                </>
              ) : (
                'Update Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

>>>>>>> d95d037875b5a0e814feb2c512e5d933a996893f
export default EditModal;