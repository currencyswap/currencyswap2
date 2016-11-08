1. Install NodeJS
Go to: https://nodejs.org/en/download/
Donwload and install

2. Install GIT:

Go to: https://git-scm.com/downloads
Donwload and install


3. Install MySQL Server

Go to: https://dev.mysql.com/downloads/mysql/
Download: Windows (x86, 32-bit),MySQL Installer MSI


4. Install Redis on Windows:

Step1: Go to: http://redis.io/ and click on Download
Step2: Scroll down Windows, click on Learn more to open page: https://github.com/MSOpenTech/redis
Step3: Scroll down, click on "release page" to open page
Step4: The lastest version, under its 'Downloads' section, click on ' redis...msi' to download
Step5: Click on file 'redis...msi' to install, you will see the the redis server is now accepting connection on port 6379
Step6: Go to the folder installed redis: C:\Program Files\Redis
Step7: Open the 'redis-server'
Step8: Now open the 'redis-cli' excutable file
Step9: To confirm that Redis is installed and working properly, just type the 'ping' command in the excutable opened in step 8 above. If you get back a reply saying 'PONG', it means that Redis is successfully installed on your machine.

5. Run Project:
- Create Database
mysql -u root -p
mysql>CREATE DATABASE Currency_Swap; (or any other name)


- Checkout Project

git clone git@github.com:currencyswap/currencyswap.git

- Duplicate src/appconfig.json.template and rename to appconfig.json

Ex:
{
  "title" : "Currency Swap",#(or any other name)
  "redis": {
    "host" : "localhost",
    "port" : 6379,#port default
    "db"   : 10,#default
    "ttl"  : 3600,#default
    "disableTTL": false,#default
    "prefix" : "cs-app:"#default
  },
  "smtp" : {
    "host" : "72.249.191.25",#VSII mail
    "port": 25
  },
  "mailSender": {
    "sender": "nguyen.danh.thap@vsi-international.com",
    "subject": "[Currency Swap] Your password has been reset",
    "text": "Your new password is: "
  },
  "paging" : {
    "activityLogs": 4
  },
  "dateFormat" : {
    "datetime": "dd-mm-yy HH:MM",
    "date": "mmm dd,yyyy",
    "time": "HH:MM:ss"
  },
  "media": {#MEDIA_FOLDER
  },
  "logs" : "/WoskSpace/logs",#LOG_FOLDER
  "tokenExpired" : "7 d"#Token Expired
}


- Duplicate src/server/datasource.json.template and rename to datasource.json
Ex:
{
  "NodeJSApp": {
    "host": "localhost",
    "port": 3306, #port default
    "url": "",
    "database": "Currency_Swap",#Database name
    "password": "vsii123",#Database password
    "name": "Currency_Swap",#Any Other name
    "user": "thapnd",#Database user
    "connector": "mysql"
  }
}

- Run: npm install (You must go to "src" folder)
- Run: node .bin/setup.js
- Run: node .

