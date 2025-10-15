(function() {

  console.log('linkedIn scraper extension activated');
  try{
    const rows = document.querySelectorAll('.models-table-wrapper.background-color-white tr');
    if (!rows.length) {
        console.log('No profiles found on this page.');
        return '';
    }

    const data = [];
    for(const row of rows) {
     const spans = [...row.querySelectorAll('span')].map(el => el.innerText.trim()).filter(Boolean);
     const divs = [...row.querySelectorAll('div')].map(el => el.innerText.trim()).filter(Boolean);
     
     let leadName = '';
     let title = '';
     const listCells = row.querySelectorAll('td[class^="list-people-detail-header"]');
     const nameBlock = listCells[0] ||null;

     if (nameBlock) { //grabbing the whole nameBlock
      const allSpans = [...nameBlock.querySelectorAll('span')].map(el => el.innerText.trim()).filter(Boolean);
      const allDivs = [...nameBlock.querySelectorAll('div')].map(el => el.innerText.trim()).filter(Boolean);
      console.log('All Divs in the row:', allDivs);
//removing what i actually want
      leadName = allSpans[0] || '';
      leadName = leadName.replace(/^Select\s+/, '');
      title = allDivs[allDivs.length - 1] || '';
//pushing at the end of the for loop
     
     }

     let company = listCells[1]?.innerText?.trim() ||'';
     company = company.replace(/\n\(\+\d+\)$/, '');

     const location = listCells[2]?.innerText?.trim()||'';
     let outreachActivity = listCells[4]?.innerText?.trim() ||''; 
     outreachActivity = outreachActivity.replace(/\s*\n\s*/g, ' ');
     const dateAdded = listCells[5]?.innerText?.trim() ||'';


     data.push({
      leadName,
      title,
      company,
      location,
      outreachActivity,
      dateAdded});
    }

   console.log('Scraped profiles:', data);
   alert(`Extracted ${data.length} profiles. Check the console for details.`); //the safe stuff: DO NOT change
   
   //beginning CSV change
   const csvRows = [
    ['Name','Title', 'Company', 'Location', 'Outreach Activity','Date Added'],
    ...data.map(d =>[d.leadName,d.title,d.company,d.location,d.outreachActivity,d.dateAdded])
   ] //array of arrays: first row is headers, rest are data rows, hence the double []
   .map(r => r.map(c=> `"${c.replace(/"/g,'""')}"`).join(','))//escape qoutes and join rows with commas
   .join('\n');

   const blob = new Blob([csvRows], {type:'text/csv'});

   const url = URL.createObjectURL(blob);

   const a = document.createElement('a');
   a.href = url;
   a.download = 'linkedin_profiles.csv';

   document.body.appendChild(a);
   a.click();
   document.body.removeChild(a);
   URL.revokeObjectURL(url);
   //end of the CSV change

 }catch(err) {
  console.error('Error scraping LinkedIn:', err);
  alert("Scraper encountered an error. Check console for details.");
 }
 
})();