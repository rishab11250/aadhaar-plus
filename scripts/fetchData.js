import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = "579b464db66ec23bdd00000178fc7eae194940bd48d006f29f68dbd5";
const LIMIT = 2000;

const URLS = {
    DEMOGRAPHIC: `https://api.data.gov.in/resource/19eac040-0b94-49fa-b239-4f2fd8677d53?api-key=${API_KEY}&format=json&limit=${LIMIT}`,
    ENROLMENT: `https://api.data.gov.in/resource/ecd49b12-3084-4521-8f7e-ca8bf72069ba?api-key=${API_KEY}&format=json&limit=${LIMIT}`,
    BIOMETRIC: `https://api.data.gov.in/resource/65454dab-1517-40a3-ac1d-47d4dfe6891c?api-key=${API_KEY}&format=json&limit=${LIMIT}`
};

async function fetchData() {
    console.log("Starting data fetch...");
    try {
        const [demoRes, enrolRes, bioRes] = await Promise.all([
            fetch(URLS.DEMOGRAPHIC).then(r => r.json()),
            fetch(URLS.ENROLMENT).then(r => r.json()),
            fetch(URLS.BIOMETRIC).then(r => r.json())
        ]);

        if (demoRes.status !== 'ok' || enrolRes.status !== 'ok' || bioRes.status !== 'ok') {
            console.error("API Error Response:", { demoStatus: demoRes.status, enrolStatus: enrolRes.status, bioStatus: bioRes.status });
            // In case of error (e.g. rate limit), allow partial usage or exit
            // For now, let's exit to fail fast
            if (demoRes.message) console.error("Message:", demoRes.message);
            return;
        }

        const combinedData = {
            demographic: demoRes.records,
            enrolment: enrolRes.records,
            biometric: bioRes.records,
            timestamp: new Date().toISOString()
        };

        const outputPath = path.resolve(__dirname, '../public/data.json');
        fs.writeFileSync(outputPath, JSON.stringify(combinedData, null, 2));
        console.log(`Success! Data saved to ${outputPath}`);
        console.log(`Counts: Demo=${demoRes.records.length}, Enrol=${enrolRes.records.length}, Bio=${bioRes.records.length}`);

    } catch (err) {
        console.error("Fatal error fetching data:", err);
    }
}

fetchData();
