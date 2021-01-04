#!/bin/sh

# add sensu group
set +e
getent group sensu > /dev/null
RC=$?
set -e
if [ "${RC}" != 0 ]; then
    groupadd sensu
fi

# add sensu group
set +e
getent passwd sensu > /dev/null
RC=$?
set -e
if [ "${RC}" != 0 ]; then
    useradd -d /opt/sensu -g sensu sensu
    passwd -N sensu
fi

# chown sensu dirs
chown -Rh 0:0 /opt/sensu
chown -R sensu:sensu /etc/sensu
chown -R sensu:sensu /var/log/sensu
mkdir -p /var/run/sensu
chown -R sensu:sensu /var/run/sensu
chown -R sensu:sensu /var/cache/sensu
