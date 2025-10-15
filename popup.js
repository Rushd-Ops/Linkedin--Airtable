document.getElementById('runScraper').addEventListener('click', async () => {
  const status = document.getElementById('status');

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Inject content.js (and countries.js if needed)
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });

    status.textContent = 'Scraper ran! Check console for results.';
    status.style.color = 'green';
  } catch (err) {
    console.error(err);
    status.textContent = 'Error running scraper.';
    status.style.color = 'red';
  }
});

