# Birdcage

A HTTP(s) Reverse Proxy built on Redbird with a sleek Web UI.

## Running from source

### Step 1: Clone project
```
$ git clone https://github.com/IZEDx/birdcage
$ cd birdcage
```

### Step 2: Install dependencies
```
$ npm i
```

### Step 3: Build project
```
$ npm run build
```

### (OPTIONAL) Step 3.5: Link project globally
```
$ npm link
```
Linking the 


### Step 4: Run project
From project root:
```
$ npm start
```

Via global link or npm -g:
```
$ birdcage
```

Running birdcage will create a config.json in the working directory. This is where birdcage stores all configuration including the routes themselves and the password. To change the ports birdcage uses, you have to edit this file manually.

To keep birdcage running after closing the terminal sessions I suggest using [pm2](https://www.npmjs.com/package/pm2):
```
$ pm2 start birdcage
```

## First login

After birdcage has started you can find the webpanel on port 3330 (you can change this port in the config.json) on this machine.

Upon initializing a new config.json eg. starting birdcage for the first time, you will not need to login using the password, because there is none set yet. I highly suggest setting the password immediately via the settings button in the upper right corner of the web panel.

Also since birdcage doesn't know any domains yet, the webpanel is by default only accessible via http. So I also highly suggest setting up the webpanel as the first route, simply type the following in the add route dialog at the top of the webpanel (I suggest using the subdomain birdcage.[domain]):
```
Source: birdcage.<your-domain>.com
Target: localhost:3330
HTTPS: true
Owner email: <your-mail>
```
Make sure that your domain correctly points at the server birdcage is running on.
If anything is not setup correctly and you're attempting to get a certificate from Let's Encrypt you risk getting banned. I suggest first adding the route without HTTPS, check if it works and then upgrade to HTTPS.