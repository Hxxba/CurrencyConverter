import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Converter.css';
import Converted from './Converted';

const Converter = () => {
  const [amount, setAmount] = useState('');
  const [currencies, setCurrencies] = useState([]);
  const [currency, setCurrency] = useState('');
  const [convertedAmount, setConvertedAmount] = useState('');
  const [currencyName, setCurrencyName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.apilayer.com/exchangerates_data/symbols', {
          headers: {
            apikey: 'MBxh1z07LyeHrIB01Tg5sW2BrveT3hI7'
          }
        });
        setCurrencies(Object.entries(response.data.symbols));
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchConvertedAmount = async () => {
      try {
        const response = await axios.get(`https://api.apilayer.com/exchangerates_data/convert?to=USD&from=${currency}&amount=${amount}`, {
          headers: {
            apikey: 'MBxh1z07LyeHrIB01Tg5sW2BrveT3hI7'
          }
        });
        setConvertedAmount(response.data.result);
      } catch (error) {
        console.error(error);
      }
    };
    if (currency && amount) {
      fetchConvertedAmount();
    }
  }, [currency, amount]);

  useEffect(() => {
    if (currency) {
      const selectedCurrencyName = currencies.find(([key, value]) => key === currency)[1];
      setCurrencyName(selectedCurrencyName);
    }
  }, [currency, currencies]);

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  return (
    <div className='boxStyle'>
      <h1 className='ConverterCss'>Currency Converter</h1>
      <input className='inputnumber' type='text' value={amount} onChange={handleAmountChange} />
      <div>
        <select className='dropdown' value={currency} onChange={handleCurrencyChange}>
          {currencies.map(([key, value], index) => (
            <option key={index} value={key}>
              {`${key}-${value} `}
            </option>
          ))}
        </select>
      </div>

      <Converted currency={currency} amount={amount} convertedAmount={convertedAmount} currencyName={currencyName} />
    </div>
  );
};

export default Converter;
