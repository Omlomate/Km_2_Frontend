import React, { useState } from "react";

const SelectCurrency = ({ onCurrencyChange = () => {} }) => {
  const [selectedCurrency, setSelectedCurrency] = useState("Select");
  
  const handleChange = (event) => {
    const currency = currencies.find(
      (currency) => currency.symbol === event.target.value
    );
    if (currency) {
      setSelectedCurrency(currency.symbol);
      onCurrencyChange(currency);  // Pass the entire currency object
    }
  };

  const currencies = [
    { "name": "US Dollar", "symbol": "$" },
    { "name": "Indian Rupee", "symbol": "inr" },
    { "name": "UAE Dirham", "symbol": "aed" },
    { "name": "Albanian Lek", "symbol": "all" },
    { "name": "Neth Antilles Guilder", "symbol": "ang" },
    { "name": "Argentine Peso", "symbol": "ars" },
    { "name": "Australian Dollar", "symbol": "aud" },
    { "name": "Aruba Florin", "symbol": "awg" },
    { "name": "Barbados Dollar", "symbol": "bbd" },
    { "name": "Bangladesh Taka", "symbol": "bdt" },
    { "name": "Bulgarian Lev", "symbol": "bgn" },
    { "name": "Bahraini Dinar", "symbol": "bhd" },
    { "name": "Burundi Franc", "symbol": "bif" },
    { "name": "Bermuda Dollar", "symbol": "bmd" },
    { "name": "Brunei Dollar", "symbol": "bnd" },
    { "name": "Bolivian Boliviano", "symbol": "bob" },
    { "name": "Brazilian Real", "symbol": "brl" },
    { "name": "Bahamian Dollar", "symbol": "bsd" },
    { "name": "Bhutan Ngultrum", "symbol": "btn" },
    { "name": "Botswana Pula", "symbol": "bwp" },
    { "name": "Belarus Ruble", "symbol": "byr" },
    { "name": "Belize Dollar", "symbol": "bzd" },
    { "name": "Canadian Dollar", "symbol": "cad" },
    { "name": "Swiss Franc", "symbol": "chf" },
    { "name": "Chilean Peso", "symbol": "clp" },
    { "name": "Chinese Yuan", "symbol": "cny" },
    { "name": "Colombian Peso", "symbol": "cop" },
    { "name": "Costa Rica Colon", "symbol": "crc" },
    { "name": "Cuban Peso", "symbol": "cup" },
    { "name": "Cape Verde Escudo", "symbol": "cve" },
    { "name": "Czech Koruna", "symbol": "czk" },
    { "name": "Djibouti Franc", "symbol": "djf" },
    { "name": "Danish Krone", "symbol": "dkk" },
    { "name": "Dominican Peso", "symbol": "dop" },
    { "name": "Algerian Dinar", "symbol": "dzd" },
    { "name": "Estonian Kroon", "symbol": "eek" },
    { "name": "Egyptian Pound", "symbol": "egp" },
    { "name": "Ethiopian Birr", "symbol": "etb" },
    { "name": "Euro", "symbol": "eur" },
    { "name": "Fiji Dollar", "symbol": "fjd" },
    { "name": "Falkland Islands Pound", "symbol": "fkp" },
    { "name": "British Pound", "symbol": "gbp" },
    { "name": "Ghanaian Cedi", "symbol": "ghs" },
    { "name": "Gambian Dalasi", "symbol": "gmd" },
    { "name": "Guinea Franc", "symbol": "gnf" },
    { "name": "Guatemala Quetzal", "symbol": "gtq" },
    { "name": "Guyana Dollar", "symbol": "gyd" },
    { "name": "Hong Kong Dollar", "symbol": "hkd" },
    { "name": "Honduras Lempira", "symbol": "hnl" },
    { "name": "Croatian Kuna", "symbol": "hrk" },
    { "name": "Hungarian Forint", "symbol": "huf" },
    { "name": "Indonesian Rupiah", "symbol": "idr" },
    { "name": "Israeli Shekel", "symbol": "ils" },    
    { "name": "Iraqi Dinar", "symbol": "iqd" },
    { "name": "Iceland Krona", "symbol": "isk" },
    { "name": "Jordanian Dinar", "symbol": "jod" },
    { "name": "Japanese Yen", "symbol": "jpy" },
    { "name": "Kenyan Shilling", "symbol": "kes" },
    { "name": "Kyrgyzstan Som", "symbol": "kgs" },
    { "name": "Cambodia Riel", "symbol": "khr" },
    { "name": "Comoros Franc", "symbol": "kmf" },
    { "name": "North Korean Won", "symbol": "kpw" },
    { "name": "Korean Won", "symbol": "krw" },
    { "name": "Kuwaiti Dinar", "symbol": "kwd" },
    { "name": "Sri Lanka Rupee", "symbol": "lkr" },
    { "name": "Moroccan Dirham", "symbol": "mad" },
    { "name": "Moldovan Leu", "symbol": "mdl" },
    { "name": "Macedonian Denar", "symbol": "mkd" },
    { "name": "Myanmar Kyat", "symbol": "mmk" },
    { "name": "Mexican Peso", "symbol": "mxn" },
    { "name": "Malaysian Ringgit", "symbol": "myr" },
    { "name": "Namibian Dollar", "symbol": "nad" },
    { "name": "Nigerian Naira", "symbol": "ngn" },
    { "name": "Norwegian Krone", "symbol": "nok" },
    { "name": "Nepalese Rupee", "symbol": "npr" },
    { "name": "New Zealand Dollar", "symbol": "nzd" },
    { "name": "Omani Rial", "symbol": "omr" },
    { "name": "Philippine Peso", "symbol": "php" },
    { "name": "Pakistani Rupee", "symbol": "pkr" },
    { "name": "Polish Zloty", "symbol": "pln" },
    { "name": "Qatar Rial", "symbol": "qar" },
    { "name": "Romanian New Leu", "symbol": "ron" },
    { "name": "Russian Rouble", "symbol": "rub" },
    { "name": "Saudi Arabian Riyal", "symbol": "sar" },
    { "name": "Singapore Dollar", "symbol": "sgd" },
    { "name": "Thai Baht", "symbol": "thb" },
    { "name": "Turkish Lira", "symbol": "try" },
    { "name": "Trinidad Tobago Dollar", "symbol": "ttd" },
    { "name": "Taiwan Dollar", "symbol": "twd" },
    { "name": "Tunisian Dinar", "symbol": "tnd" },
    { "name": "Ugandan Shilling", "symbol": "ugx" },
    { "name": "United States Dollar", "symbol": "usd" },
    { "name": "Vietnam Dong", "symbol": "vnd" },
    { "name": "CFA Franc (BCEAO)", "symbol": "xof" },
    { "name": "Pacific Franc", "symbol": "xpf" },
    { "name": "Yemen Riyal", "symbol": "yer" },
    { "name": "South African Rand", "symbol": "zar" },
    { "name": "Zambian Kwacha", "symbol": "zmk" }
  ];


  return (
    <div className="w-full">
      <select
        className="w-full p-1.5 rounded-xl text-white font-medium border-none
        outline-none appearance-none bg-no-repeat 
        hover:bg-[#d14e0d] transition-all duration-300"
        id="country-select"
        value={selectedCurrency}
        onChange={handleChange}
        style={{
          backgroundColor: "#E5590F",
          textAlign: "center",
          backgroundImage: "none",
        }}
      >
        {currencies.map((currency) => (
          <option
            className="rounded-lg text-gray-500 font-light bg-white text-center text-sm
            transition-colors duration-200 hover:bg-gray-100"
            key={`${currency.name}-${currency.symbol}`}
            value={`${currency.symbol}`}
          >
            {currency.name} 
            ({currency.symbol})
          </option>
        ))}
      </select>
      {/* Removed absolute div that was causing issues */}
    </div>
  );
};

export default SelectCurrency;
