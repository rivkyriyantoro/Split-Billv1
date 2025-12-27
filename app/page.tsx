"use client";

import { useState, useEffect } from "react";
import { Plus, Moon, Sun, RefreshCw, Trash2, Receipt } from "lucide-react";

type Item = {
  id: number;
  name: string;
  price: number;
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "", price: 0 },
    { id: 2, name: "", price: 0 },
  ]);
  const [totalPaid, setTotalPaid] = useState<number>(0);
  const [calculatedItems, setCalculatedItems] = useState<
    { id: number; name: string; originalPrice: number; finalPrice: number; percentage: number }[]
  >([]);

  // Default to Dark Mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Apply theme class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: "", price: 0 }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const resetAll = () => {
    setItems([
      { id: 1, name: "", price: 0 },
      { id: 2, name: "", price: 0 },
    ]);
    setTotalPaid(0);
    setCalculatedItems([]);
  };

  const updateItem = (id: number, field: "name" | "price", value: string | number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const calculateSplit = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.price || 0), 0);

    if (subtotal === 0) return;

    const multiplier = totalPaid > 0 ? totalPaid / subtotal : 1;

    const results = items.map((item) => ({
      id: item.id,
      name: item.name || "Item",
      originalPrice: item.price || 0,
      finalPrice: (item.price || 0) * multiplier,
      percentage: (item.price || 0) / subtotal * 100
    }));

    setCalculatedItems(results);
  };

  // Helper vars for summary
  const subtotal = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const diff = totalPaid - subtotal;
  const diffPercentage = subtotal > 0 ? (Math.abs(diff) / subtotal) * 100 : 0;
  const isDiscount = diff < 0;

  return (
    <div className="min-h-screen font-sans p-4 md:p-8 flex flex-col items-center text-primary-c">
      <div className="w-full max-w-xl glass rounded-2xl p-6 md:p-8 space-y-8 relative overflow-hidden transition-all duration-300">
        {/* Decorative Line (Monochrome) */}
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 transition-opacity duration-300 ${isDarkMode ? "opacity-50" : "opacity-30"}`}></div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg backdrop-blur-sm transition-colors ${isDarkMode ? "bg-white/10" : "bg-gray-200/50"}`}>
              <Receipt className={`w-6 h-6 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`} />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-gray-800">
              Split Bill
            </h1>
          </div>

          <div className="flex gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${isDarkMode ? "bg-white/10 text-gray-300 hover:bg-white/20" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Reset Action */}
            <button
              onClick={resetAll}
              className={`p-2 rounded-full transition-colors ${isDarkMode ? "hover:bg-white/10 text-white/50 hover:text-white" : "hover:bg-black/5 text-black/40 hover:text-black"
                }`}
              title="Reset"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {/* Input Section */}
        <div className={`${calculatedItems.length > 0 ? "hidden md:block opacity-50 hover:opacity-100 transition-opacity" : ""}`}>
          <div className="space-y-4">
            <div className="flex justify-between items-end mb-2">
              <label className="text-sm font-medium text-secondary-c">Daftar Item</label>
              <span className="text-xs text-muted-c">{items.length} Item</span>
            </div>

            {items.map((item) => (
              <div key={item.id} className="flex gap-3 group">
                <input
                  type="text"
                  placeholder="Nama Item"
                  className="glass-input flex-1 w-full"
                  value={item.name}
                  onChange={(e) => updateItem(item.id, "name", e.target.value)}
                />
                <div className="relative w-32 sm:w-40 shrink-0">
                  <span className="absolute left-3 top-2.5 text-muted-c text-xs">Rp</span>
                  <input
                    type="number"
                    placeholder="0"
                    className="glass-input w-full pl-8 text-right"
                    value={item.price || ""}
                    onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}

            <button
              onClick={addItem}
              className={`w-full py-3 mt-2 border border-dashed rounded-lg transition-all text-sm flex justify-center items-center gap-2 ${isDarkMode
                ? "border-white/20 text-white/50 hover:text-white hover:border-white/40 hover:bg-white/5"
                : "border-gray-300 text-gray-500 hover:text-gray-800 hover:border-gray-400 hover:bg-gray-100"
                }`}
            >
              <Plus size={16} /> Tambah Baris
            </button>
          </div>

          <div className={`mt-8 pt-6 border-t ${isDarkMode ? "border-white/10" : "border-black/5"}`}>
            <label className="block text-sm font-medium text-secondary-c mb-3">Total Pembayaran (Final)</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-muted-c font-medium">Rp</span>
              <input
                type="number"
                placeholder="0"
                className={`w-full rounded-xl px-4 py-3 pl-12 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all shadow-inner border ${isDarkMode
                  ? "bg-black/30 border-white/10 text-white"
                  : "bg-white/60 border-gray-300 text-gray-800"
                  }`}
                value={totalPaid || ""}
                onChange={(e) => setTotalPaid(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <button
            onClick={calculateSplit}
            className="w-full mt-8 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-gray-900/20 transform transition-all active:scale-[0.98]"
          >
            Hitung Pembagian
          </button>
        </div>

        {/* Results Section */}
        {calculatedItems.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-bold text-primary-c">Hasil Rincian</h2>
              <div className={`h-px flex-1 ${isDarkMode ? "bg-white/10" : "bg-black/5"}`}></div>
            </div>

            <div className={`rounded-xl border overflow-hidden backdrop-blur-sm ${isDarkMode ? "bg-black/20 border-white/5" : "bg-white/40 border-white/40 shadow-inner"
              }`}>
              <table className="w-full text-sm">
                <thead className={`${isDarkMode ? "bg-white/5 text-white/60" : "bg-black/5 text-black/60"}`}>
                  <tr>
                    <th className="py-3 px-3 text-left font-medium">Item</th>
                    <th className="py-3 px-3 text-right font-medium">Harga Asli</th>
                    <th className="py-3 px-3 text-center font-medium">%</th>
                    <th className="py-3 px-3 text-right font-bold">Bayar</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? "divide-white/5" : "divide-black/5"}`}>
                  {calculatedItems.map((item) => (
                    <tr key={item.id} className={`transition-colors ${isDarkMode ? "hover:bg-white/5" : "hover:bg-black/5"}`}>
                      <td className="py-3 px-3 font-medium text-primary-c">{item.name || "Item"}</td>
                      <td className="py-3 px-3 text-right text-secondary-c">{formatRupiah(item.originalPrice).replace("Rp", "")}</td>
                      <td className="py-3 px-3 text-center text-xs text-muted-c">{item.percentage.toFixed(0)}%</td>
                      <td className="py-3 px-3 text-right font-bold text-gray-700 dark:text-gray-300">{formatRupiah(item.finalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Footer */}
            <div className={`mt-6 rounded-xl p-4 flex justify-between items-center border ${isDarkMode ? "bg-white/5 border-white/5" : "bg-white/50 border-white/40"
              }`}>
              <div className="space-y-1">
                <div className="text-xs text-muted-c uppercase tracking-widest">Total Asli</div>
                <div className="font-mono text-lg text-secondary-c">{formatRupiah(subtotal)}</div>
              </div>

              {/* Divider */}
              <div className={`w-px h-8 ${isDarkMode ? "bg-white/10" : "bg-black/10"}`}></div>

              <div className="space-y-1 text-right">
                <div className="text-xs text-muted-c uppercase tracking-widest">Total Bayar</div>
                <div className="font-bold font-mono text-xl text-gray-800 dark:text-gray-200">{formatRupiah(totalPaid > 0 ? totalPaid : subtotal)}</div>
              </div>
            </div>

            {totalPaid > 0 && Math.abs(diff) > 1 && (
              <div className={`mt-3 text-center text-xs py-1 px-3 rounded-full inline-block w-full border ${isDiscount ? "bg-gray-200 border-gray-400 text-gray-700" : "bg-gray-300 border-gray-500 text-gray-800"}`}>
                {isDiscount ? "Diskon Hemat" : "Biaya Tambahan"} sebesar <b>{formatRupiah(Math.abs(diff))}</b> ({diffPercentage.toFixed(1)}%)
              </div>
            )}

            <button
              onClick={resetAll}
              className={`w-full mt-6 py-3 rounded-xl border transition-colors text-sm font-medium ${isDarkMode
                ? "border-white/10 hover:bg-white/5 text-white/60 hover:text-white"
                : "border-black/10 hover:bg-black/5 text-black/40 hover:text-black"
                }`}
            >
              Hitung Ulang
            </button>
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-muted-c opacity-60 hover:opacity-100 transition-opacity">
        <a href="https://portoky.framer.website/" target="_blank" rel="noopener noreferrer" className="hover:underline">
          Copyright siripky @2025
        </a>
      </div>
    </div>
  );
}
