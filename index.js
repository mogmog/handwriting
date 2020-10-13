/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */

exports.makeMap = (req, res) => {

    const mapnik = require('mapnik');
    var fs = require('fs');


    // register fonts and datasource plugins
    mapnik.register_default_fonts();
    mapnik.register_default_input_plugins();


    function run (text) {
        return new Promise(async (resolve, reject) => {
            try {

                var map = new mapnik.Map(256, 256);

               map.load('./stylesheet.xml', function(err,map) {
                    if (err) throw err;
                    map.zoomAll();
                    var im = new mapnik.Image(256, 256);
                    map.render(im, function(err,im) {
                        if (err) throw err;
                        im.encode('png', function(err,buffer) {
                            if (err) throw err;
                            return resolve(buffer);
                        });
                    });
                });

            } catch (e) {
                return reject(e);
            }
        })
    }

    run()
        .then(buffer => {

            res.set('Access-Control-Allow-Origin', '*');

            if (req.method === 'OPTIONS') {
                // Send response to OPTIONS requests
                res.set('Access-Control-Allow-Methods', 'GET');
                res.set('Access-Control-Allow-Headers', 'Content-Type');
                res.set('Access-Control-Max-Age', '3600');
                res.status(204).send('');
            } else {
                //console.log(url);
                res.end(new Buffer(buffer, 'base64'));
                //res.status(200).json({ svg: 123 })
            }

        })
        .catch(err => {
            console.error(err);
            res.status(500).send("An Error occured" + err);
        })

};exports.makeText = (req, res) => {

    const puppeteer = require('puppeteer');

    function run (text) {
        return new Promise(async (resolve, reject) => {
            try {
                const browser = await puppeteer.launch({args: ['--no-sandbox']});
                const page = await browser.newPage();

                await page.goto("https://www.calligrapher.ai");
                await page.waitFor(1000)
                //await page.input('#speed-slider', "9")
                //await page.select('#select-style', '3')
                await page.type('#text-input', text)
                await page.click('#draw-button')
                await page.waitFor(2500)

                let imageurl = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll('#canvas path')).map(e => e.attributes[0].nodeValue)
                })

                browser.close();
                return resolve(imageurl);
            } catch (e) {
                return reject(e);
            }
        })
    }

    //console.log(decodeURIComponent(req.path));
    // console.log(decodeURIComponent(req.path).replace('/', ''));

    run(decodeURIComponent(req.path).replace('/', ''))
        .then(url => {

            res.set('Access-Control-Allow-Origin', '*');

            if (req.method === 'OPTIONS') {
                // Send response to OPTIONS requests
                res.set('Access-Control-Allow-Methods', 'GET');
                res.set('Access-Control-Allow-Headers', 'Content-Type');
                res.set('Access-Control-Max-Age', '3600');
                res.status(204).send('');
            } else {
                res.status(200).json({ svg: url })
            }

        })
        .catch(err => {
            console.error(err);
            res.status(500).send("An Error occured" + err);
        })

};


exports.makeText = (req, res) => {

    const puppeteer = require('puppeteer');

    function run (text) {
        return new Promise(async (resolve, reject) => {
            try {
                const browser = await puppeteer.launch({args: ['--no-sandbox']});
                const page = await browser.newPage();

                await page.setViewport({
                    width: 411,
                    height: 731
                })

                await page.goto("https://www.calligrapher.ai");
                await page.waitFor(1000)
                //await page.input('#speed-slider', "9")
                //await page.select('#select-style', '3')
                await page.type('#text-input', text)
                await page.click('#draw-button')
                await page.waitFor(5500)

                let imageurl = await page.evaluate(() => {
                   return Array.from(document.querySelectorAll('#canvas path')).map(e => e.attributes[0].nodeValue)
                })

                browser.close();
                return resolve(imageurl);
            } catch (e) {
                return reject(e);
            }
        })
    }

    //console.log(decodeURIComponent(req.path));
   // console.log(decodeURIComponent(req.path).replace('/', ''));

    run(decodeURIComponent(req.path).replace('/', ''))
        .then(url => {

            res.set('Access-Control-Allow-Origin', '*');

            if (req.method === 'OPTIONS') {
                // Send response to OPTIONS requests
                res.set('Access-Control-Allow-Methods', 'GET');
                res.set('Access-Control-Allow-Headers', 'Content-Type');
                res.set('Access-Control-Max-Age', '3600');
                res.status(204).send('');
            } else {
                res.status(200).json({ svg: url })
            }

        })
        .catch(err => {
            console.error(err);
            res.status(500).send("An Error occured" + err);
        })

};
