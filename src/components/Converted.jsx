import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Converted.css';

const Converted = (props) => {
  const [exchange, setExchange] = useState([]);
  const [symbols, setSymbols] = useState({});
  const [latestRates, setLatestRates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [symbolsResponse, latestResponse, baseResponse] = await Promise.all([
          axios.get('https://api.apilayer.com/exchangerates_data/symbols', {
            headers: {
              apikey: 'MBxh1z07LyeHrIB01Tg5sW2BrveT3hI7'
            }
          }),
          axios.get('https://api.apilayer.com/exchangerates_data/latest?rates&base=usd', {
            headers: {
              apikey: 'MBxh1z07LyeHrIB01Tg5sW2BrveT3hI7'
            }
          }),
          axios.get(`https://api.apilayer.com/exchangerates_data/latest?base=${props.currency}`, {
            headers: {
              apikey: 'MBxh1z07LyeHrIB01Tg5sW2BrveT3hI7'
            }
          })
        ]);

        const combinedData = {};

        Object.entries(latestResponse.data.rates).forEach(([key, value]) => {
          if (symbolsResponse.data.symbols[key]) {
            combinedData[symbolsResponse.data.symbols[key]] = {
              exchangeRate: value,
              latestRate: baseResponse.data.rates[key]
            };
          }
        });

        setExchange(Object.entries(combinedData));
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [props.currency]);

  return (
    <div className='boxStylee'>
      <h1 className='Title'>{props.currencyName} Exchange Rate</h1>
      <div>
      <table>
        <thead>
          <tr >
            <th className='currency'>{props.currencyName}</th>
            <th className='amountList'>{props.amount} {props.currency}</th>
            <th className='amountList'>nv. 1.00 {props.currency}</th>

          </tr>
        </thead>
        <tbody >
          {exchange.map(([key,value], index) => (
            <tr key={index} className='row'>
              <td className='currencynames'>{key}</td>
              <td className='amount'>{value.exchangeRate * props.convertedAmount}</td>
              <td className='amount'>{value.latestRate}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

    
    </div>
  );
};

export default Converted;

