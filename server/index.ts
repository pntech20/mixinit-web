require('dotenv').config();

const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const R = require('ramda');
const axios = require('axios');
const dayjs = require('dayjs');
const secure = require('./force-https');

const PORT = process.env.PORT || 3000;
const indexPath = path.resolve(__dirname, '..', 'client', 'build', 'index.html');
const buildPath = path.resolve(__dirname, '..', 'client', 'build');

// Middleware to block specific routes
// https://www.reddit.com/r/webdev/comments/me9jqh/mysterious_requests_for_nonexistent_resources/
// const blockedRoutes = [
//     '/blog/wp-includes/wlwmanifest.xml',
//     '/web/wp-includes/wlwmanifest.xml',
//     '/wordpress/wp-includes/wlwmanifest.xml',
//     '/website/wp-includes/wlwmanifest.xml',
//     '/wp/wp-includes/wlwmanifest.xml',
//     '/news/wp-includes/wlwmanifest.xml',
//     '/2018/wp-includes/wlwmanifest.xml',
//     '/2019/wp-includes/wlwmanifest.xml',
//     '/shop/wp-includes/wlwmanifest.xml',
//     '/wp1/wp-includes/wlwmanifest.xml',
//     '/test/wp-includes/wlwmanifest.xml',
//     '/media/wp-includes/wlwmanifest.xml',
//     '/wp2/wp-includes/wlwmanifest.xml',
//     '/site/wp-includes/wlwmanifest.xml',
//     '/cms/wp-includes/wlwmanifest.xml',
//     '/sito/wp-includes/wlwmanifest.xml',
//     '/xmlrpc.php',
//     '/xmlrpc.php?rsd',
//     '/wp-login.php',
//     '/wp-admin.php',
//     '/wp-content.php',
//     '/wp-cron.php',
//     '/wp-comments-post.php',
//     '/wp-config.php',
//     '/index.php',
//     '/blog/index.php',
//     '/wordpress/index.php',
//     '/wp/wp-login.php',
//     '/old/wp-login.php',
//     '/test/wp-login.php',
//     '/dev/wp-login.php',
//     '/staging/wp-login.php',
//     '/login.php',
//     '/admin.php',
//     '/config.php',
// ];

app.use((req, res, next) => {
    if (req.path.includes('wlwmanifest.xml') || req.path.includes('xmlrpc.php')) {
        return res.status(403).send('Access forbidden');
        // return res.redirect('https://open.spotify.com/');// Let the bots scraw Spotify LOL
    }
    next();
});
// static resources should just be served as they are
app.use(
    express.static(buildPath, {
        maxAge: '30d',
    })
);

// https://github.com/expressjs/express/issues/4777
app.use(secure);

// here we serve the index.html page
app.get('/*', (req, res) => {
    fs.readFile(indexPath, 'utf8', async (err, htmlData) => {
        try {
            if (err) {
                console.error('Error during file reading', err);
                return res.status(404).end();
            }

            let title = '';
            let description = '';
            let image = '';

            if (req?._parsedUrl.pathname.includes('/tracks/')) {
                const [, slug] = req?._parsedUrl.pathname.split('/tracks/');
                if (slug) {
                    const response = await axios.get(`${process.env.REACT_APP_URL_API}/v1/seo/tracks/${slug}`);
                    const track = response?.data?.data;
                    if (track) {
                        title = `${track?.title} - ${track?.artist}`;
                        description = `${track.user} - ${track?.label} - ${dayjs(track?.createdAt).format('MMM DD, YYYY')}`;
                        image = track.artwork;
                    }
                }
            }

            if (req?._parsedUrl.pathname.includes('/multipacks/')) {
                const [, slug] = req?._parsedUrl.pathname.split('/multipacks/');
                if (slug) {
                    const response = await axios.get(`${process.env.REACT_APP_URL_API}/v1/seo/releases/${slug}`);
                    const release = response?.data?.data;
                    if (release) {
                        title = `${release?.user} - ${release?.title}`;
                        description = `${release?.label} - ${dayjs(release?.createdAt).format('MMM DD, YYYY')}`;
                        image = release.artwork;
                    }
                }
            }

            if (req?._parsedUrl.pathname.includes('/contributors/')) {
                const [, slug] = req?._parsedUrl.pathname.split('/contributors/');
                if (slug) {
                    const response = await axios.get(`${process.env.REACT_APP_URL_API}/v1/seo/contributors/${slug}`);
                    const contributor = response?.data?.data;
                    if (contributor) {
                        title = contributor?.username;
                        description = contributor?.biography || 'All the power of the Crooklyn Clan Vault, simplified';
                        image = contributor?.avatar || 'https://pbs.twimg.com/profile_images/883435588245835776/9ZAyReEQ_400x400.jpg';
                    }
                }
            }

            if (req?._parsedUrl.pathname.includes('/labels/')) {
                const [, path] = req?._parsedUrl.pathname.split('/labels/');
                const [slug] = path.split('?tab');

                if (slug) {
                    const response = await axios.get(`${process.env.REACT_APP_URL_API}/v1/seo/labels/${slug}`);
                    const label = response?.data?.data;
                    if (label) {
                        title = `${label?.name}`;
                        description = `${label?.biography}`;
                        image = label.squareImageUrl;
                    }
                }
            }

            console.log(title, image, description);
            if (title && image && description) {
                // inject meta tags
                htmlData = htmlData
                    .replaceAll('Mixinit V.1', title)
                    .replaceAll('All the power of the Mixinit, simplified', description)
                    .replaceAll('https://pbs.twimg.com/profile_images/883435588245835776/9ZAyReEQ_400x400.jpg', image);
            }
            return res.send(htmlData);
        } catch (error) {
            console.error(error);
        }
    });
});

// listening...
app.listen(PORT, (error) => {
    if (error) {
        return console.log('Error during app startup', error);
    }
    console.log('Listening on ' + PORT + '...');
});
