const fs = require('fs');
const { parse } = require('csv-parse');

const allPlanets = [];
const habitablePlanets = []; 
// https://www.centauri-dreams.org/2015/01/30/a-review-of-the-best-habitable-planet-candidates/

// 2022-02-24

// Exoplanet Archive Disposition -> exoplanet state of analysis -> "CANDIDATE", "FALSE POSITIVE" OR "CONFIRMED"
const exoplanetArchiveDisposition = {
    id: 'koi_disposition',
    value: 'CONFIRMED'
};

// Insolation Flux -> amount of sun/energy
const insolationFlux = {
    id: 'koi_insol',
    minValue: 0.36,
    maxValue: 1.11
};

// Planetary Radius
const planetaryRadius = {
    id: 'koi_prad',
    value: 1.6
};

// Equilibrium Temperature -> between 175K (-98,15°C)and 270K (-3,15°C) -> according to a study done by Kaltenegger and Sasselov
const equilibriumTemperature = {
    id: 'koi_teq',
    minValue: 175,
    maxValue: 270
};

function isHabitablePlanet(planet) {
    return planet[exoplanetArchiveDisposition.id] === exoplanetArchiveDisposition.value
        && planet[insolationFlux.id] > insolationFlux.minValue 
        && planet[insolationFlux.id] < insolationFlux.maxValue
        && planet[planetaryRadius.id] < planetaryRadius.value
        && planet[equilibriumTemperature.id] > equilibriumTemperature.minValue 
        && planet[equilibriumTemperature.id] < equilibriumTemperature.maxValue;
}

// read in data in a stream and pipe it to parser
fs.createReadStream('./data/kepler_data.csv')
    .pipe(parse({
        comment: '#',
        columns: true 
    }))
    .on('data', (data) => {
        allPlanets.push(data);
        if (isHabitablePlanet(data)) {
            habitablePlanets.push(data);
        }
    })
    .on('error', (err) => {
        console.log('error:', err);
    })
    .on('end', () => {
        let habitablePlanetNames = habitablePlanets.map( (planet) => {
            return planet['kepler_name'];
        });
        console.log(`Exoplanets observed by Kepler. ->`, allPlanets.length);
        console.log(`Habitable planet candidates ->`, habitablePlanets.length);
        console.log(`Habitable planet candidates names ->`, habitablePlanetNames);

        console.log('do research for further indicators ...');
        // console.log(habitablePlanets[3].kepler_name);
        // const parSec = (1 * 180 * 3600 / (Math.PI));
        // const parallaxe = 0.00273;
        // const lJFactor = 63241.07708807;
        // console.log('parSec [pc]',parSec);
        // console.log('distance AE',parSec/parallaxe);
        // console.log('distance LJ',(parSec/parallaxe)/lJFactor);
        // Name	Type	Mass(ME)	Radius(RE)	Flux(SE)	Tsurf(K)	Period(days)	Distance(ly)	ESI
        // 013. Kepler-442 b	K-Warm Terran	~ 2.36	1.35	0.70	~ 263	112.3	1193	0.84
    });

