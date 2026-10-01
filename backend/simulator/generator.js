const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
};

const randomBetween = (min, max) => {
    return Math.random()*(max - min)+min;
};

const randomChange = (amount) => {
    return randomBetween(-amount, amount);
};

const round = (value, decimals = 2) => {
    return Number(value.toFixed(decimals));
};

const initialState = {
    ph: 7.3,
    temperature: 27.0,
    dissolvedOxygen: 6.8,
    turbidity: 3.0,
    tds: 400,
    conductivity: 650,
    salinity: 0.3,
    ammonia: 0.2,
    nitrite: 0.05,
    nitrate: 10,
};

let state = {...initialState};

let activeAnomaly = null;

const generateNormalReading = () => {
    state.ph = clamp(state.ph + randomChange(0.05), 6.5, 8.5);
    state.temperature = clamp(state.temperature + randomChange(0.15), 20, 32);
    state.dissolvedOxygen = clamp(state.dissolvedOxygen+randomChange(0.12), 4, 9);
    state.turbidity = clamp(state.turbidity+randomChange(0.3), 1, 8);
    state.tds = clamp(state.tds+randomChange(5), 250, 700);
    state.conductivity = clamp(state.conductivity+randomChange(8), 400, 1100);
    state.salinity = clamp(state.salinity+randomChange(0.01), 0.1, 0.8);
    state.ammonia = clamp(state.ammonia+randomChange(0.02), 0.05, 0.5);
    state.nitrite = clamp(state.nitrite+randomChange(0.4), 0.01, 0.2);
    state.nitrate = clamp(state.nitrate+randomChange(0.4), 5, 25);

    return buildReading();
};

const buildReading = () => {
    return {
        ph: round(state.ph, 2),
        temperature: round(state.temperature, 2),
        dissolvedOxygen: round(state.dissolvedOxygen, 2),
        turbidity: round(state.turbidity, 2),
        tds: round(state.tds, 2),
        conductivity: round(state.conductivity, 2),
        salinity: round(state.salinity, 3),
        ammonia: round(state.ammonia, 3),
        nitrite: round(state.nitrite, 3),
        nitrate: round(state.nitrate, 2),
    };
};

const startAnomaly = () => {
    const anomalyTypes = ["lowDO", "highAmmonia", "highTurbidity", "phDrop"];
    const type = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)];
    activeAnomaly = {
        type, remainingReadings: Math.floor(randomBetween(5, 15)),
    };
    console.log(`Anomaly started: ${type}`);
};

const applyAnomaly = () => {
    if(!activeAnomaly){
        return;
    }

    switch(activeAnomaly.type){
        case "lowDO":
            state.dissolvedOxygen = clamp(state.dissolvedOxygen - randomBetween(0.15, 0.35), 1, 9);
            break;
        case "highAmmonia":
            state.ammonia = clamp(state.ammonia + randomBetween(0.05, 0.12), 0.05, 2);
            break;
        case "highTurbidity":
            state.turbidity = clamp(state.turbidity + randomBetween(0.8, 2), 1, 30);
            break;
        case "phDrop":
            state.ph = clamp(state.ph - randomBetween(0.08, 0.18), 4, 9);
            break;
    }

    activeAnomaly.remainingReadings -= 1;

    if(activeAnomaly.remainingReadings <= 0){
        console.log(`Anomaly Ended: ${activeAnomaly.type}`);
        activeAnomaly = null;
    }
};

const generateReading = ({anomalyProbability = 0.02,} = {}) => {
    if(!activeAnomaly && Math.random() < anomalyProbability){
        startAnomaly();
    }
    generateNormalReading();
    applyAnomaly();

    return buildReading();
};

module.exports = {generateReading,};