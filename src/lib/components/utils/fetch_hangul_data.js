import { KEYWORD_COUNT, 
         MILLISECONDS_TO_SECONDS,
         MAX_RETRIES } from "$lib/assets/constants/constants.js";
import { sleep, getBackoffWaitTime } from "$lib/components/utils/helper_functions.js";
import { get } from 'svelte/store';
import { checkboxes } from "$lib/store.js";
import { num_keywords } from "$lib/store.js";
import { HOST_URL } from '$lib/config.js';
import { aiStatus } from '$lib/aiSetupStore.js';

// ... rest of code

async function fetchData(file, version, timeout, isAPI) {

  let final_error;
  const api_data = get(checkboxes);
  const ai_status = get(aiStatus);

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

      const base_url = HOST_URL;
      
      const headers = {};
      if (ai_status.forceTeamKey) {
        headers['X-Force-Team-Key'] = 'true';
      }

      const response = await Promise.race([
        fetch(
          `${base_url}api/v${version}/products/hangul`,
        {
          method: "POST",
          body: form,
          headers: headers,
          credentials: 'include'
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
    return { error: error.message || "Unknown Error" };
  }
}