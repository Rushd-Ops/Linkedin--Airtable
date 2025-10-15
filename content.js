(function() {

  console.log('linkedIn scraper extension activated');
  try{
    const rows = document.querySelectorAll('div.flex.flex-col.justify-center.items-start.ml-1.leading-regular');
    if (!rows.length) {
        console.log('No profiles found on this page.');
        return '';
    }

    const data = [];
    for(const row of rows) {
     const spans = [...row.querySelectorAll('span')].map(el => el.innerText.trim()).filter(Boolean);
     const divs = [...row.querySelectorAll('div')].map(el => el.innerText.trim()).filter(Boolean);
     
     const name = spans[0].trim() ||'';
     const degree = spans[1].trim() ||'';

     const headline = divs[1]||'';
     const location = spans[spans.length-1] ||'';

     data.push({name,degree,headline,location});
    }
   console.log('Scraped profiles:', data);
   alert(`Extracted ${data.length} profiles. Check the console for details.`); //the safe stuff: DO NOT change
   
   //beginning CSV change
   const csvRows = [
    ['Name','Degree', 'Headline', 'Location'],
    ...data.map(d =>[d.name,d.degree,d.headline,d.location])
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