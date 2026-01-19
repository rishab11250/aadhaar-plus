import { format, parse } from 'date-fns';

const DATA_URL = '/data.json';

// Keep the state list for filters
export const STATE_LIST = [
    "Uttar Pradesh", "Maharashtra", "Bihar", "West Bengal", "Madhya Pradesh",
    "Tamil Nadu", "Rajasthan", "Karnataka", "Gujarat", "Andhra Pradesh",
    "Odisha", "Telangana", "Kerala", "Jharkhand", "Assam", "Punjab", "Haryana", "Delhi"
];

export const fetchRealData = async () => {
    try {
        const response = await fetch(DATA_URL);
        if (!response.ok) {
            throw new Error(`Failed to load local data: ${response.statusText}`);
        }
        const data = await response.json();

        // Validate structure
        if (!data.demographic || !data.enrolment || !data.biometric) {
            throw new Error("Invalid data format in data.json");
        }

        return processRealData(data.demographic, data.enrolment, data.biometric);
    } catch (err) {
        console.error("Failed to fetch real data:", err);
        return [];
    }
};

const processRealData = (demoRecords, enrolRecords, bioRecords) => {
    const aggMap = new Map();

    const getOrCreate = (key, state, year, month) => {
        if (!aggMap.has(key)) {
            aggMap.set(key, {
                id: key,
                state,
                year: parseInt(year),
                month,
                period: `${month}-${year}`,
                enrolment: { total: 0, byAge: { "0-5": 0, "5-17": 0, "18+": 0 } },
                updates: { total: 0, byType: { "Address": 0, "Mobile": 0, "Name": 0, "Other": 0 } },
                biometrics: { total: 0, byAge: { "5-17": 0, "18+": 0 } }
            });
        }
        return aggMap.get(key);
    };

    const parseDate = (dateStr) => {
        try {
            return parse(dateStr, 'dd-MM-yyyy', new Date());
        } catch (e) {
            return new Date();
        }
    };

    enrolRecords.forEach(r => {
        const dateObj = parseDate(r.date);
        const month = format(dateObj, 'MMM');
        const year = format(dateObj, 'yyyy');
        const key = `${r.state}-${month}-${year}`;

        const item = getOrCreate(key, r.state, year, month);

        const a0_5 = parseInt(r.age_0_5) || 0;
        const a5_17 = parseInt(r.age_5_17) || 0;
        const a18 = parseInt(r.age_18_greater) || 0;

        item.enrolment.total += (a0_5 + a5_17 + a18);
        item.enrolment.byAge["0-5"] += a0_5;
        item.enrolment.byAge["5-17"] += a5_17;
        item.enrolment.byAge["18+"] += a18;
    });

    demoRecords.forEach(r => {
        const dateObj = parseDate(r.date);
        const month = format(dateObj, 'MMM');
        const year = format(dateObj, 'yyyy');
        const key = `${r.state}-${month}-${year}`;

        const item = getOrCreate(key, r.state, year, month);

        const d5_17 = parseInt(r.demo_age_5_17) || 0;
        const d17 = parseInt(r.demo_age_17_) || 0;
        const total = d5_17 + d17;

        item.updates.total += total;

        // Simulated breakdown anchored to real total
        item.updates.byType.Address += Math.floor(total * 0.4);
        item.updates.byType.Mobile += Math.floor(total * 0.4);
        item.updates.byType.Name += Math.floor(total * 0.1);
        item.updates.byType.Other += Math.ceil(total * 0.1);
    });

    bioRecords.forEach(r => {
        const dateObj = parseDate(r.date);
        const month = format(dateObj, 'MMM');
        const year = format(dateObj, 'yyyy');
        const key = `${r.state}-${month}-${year}`;

        const item = getOrCreate(key, r.state, year, month);

        const b5_17 = parseInt(r.bio_age_5_17) || 0;
        const b17 = parseInt(r.bio_age_17_) || 0;

        item.biometrics.total += (b5_17 + b17);
        item.biometrics.byAge["5-17"] += b5_17;
        item.biometrics.byAge["18+"] += b17;
    });

    return Array.from(aggMap.values());
};

// Helper function to aggregate any dataset
export const aggregateData = (dataset) => {
    if (!dataset) return [];

    const agg = {};
    dataset.forEach(d => {
        if (!agg[d.state]) {
            agg[d.state] = {
                state: d.state,
                totalEnrolment: 0,
                totalUpdates: 0,
                totalAddressUpdates: 0,
                totalMobileUpdates: 0,
                totalBioUpdates: 0,
                childEnrolmentsLagged: 0,
            };
        }
        agg[d.state].totalEnrolment += d.enrolment.total;
        agg[d.state].totalUpdates += d.updates.total;
        agg[d.state].totalAddressUpdates += d.updates.byType.Address;
        agg[d.state].totalMobileUpdates += d.updates.byType.Mobile;
        agg[d.state].totalBioUpdates += d.biometrics.total;
        // Use current 0-5 as proxy for lagged if timeline short
        agg[d.state].childEnrolmentsLagged += d.enrolment.byAge["0-5"];
    });
    return Object.values(agg);
};
