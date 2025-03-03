import { KEYWORD_COUNT, 
         MILLISECONDS_TO_SECONDS,
         MAX_RETRIES } from "$lib/assets/constants/constants.js";
import { sleep, getBackoffWaitTime } from "$lib/components/utils/helper_functions.js";
import { get } from 'svelte/store';
import { checkboxes } from "$lib/store.js";
import { num_keywords } from "$lib/store.js";

// export async function fetchSummary(summary_parameters, version) {
  
//   let headers_ = new Headers();

//   headers_.append('Content-Type', 'application/json');
//   headers_.append('Accept', 'application/json');

//   for (let fetch_attempt = 0; fetch_attempt < MAX_RETRIES; fetch_attempt++) {
//     try {
//       const response = await fetch(
//         // `https://d4gumsi.pythonanywhere.com/api/v${version}/products/summary`,
//         "http://127.0.0.1:5000/api/v2/products/summary",
//         {
//           method: "POST",
//           headers: headers_,
//           body: JSON.stringify(summary_parameters),
//         }
//       );
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       return response.text();
//     } catch (error) {
//       console.log(`Attempt ${fetch_attempt + 1} to fetch the summary failed. Retrying...`);
//       await sleep(getBackoffWaitTime(fetch_attempt));
//     }
//   }

//   throw new Error('All attempts failed');
// }

async function fetchData(file, version, timeout, isAPI) {

  let final_error;
  const api_data = get(checkboxes);

  for (let fetch_attempt = 0; fetch_attempt < MAX_RETRIES; fetch_attempt++) {
    try {
      const form = new FormData();
      form.append("file", file);
      if (!isAPI) {
        form.append("kw_num", KEYWORD_COUNT);
      }
      else {
        form.append("kw_num", get(num_keywords));
        api_data.forEach(item => {
          form.append(item.var_name, item.checked ? "True" : "False");
        });
      }

      const rejectOnTimeout = () => new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Request timed out at ${timeout * MILLISECONDS_TO_SECONDS} seconds`));
        }, timeout);
      });

      const response = await Promise.race([
        fetch(
          `https://d4gumsi.pythonanywhere.com/api/v${version}/products/hangul`,
          // 'http://127.0.0.1:5000/api/v2/products/hangul',
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

export async function fetchDataWithTimeout(file, version, timeout, isAPI) {
  try {
    return await fetchData(file, version, timeout, isAPI);

  } catch (error) {
    console.error(error);
    return null;
  }
}