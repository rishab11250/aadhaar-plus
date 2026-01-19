import React, { useContext } from 'react';
import { Card } from '../UI/Card';
import { Users, Fingerprint, MapPin, Smartphone } from 'lucide-react';
import { DataContext } from '../../context/DataContext';

function calculateMetrics(data) {
    let totalEnrolments = 0;
    let totalUpdates = 0;
    let totalBioUpdates = 0;
    let totalAddressUpdates = 0;
    let totalMobileUpdates = 0;
    let childEnrolments = 0;

    data.forEach(d => {
        totalEnrolments += d.enrolment.total;
        totalUpdates += d.updates.total;
        totalBioUpdates += d.biometrics.total;
        totalAddressUpdates += d.updates.byType.Address;
        totalMobileUpdates += d.updates.byType.Mobile;
        childEnrolments += d.enrolment.byAge['0-5'];
    });

    const mbuCompliance = childEnrolments > 0 ? (totalBioUpdates / childEnrolments) * 100 : 0;
    const migrationIntensity = totalEnrolments > 0 ? (totalAddressUpdates / totalEnrolments) * 100 : 0;
    const digitalReadiness = totalUpdates > 0 ? (totalMobileUpdates / totalUpdates) * 100 : 0;

    return {
        totalEnrolments,
        mbuCompliance,
        migrationIntensity,
        digitalReadiness
    };
}

export function KPICards() {
    const { data } = useContext(DataContext);
    const metrics = calculateMetrics(data);

    const cards = [
        {
            label: 'Total Enrolments',
            value: metrics.totalEnrolments.toLocaleString(),
            icon: Users,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            trend: 'Aggregated View'
        },
        {
            label: 'MBU Compliance',
            value: `${metrics.mbuCompliance.toFixed(1)}%`,
            icon: Fingerprint,
            color: 'text-violet-600',
            bg: 'bg-violet-50',
            trend: 'Bio / Child Enrol'
        },
        {
            label: 'Migration Intensity',
            value: `${metrics.migrationIntensity.toFixed(1)}%`,
            icon: MapPin,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            trend: 'Addr / Enrol'
        },
        {
            label: 'Digital Readiness',
            value: `${metrics.digitalReadiness.toFixed(1)}%`,
            icon: Smartphone,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            trend: 'Mobile / Updates'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card, idx) => {
                const Icon = card.icon;
                return (
                    <Card key={idx} className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${card.bg}`}>
                            <Icon className={`w-6 h-6 ${card.color}`} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">{card.label}</p>
                            <h3 className="text-2xl font-bold text-slate-900">{card.value}</h3>
                            <p className="text-xs text-slate-400 mt-1">{card.trend}</p>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
