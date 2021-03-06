import React, { useState, useEffect } from "react";
import { get } from "apicon.js";

// App components
import AppContainer from "../../Components/AppContainer/AppContainer";
import AppCard from "../../Components/AppCard/AppCard";

const App = () => {
  const endpoint = "https://api.nbp.pl/api/exchangerates/tables/a/?format=json";

  // const [isChanged, setChanged] = useState(false);
  const [currenciesPrices, setCurrenciesPrices] = useState({
    usd: 0,
    eur: 0
  });
  const [dataLoaded, setDataLoaded] = useState(false);
  const [currenciesVals, setCurrenciesVals] = useState({
    usd: null,
    eur: null
  });
  const [currencyFromUser, setCurrencyFromUser] = useState({
    currency: "USD",
    value: 0
  });

  const changeCurrenciesVals = ({ usd, eur }) => {
    setCurrenciesVals({ usd, eur });
  };

  const updateValues = ({ currency, value }) => {
    const { usd, eur } = currenciesPrices;
    if (currency === "USD") {
      setCurrenciesVals({
        usd: value,
        eur: +(value * (usd / eur)).toFixed(2)
      });
    } else {
      setCurrenciesVals({
        eur: value,
        usd: +(value / (usd / eur)).toFixed(2)
      });
    }
  };

  useEffect(() => {
    get(endpoint)
      .then(data => {
        const prices = data[0].rates;
        const usd = prices.filter(rate => rate.code === "USD")[0].mid;
        const eur = prices.filter(rate => rate.code === "EUR")[0].mid;
        setCurrenciesPrices({ usd, eur });
      })
      .then(() => setDataLoaded(true));
  }, []);

  return (
    <AppContainer>
      <AppCard
        isLoaded={dataLoaded}
        changeVals={changeCurrenciesVals}
        globalCurrencies={currenciesVals}
        updateGlobal={val => updateValues(val)}
      />
    </AppContainer>
  );
};

export default App;
