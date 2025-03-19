// const fetchData = async (url, options = {}) => {
//   try {
//     const response = await fetch(url, options);

//     // Throw an error if the response was not 2xx
//     if (!response.ok)
//       throw new Error(
//         `Fetch failed. ${response.status} ${response.statusText}`
//       );

//     // Check the content type to determine how to parse the response
//     const contentType = response.headers.get("content-type");
//     if (contentType && contentType.includes("application/json")) {
//       const jsonData = await response.json();
//       return [jsonData, null];
//     } else {
//       const textData = await response.text();
//       return [textData, null];
//     }
//   } catch (error) {
//     // if there was an error, log it and return a tuple: [data, error]
//     console.error(error.message);
//     return [null, error];
//   }
// };

// export default fetchData;

const fetchData = async (url, options = {}, timeout = 5000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  options.signal = controller.signal;

  try {
    const response = await fetch(url, options);

    // Check for successful response
    if (!response.ok) {
      throw new Error(
        `Fetch failed: ${response.status} ${response.statusText} - URL: ${url}`
      );
    }

    // Check the content type and parse accordingly
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const jsonData = await response.json();
      return [jsonData, null];
    } else if (contentType && contentType.includes("text")) {
      const textData = await response.text();
      return [textData, null];
    } else {
      throw new Error(`Unsupported content type: ${contentType}`);
    }
  } catch (error) {
    // Handle error (including timeout or abort errors)
    if (error.name === "AbortError") {
      console.error("Request timed out:", url);
    } else {
      console.error("Request failed:", error.message);
    }
    return [null, error];
  } finally {
    // Clear the timeout if the request was successful or aborted
    clearTimeout(timeoutId);
  }
};

export default fetchData;
