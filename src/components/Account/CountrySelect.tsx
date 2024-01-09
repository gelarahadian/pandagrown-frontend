import { useEffect } from 'react';
import countryList from './countries.json';

interface Country {
  name: string;
  code: string;
}

interface CountrySelectProps {
  value: string,
  onChange: any
};

const CountrySelect = ({ value, onChange }: CountrySelectProps) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const selectedCode = e.target.options[e.target.selectedIndex].dataset.code;
    onChange(selectedValue, selectedCode);
  };

  const handleGetInitialCode = () => {
    // alert(value);
    const country = countryList.find((country) => country.name === value);
      
    if (country) {
      onChange(value, country.code);
    } else {
      console.log("Country not found");
    }
  };
  

  useEffect(() => {
    handleGetInitialCode();
  }, []);


  return (
    <select
      className="h-57 w-full rounded-5 border border-gray p-4 my-3"
      placeholder="Select Country"
      id="country"
      name="country"
      value={value}
      onChange={handleSelectChange} >
      {countryList.map((country: Country, index) => (
        <option value={country.name} data-code={country.code} key={index}>{country.name}</option>
      ))}
    </select>
  )
}

export default CountrySelect;