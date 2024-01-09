export const bonusRate = (invest_amount: number, type: number) => {
  var rate1 = 0;
  if (type === 0) { // if PGA
    if ( invest_amount <= 100 ) {
      rate1 = 0.27;
    } else if ( invest_amount <= 300 ) {
      rate1 = 0.24;
    } else if ( invest_amount <= 1000 ) {
      rate1 = 0.21;
    } else if ( invest_amount <= 2500 ) {
      rate1 = 0.19;
    } else {
      rate1 = 0.16;
    }
  }
  else { // if USD
    if ( invest_amount <= 100 ) {
      rate1 = 0.24;
    } else if ( invest_amount <= 1000 ) {
      rate1 = 0.21;
    } else if ( invest_amount <= 5000 ) {
      rate1 = 0.19;
    } else if ( invest_amount <= 10000 ) {
      rate1 = 0.16;
    } else {
      rate1 = 0.15;
    }
  }
  return rate1;
}
export const calcEstimationIncome = (invest_amount: number, type: number) => {
  var rate1 = 0;
  if (type === 0) { // if payment method is PGA
    if ( invest_amount <= 100 ) {
      rate1 = 0.27;
    } else if ( invest_amount <= 300 ) {
      rate1 = 0.24;
    } else if ( invest_amount <= 1000 ) {
      rate1 = 0.21;
    } else if ( invest_amount <= 2500 ) {
      rate1 = 0.19;
    } else {
      rate1 = 0.16;
    }
  }
  else {
    if ( invest_amount <= 100 ) {
      rate1 = 0.24;
    } else if ( invest_amount <= 1000 ) {
      rate1 = 0.21;
    } else if ( invest_amount <= 5000 ) {
      rate1 = 0.19;
    } else if ( invest_amount <= 10000 ) {
      rate1 = 0.16;
    } else {
      rate1 = 0.15;
    }
  }
  const profit = invest_amount * (rate1 + 1);
  return formatPrice(profit, 3);
}

export const formatPrice = (price: number, fixed_count: number = 3): string => {
  let formattedPrice = price.toFixed(fixed_count);
  const parsedPrice = Number.parseFloat(formattedPrice);
  return parsedPrice.toString();
};

export const formatNumber = (num: number, decimalPlaces: number = 2) : string => {
  const fixedNumber = num.toFixed(decimalPlaces).replace(/\.?0*$/, '');
  const parts = fixedNumber.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return parts.join('.');
}
