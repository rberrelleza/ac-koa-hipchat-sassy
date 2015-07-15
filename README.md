# Sassy #
Adds commands to search the internet for certain types of content.

## [Install Me](https://hipchat.com/addons/install?url=https%3A%2F%2Fsassy.hipch.at%2Faddon%2Fcapabilities) ##

# Commands #

### /anim, /animation ###

Searches Google for an animated image:

```
#!html
/anim {search phrase}
```

### /face ###
Searches Google for an image of a face:

```
#!html
/face {search phrase}
```

### /giphy, /gif ###
Searches Giphy for an animated image:

```
#!html
/giphy {search phrase}
```

### /img, /image ###
Searches Google for an image:

```
#!html
/img {search phrase}
```

### /info ###
Provides an informational summary of the best match for a search phrase:

```
#!html
/info {search phrase}
```

### /lmgtfy, /google ###
Helps someone perform a Google search:

```
#!html
/lmgtfy {search phrase}
```

### /map ###
Generates a map from a search phrase:

```
#!html
/map {search phrase}
```

### /meme, /memegen, /mgen ###
Creates a meme with one of the following patterns:
    
```
#!html
/meme {image url or search} | {top text} | {bottom text}
/meme y u no {text}
/meme aliens guy {text}
/meme brace yourself {text}
/meme {text} all the {things}
/meme I don't always {something} but when I do {text}
/meme {text} too damn {something}
/meme not sure if {something} or {something else}
/meme yo dawg {text} so {text}
/meme all your {text} are belong to {text}
/meme one does not simply {text}
/meme if you {text} gonna have a bad time
/meme if {text}, {word that can start a question} {text}?
/meme {word that can start a question} the {expletive} {text}
/meme success when {text} then {text}
/meme cry when {text} then {text}
/meme bad luck when {text} then {text}
/meme scumbag {text} then {text}
/meme what if I told you {text}
/meme I hate {text}
/meme why can't {personal pronoun} {text}
/meme {text} so I got that going for me
/meme {things}, how do they work?
/meme {text}{3 x a|e|i|o|u|y}{text}
/meme do you want {text} because that's how {text}
```

### /video, /youtube, /yt ###
Searches for a video:

```
#!html
/video {search phrase}
```

### /weather ###
Displays current weather or a forecast for the given location:

```
#!html
/weather {location}
```

# Run Sassy yourself with Docker #
This is an experimental way for you to run Sassy yourself using Docker (i.e. "Behind the Firewall" with HipChat Server)

### Prerequisites ###
1. get your API key from api.giphy.com
2. get your API key from developer.forecast.io
3. get your API key from console.developers.google.com
4. git clone https://bitbucket.org/atlassianlabs/ac-koa-hipchat-sassy.git

### Build ###
1. cd ac-koa-hipchat-sassy 
2. sudo docker build -t atlassian_labs/sassy:latest .

### Run ###
1. sudo docker run --name sassy-mongo --detach mongo:2.6
2. sudo docker logs sassy-mongo
3. sudo docker run --name sassy --detach --link sassy-mongo:mongo --publish 3020:3020 -e NODE_ENV="production"
   -e LOCAL_BASE_URL="http://your-docker-host-fqdn:3020" -e PORT=3020 -e GIPHY_API_KEY="yourapikeyhere"
   -e FORECAST_API_KEY="yourapikeyhere" -e YOUTUBE_API_KEY="yourapikeyhere" atlassian_labs/sassy:latest
4. sudo docker logs sassy
5. Verify you see a valid capabilities.json returned from http://your-docker-host-fqdn:3020/addon/capabilities

### Install ###
1. Integrate your Docker-Sassy with your HipChat account with https://hipchat.example.com/admin/addons (or www.hipchat.com) -> Manage (tab) -> Install an integration from a descriptor URL: http://your-docker-host-fqdn:3020/addon/capabilities

### Play ###
1. Go to a chat room and type /sassy

### Things to remember ###
1. Use a firewall/iptables at the Docker host level to set ACLs and filter traffic
2. Use your own SSL termination and port forwarding from the Docker host to protect your Sassy traffic
3. You may have noticed the Docker container publishes through the host port 3020 so check for port conflicts
4. If installing to HipChat Server your HC Server should have a valid trusted SSL cert from a major CA vendor, self signed is not supported (yet)
5. To debug you can override the entry point by using docker run --interactive --tty ... and appending /bin/bash
6. You are linking your Sassy App to a persistent MongoDB Container which will contain your installation/registration, if you destroy your MongoDB container (sadpanda) you will have to uninstall and reinstall Sassy again in your HipChat account