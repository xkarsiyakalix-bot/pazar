const puppeteer = require('puppeteer');
const express = require('express');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'app/frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/frontend/build', 'index.html'));
});

const server = app.listen(3015, async () => {
  console.log('Server running on 3015');
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    }
  });
  
  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
  });

  await page.goto('http://localhost:3015');
  await new Promise(r => setTimeout(r, 3000));
  
  await browser.close();
  server.close();
});
