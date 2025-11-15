import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Scale } from 'lucide-react';

const unitConfig = {
  Length: {
    base: 'Meter',
    units: {
      Meter: 1,
      Kilometer: 1000,
      Centimeter: 0.01,
      Millimeter: 0.001,
      Mile: 1609.34,
      Yard: 0.9144,
      Foot: 0.3048,
      Inch: 0.0254,
    },
  },
  Weight: {
    base: 'Kilogram',
    units: {
      Kilogram: 1,
      Gram: 0.001,
      Milligram: 0.000001,
      Pound: 0.453592,
      Ounce: 0.0283495,
    },
  },
  Volume: {
    base: 'Liter',
    units: {
      Liter: 1,
      Milliliter: 0.001,
      'Cubic Meter': 1000,
      'Gallon (US)': 3.78541,
      'Quart (US)': 0.946353,
    },
  },
    Speed: {
        base: 'm/s',
        units: {
            'm/s': 1,
            'km/h': 0.277778,
            'mph': 0.44704,
            'knots': 0.514444,
        }
    },
    Area: {
        base: 'sq. meter',
        units: {
            'sq. meter': 1,
            'sq. km': 1000000,
            'sq. mile': 2589990,
            'acre': 4046.86,
            'hectare': 10000,
        }
    }
};

const TemperatureConverter = () => {
    const [temp, setTemp] = useState('');
    const [fromUnit, setFromUnit] = useState('Celsius');
    const [toUnit, setToUnit] = useState('Fahrenheit');

    const convertedTemp = useMemo(() => {
        const inputTemp = parseFloat(temp);
        if (isNaN(inputTemp)) return '';

        let celsiusTemp;
        // Convert to Celsius first
        switch (fromUnit) {
            case 'Fahrenheit': celsiusTemp = (inputTemp - 32) * 5/9; break;
            case 'Kelvin': celsiusTemp = inputTemp - 273.15; break;
            default: celsiusTemp = inputTemp; break;
        }

        // Convert from Celsius to target
        let result;
        switch (toUnit) {
            case 'Fahrenheit': result = (celsiusTemp * 9/5) + 32; break;
            case 'Kelvin': result = celsiusTemp + 273.15; break;
            default: result = celsiusTemp; break;
        }

        return result.toFixed(2);
    }, [temp, fromUnit, toUnit]);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="number" value={temp} onChange={e => setTemp(e.target.value)} placeholder="Enter temperature" className="w-full p-3 bg-white/10 rounded-lg border border-white/20 text-white" />
                <select value={fromUnit} onChange={e => setFromUnit(e.target.value)} className="w-full p-3 bg-white/10 rounded-lg border border-white/20 text-white">
                    <option>Celsius</option><option>Fahrenheit</option><option>Kelvin</option>
                </select>
                <select value={toUnit} onChange={e => setToUnit(e.target.value)} className="w-full p-3 bg-white/10 rounded-lg border border-white/20 text-white">
                    <option>Celsius</option><option>Fahrenheit</option><option>Kelvin</option>
                </select>
            </div>
            <div className="text-center text-2xl font-bold text-cyan-300">{convertedTemp} {toUnit}</div>
        </div>
    );
}

const UnitConverter = () => {
  const [category, setCategory] = useState<keyof typeof unitConfig | 'Temperature'>('Length');
  const [inputValue, setInputValue] = useState('1');
  const [fromUnit, setFromUnit] = useState(unitConfig.Length.base);
  const [toUnit, setToUnit] = useState('Foot');

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value as keyof typeof unitConfig | 'Temperature';
    setCategory(newCategory);
    if (newCategory !== 'Temperature') {
      setFromUnit(unitConfig[newCategory].base);
      const newUnits = Object.keys(unitConfig[newCategory].units);
      setToUnit(newUnits.length > 1 ? newUnits[1] : newUnits[0]);
    }
  };

    const convertedValue = useMemo(() => {
    if (category === 'Temperature') return '';
    const input = parseFloat(inputValue);
    if (isNaN(input)) return '';

    const categoryData = unitConfig[category];
    const from = categoryData.units[fromUnit as keyof typeof categoryData.units];
    const to = categoryData.units[toUnit as keyof typeof categoryData.units];

    const result = input * (from / to);
    return result.toPrecision(6);
  }, [inputValue, fromUnit, toUnit, category]);

  return (
    <div className="min-h-screen pt-20 pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl mb-6">
                <Scale className="h-10 w-10 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Unit <span className="gradient-text-cyan">Converter</span></h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Convert between various units of measurement instantly.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl p-8 border-2 border-orange-100 max-w-4xl mx-auto">
            <div className="mb-6">
                <label className="block text-lg font-medium text-gray-600 mb-2">Category</label>
                <select value={category} onChange={handleCategoryChange} className="w-full p-3 bg-white/10 rounded-lg border border-white/20 text-white">
                    {Object.keys(unitConfig).map(cat => <option key={cat}>{cat}</option>)}
                    <option>Temperature</option>
                </select>
            </div>

            {category === 'Temperature' ? <TemperatureConverter /> : (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input type="number" value={inputValue} onChange={e => setInputValue(e.target.value)} className="w-full p-3 bg-white/10 rounded-lg border border-white/20 text-white" />
                        <select value={fromUnit} onChange={e => setFromUnit(e.target.value)} className="w-full p-3 bg-white/10 rounded-lg border border-white/20 text-white">
                            {Object.keys(unitConfig[category].units).map(unit => <option key={unit}>{unit}</option>)}
                        </select>
                        <select value={toUnit} onChange={e => setToUnit(e.target.value)} className="w-full p-3 bg-white/10 rounded-lg border border-white/20 text-white">
                            {Object.keys(unitConfig[category].units).map(unit => <option key={unit}>{unit}</option>)}
                        </select>
                    </div>
                    <div className="text-center text-2xl font-bold text-cyan-300">{convertedValue} {toUnit}</div>
                </div>
            )}
        </motion.div>
      </div>
    </div>
  );
};

export default UnitConverter;


