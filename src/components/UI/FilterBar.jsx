import React from 'react';
import { Filter } from 'lucide-react';
import { STATE_LIST } from '../../data/api';

export function FilterBar({ onYearChange, onStateChange, selectedState, selectedYear, onCompareToggle }) {
    // Generate last 5 years
    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-slate-600">
                    <Filter className="w-5 h-5" />
                    <span className="font-medium">Filters</span>
                </div>
                <button
                    onClick={onCompareToggle}
                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200"
                >
                    Compare States
                </button>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
                <select
                    className="flex-1 md:w-48 p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                    onChange={(e) => onYearChange && onYearChange(e.target.value)}
                    defaultValue=""
                >
                    <option value="">All Years</option>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>

                <select
                    className="flex-1 md:w-48 p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    onChange={(e) => onStateChange && onStateChange(e.target.value)}
                    value={selectedState}
                >
                    <option value="">All States</option>
                    {STATE_LIST.sort().map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
        </div>
    );
}
