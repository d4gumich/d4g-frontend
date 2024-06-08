// helper_functions.js
export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const getTopLocations = (arr, prop) => {
  const TOP_N_COUNTRIES = 3;
  const topCountriesArr = {};
  const keys = Object.keys(arr);
  const top_n = Math.min(TOP_N_COUNTRIES, keys.length);

  for (let n=0; n < top_n; n++) {
    topCountriesArr[n] = null;
  }

  for (let n=0; n < top_n; n++) {
    for (let i=0 ; i<keys.length ; i++) {
        if (topCountriesArr[n] === null || arr[keys[i]][prop] > topCountriesArr[n].occurences) {
          topCountriesArr[n] = {"country":keys[i], 
                        "occurences": arr[keys[i]][prop]};
        }
    }

    if (topCountriesArr[n] !== null) {
      let index = keys.indexOf(topCountriesArr[n].country);
      keys.splice(index, 1);
    }
  }
  return topCountriesArr;
}