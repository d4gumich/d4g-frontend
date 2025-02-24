import { KEYWORD_COUNT, 
         MILLISECONDS_TO_SECONDS,
         MAX_RETRIES } from "$lib/assets/constants/constants.js";
import { sleep, getBackoffWaitTime } from "$lib/components/utils/helper_functions.js";

export async function fetchSummary(summary_parameters, version) {
  
  let headers_ = new Headers();

  headers_.append('Content-Type', 'application/json');
  headers_.append('Accept', 'application/json');

  for (let fetch_attempt = 0; fetch_attempt < MAX_RETRIES; fetch_attempt++) {
    try {
      const response = await fetch(
        `https://d4gumsi.pythonanywhere.com/api/v${version}/products/summary`,
        {
          method: "POST",
          headers: headers_,
          body: JSON.stringify(summary_parameters),
        }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.text();
    } catch (error) {
      console.log(`Attempt ${fetch_attempt + 1} to fetch the summary failed. Retrying...`);
      await sleep(getBackoffWaitTime(fetch_attempt));
    }
  }

  throw new Error('All attempts failed');
}

async function fetchData(file, version, timeout) {

  let final_error;

  for (let fetch_attempt = 0; fetch_attempt < MAX_RETRIES; fetch_attempt++) {
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("kw_num", KEYWORD_COUNT);

      const rejectOnTimeout = () => new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Request timed out at ${timeout * MILLISECONDS_TO_SECONDS} seconds`));
        }, timeout);
      });

      const response = await Promise.race([
        fetch(
          `https://d4gumsi.pythonanywhere.com/api/v${version}/products/hangul`,
        {
          method: "POST",
          body: form,
        }),
        rejectOnTimeout()
      ]);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return await response.json();

    } catch(error) {
      console.log(`Attempt ${fetch_attempt + 1} to fetch initial data failed. Retrying...`);
      final_error = error;
      await sleep(getBackoffWaitTime(fetch_attempt));
    }
  }
  throw final_error;
}

export async function fetchDataWithTimeout(file, version, timeout) {
  try {
    return await fetchData(file, version, timeout);

  } catch (error) {
    console.error(error);
    return null;
  }
}