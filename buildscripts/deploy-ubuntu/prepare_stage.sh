#!/bin/bash
if [ ! $# -eq 1 ]; then
	echo "$0 <stage-name>"
	exit 0
fi

DEPLOY_FILE_NAME=$1'.rb'
DEPLOY_FILE=`pwd`'/config/deploy/'$1
TMP_DEPLOY_FILE=`pwd`'/config/deploy/deploy.rb.tmp'

if [ ! -f $DEPLOY_FILE ]; then
    echo "Invalid stage name ${1}";
    exit 1;
fi

if [ ! -f $TMP_DEPLOY_FILE ]; then
    echo "Could not find template file.";
    exit 1;
fi

source $DEPLOY_FILE

V_DEPLOY_FOLDER=`echo $DEPLOY_FOLDER | sed 's/\//\\\\\\//g'`
V_MEDIA_FOLDER=`echo $MEDIA_FOLDER | sed 's/\//\\\\\\//g'`
V_APP_FOLDER=`echo $APP_FOLDER | sed 's/\//\\\\\\//g'`
V_DEPLOY_KEY=`echo $DEPLOY_KEY | sed 's/\//\\\\\\//g'`

TARGET_FILE=$DEPLOY_FILE'.rb'
cat $TMP_DEPLOY_FILE | sed 's/DB_NAME/'$DB_NAME'/g;s/DB_USER/'$DB_USER'/g;s/DB_HOST/'$DB_HOST'/g;s/DB_PASS/'$DB_PASS'/g;s/LDAP_HOST/'$LDAP_HOST'/g;s/LDAP_PORT/'$LDAP_PORT'/g;s/LDAP_PROTOCOL/'$LDAP_PROTOCOL'/g;s/LDAP_USER/'$LDAP_USER'/g;s/LDAP_PASSWORD/'$LDAP_PASSWORD'/g;s/REDIS_DB/'$REDIS_DB'/g;s/REDIS_HOST/'$REDIS_HOST'/g;s/REDIS_PORT/'$REDIS_PORT'/g;s/REDIS_PASSWORD/'$REDIS_PASSWORD'/g;s/REDIS_PREFIX/'$REDIS_PREFIX'/g;s/GIT_BRANCH/'$GIT_BRANCH'/g;s/MEDIA_FOLDER/'$V_MEDIA_FOLDER'/g;s/DEPLOY_FOLDER/'$V_DEPLOY_FOLDER'/g;s/APP_FOLDER/'$V_APP_FOLDER'/g;s/APP_USER/'$APP_USER'/g;s/SERVER_NAME/'$SERVER_NAME'/g;s/SERVER_USER/'$SERVER_USER'/g;s/DEPLOY_KEY/'$V_DEPLOY_KEY'/g;s/APP_SERVICE/'$APP_SERVICE'/g;' > $TARGET_FILE

if [ -f $TARGET_FILE ]; then
    echo "Your new staging file $DEPLOY_FILE_NAME is ready."
else
	echo "We're sorry, the task is not completed."
	exit 1
fi
