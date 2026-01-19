
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../Layout/DashboardLayout';
import { KPICards } from './KPICards';
import { EnrolmentTrendChart } from './EnrolmentTrendChart';
import { BiometricHealthChart } from './BiometricHealthChart';
import { MigrationChart } from './MigrationChart';
import { DigitalReadinessChart } from './DigitalReadinessChart';
import { FilterBar } from '../UI/FilterBar';
import { ForecastingChart } from './ForecastingChart';
import { fetchRealData, aggregateData } from '../../data/api';
import { Loader2, AlertCircle } from 'lucide-react';
import { DataContext } from '../../context/DataContext';

import { useAuth } from '../../context/AuthContext';

import { StateComparison } from './StateComparison';

export function Dashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [showComparison, setShowComparison] = useState(false);

    // Data State - Default to empty
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Auto-load real data on mount
        const loadData = async () => {
            setIsLoading(true);
            try {
                const realData = await fetchRealData();
                if (realData && realData.length > 0) {
                    setData(realData);
                } else {
                    setError("No data available. Please verify 'public/data.json' exists.");
                }
            } catch (e) {
                setError("Failed to load dashboard data.");
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    // Filter Data Logic
    const filteredData = React.useMemo(() => {
        return data.filter(item => {
            const yearMatch = selectedYear ? item.year === parseInt(selectedYear) : true;
            const stateMatch = selectedState ? item.state === selectedState : true;
            return yearMatch && stateMatch;
        });
    }, [data, selectedYear, selectedState]);

    const aggregatedData = aggregateData(filteredData);
    const contextValue = { data: filteredData, aggregatedData, isLoading };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
                    <Loader2 className="w-12 h-12 animate-spin mb-4 text-teal-600" />
                    <p className="text-lg font-medium">Loading Aadhaar Lifecycle Data...</p>
                    <p className="text-sm text-slate-400 mt-2">Processing Data.gov.in records</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-[60vh] text-red-500">
                    <AlertCircle className="w-12 h-12 mb-4" />
                    <p className="text-lg font-medium">{error}</p>
                    <p className="text-sm text-slate-500 mt-2">Make sure to run: node scripts/fetchData.js</p>
                </div>
            );
        }

        // Role-Based Views
        const role = user?.role || 'User';

        if (role === 'User') {
            // Users only see their profile stats or a limited view
            // For now, let's redirect them to profile info or show limited KPIs
            return (
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900/50 p-6 rounded-lg border border-slate-200 dark:border-white/10 text-center">
                        <h3 className="text-lg font-medium text-slate-800 dark:text-white">Welcome, {user?.name}</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">You have limited access. View your profile for account details.</p>
                        <button
                            onClick={() => window.location.href = '/profile'}
                            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition"
                        >
                            Go to Profile
                        </button>
                    </div>
                </div>
            );
        }

        if (role === 'Manager') {
            // Managers see high-level KPIs and relevant charts for the section
            switch (activeTab) {
                case 'overview':
                    return (
                        <>
                            <KPICards />
                            <EnrolmentTrendChart />
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                <MigrationChart onStateClick={setSelectedState} />
                                <DigitalReadinessChart />
                            </div>
                        </>
                    );
                case 'demographic':
                    return (
                        <div className="space-y-8">
                            <KPICards />
                            <ForecastingChart />
                            <EnrolmentTrendChart />
                        </div>
                    );
                case 'biometric':
                    return (
                        <div className="space-y-8">
                            <KPICards />
                            <BiometricHealthChart />
                        </div>
                    );
                case 'migration':
                    return (
                        <div className="space-y-8">
                            <KPICards />
                            <MigrationChart onStateClick={setSelectedState} />
                        </div>
                    );
                default:
                    return <KPICards />;
            }
        }

        // Analysts/Admins get full view (existing logic)
        switch (activeTab) {
            case 'overview':
                return (
                    <>
                        <KPICards />
                        <EnrolmentTrendChart />
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            <MigrationChart onStateClick={setSelectedState} />
                            <DigitalReadinessChart />
                        </div>
                        <BiometricHealthChart />
                    </>
                );
            case 'demographic':
            case 'migration':
                return (
                    <div className="space-y-8">
                        <KPICards />
                        <ForecastingChart />
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            <MigrationChart onStateClick={setSelectedState} />
                            <EnrolmentTrendChart />
                        </div>
                    </div>
                );
            case 'biometric':
                return (
                    <div className="space-y-8">
                        <KPICards />
                        <BiometricHealthChart />
                    </div>
                );
            default:
                return <KPICards />;
        }
    };

    return (
        <DataContext.Provider value={contextValue}>
            <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-indigo-700">
                        {activeTab === 'overview' && 'Dashboard Overview'}
                        {activeTab === 'demographic' && 'Demographic Insights'}
                        {activeTab === 'biometric' && 'Biometric Health'}
                        {activeTab === 'migration' && 'Migration Map'}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        {user?.role === 'Manager' ? 'Executive Summary & Key Metrics' : 'Real-time insight from Government Open Data APIs'}
                    </p>
                </div>

                <FilterBar
                    selectedYear={selectedYear}
                    selectedState={selectedState}
                    onYearChange={setSelectedYear}
                    onStateChange={setSelectedState}
                    onCompareToggle={() => setShowComparison(!showComparison)}
                />

                {showComparison && (
                    <StateComparison onClose={() => setShowComparison(false)} />
                )}

                <div className="animate-in fade-in duration-500 min-h-[500px]">
                    {/* Hack: We need to pass props to children, but they are hardcoded in renderFunctions. 
                        Better to Context-ify the setters OR just cloneElement/refactor. 
                        For now, since MigrationChart uses Context for data, we can just add a new Context for Actions 
                        or pass via props if we refactor renderContent. 
                        
                        Actually, simplest is to just Pass the Setter via DataContext? No, separation of concerns.
                        Let's just pass it to MigrationChart explicitly in the render blocks.
                    */}
                    {renderContent()}
                </div>
            </DashboardLayout>
        </DataContext.Provider>
    );
}
