// helper_functions.js
import { TIME_MULTIPLIER_M, 
         TIME_EXPONENT_B,
         SECONDS_TO_MILLISECONDS,
         MILLISECONDS_TO_SECONDS,
         MAXIMUM_BACKOFF_MILLISECONDS } from "$lib/assets/constants/constants";

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

export const calculateEstimatedTime = (pages) => {
  return Math.round(TIME_MULTIPLIER_M * Math.exp(TIME_EXPONENT_B * pages));
}

export const getBackoffWaitTime = (fetch_attempt) => {
  /* more info at https://docs.clearblade.com/iotcore/implementing-exponential-backoff */

  let random_number_milliseconds;
  let backoff_wait_time;

  random_number_milliseconds = Math.random() * SECONDS_TO_MILLISECONDS;
  backoff_wait_time = Math.min((Math.pow(2, fetch_attempt) * SECONDS_TO_MILLISECONDS) + random_number_milliseconds, MAXIMUM_BACKOFF_MILLISECONDS);
  console.log(`Waiting ${Math.round(backoff_wait_time) * MILLISECONDS_TO_SECONDS} seconds before retrying...`);

  return backoff_wait_time;
}

export const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export const combineTitleFonts = (titleArray) => {
  let grouped = titleArray.reduce((acc, [num, text]) => {
		acc[num] = acc[num] ? `${acc[num]} ${text}` : text;
		return acc;
	}, {});

	return Object.entries(grouped).map(([num, text]) => [Number(num), text]);
}