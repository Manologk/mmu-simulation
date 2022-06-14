export function pageFaults_lru(pages, n, capacity) {
  // To represent set of current pages. We use
  // an unordered_set so that we quickly check
  // if a page is present in set or not
  let s = new Set();

  // To store least recently used indexes
  // of pages.
  let indexes = new Map();

  // Start from initial page
  let page_faults = 0;
  for (let i = 0; i < n; i++) {
    // Check if the set can hold more pages
    if (s.size < capacity) {
      // Insert it into set if not present
      // already which represents page fault
      if (!s.has(pages[i])) {
        s.add(pages[i]);

        // increment page fault
        page_faults++;
      }

      // Store the recently used index of
      // each page
      indexes.set(pages[i], i);
    }

    // If the set is full then need to perform lru
    // i.e. remove the least recently used page
    // and insert the current page
    else {
      // Check if current page is not already
      // present in the set
      if (!s.has(pages[i])) {
        // Find the least recently used pages
        // that is present in the set
        let lru = Number.MAX_VALUE,
          val = Number.MIN_VALUE;

        for (let itr of s.values()) {
          let temp = itr;
          if (indexes.get(temp) < lru) {
            lru = indexes.get(temp);
            val = temp;
          }
        }

        // Remove the indexes page
        s.delete(val);
        //remove lru from hashmap
        indexes.delete(val);
        // insert the current page
        s.add(pages[i]);

        // Increment page faults
        page_faults++;
      }

      // Update the current page index
      indexes.set(pages[i], i);
    }
  }
  return page_faults;
}







