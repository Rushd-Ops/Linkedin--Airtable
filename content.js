(function() {

  console.log('linkedIn scraper extension activated');
  try{
    const rows = document.querySelectorAll('.models-table-wrapper.background-color-white');
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

     const nameBlock = row.querySelector('div');
     if (nameBlock) { //grabbing the whole nameBlock
      const nameSpans = [...nameBlock.querySelectorAll('span')];
      const nameDivs = [...nameBlock.querySelectorAll('div')];
//removing what i actually want
      leadName = nameSpans[0]?.innerText?.trim() ||'';
      title = nameDivs[1]?.innerText?.trim() ||'';
//pushing at the end of the for loop
     
     }
     const listCells = row.querySelectorAll('td[class^="list-people-detail-header"]');
     const company = spans[3]?.trim() ||'';

     const location = listCells[2]?.innerText?.trim()||'';
     const outreachActivity = listCells[4]?.innerText?.trim() ||''; 
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