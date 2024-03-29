import { KEYWORD_COUNT, MILLISECONDS_TO_SECONDS } from "$lib/assets/constants/constants.js";

async function fetchData(file, version) {
  const form = new FormData();
  form.append("file", file);
  form.append("kw_num", KEYWORD_COUNT);

  const response = await fetch(
    `https://d4gumsi.pythonanywhere.com/api/v${version}/products/hangul`,
    {
      method: "POST",
      body: form,
      cors: "cors",
    }
  );
  if (!response.ok) {
    console.log("Network response was not ok");
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export async function fetchDataWithTimeout(file, version, timeout) {
  let requestTimedOut = false;

  const rejectOnTimeout = new Promise((resolve, reject) => {
    setTimeout(() => {
      requestTimedOut = true;
      reject(new Error(`Request timed out at ${timeout * MILLISECONDS_TO_SECONDS} seconds`));
    }, timeout);
  });

  try {
    // Use Promise.race() to await the first promise to settle (either success or timeout)
    const result = await Promise.race([fetchData(file, version), rejectOnTimeout]);
    if (requestTimedOut) {
      // Ignore or discard the response since the request timed out
      console.log('Request timed out, ignoring response');
      return null; // or throw an error
    }
    return result;
  } catch (error) {
    throw error; // Propagate the error
  }
}