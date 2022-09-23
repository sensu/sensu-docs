---
title: "Secure PostgreSQL"
linkTitle: "Secure PostgreSQL"
guide_title: "Secure PostgreSQL"
type: "guide"
description: "Secure communication between Sensu and PostgreSQL"
weight: 65
version: "6.8"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.8:
    parent: deploy-sensu
---

We've already covered [securing communications between Sensu and its agents][1]. In this guide, we'll cover the necessary steps to secure communication between Sensu and the PostgreSQL event store using certificate authentication.

{{% notice note %}}
While we'll cover using certificate authentication to secure communication between Sensu and PostgreSQL, this guide is not exhaustive and is only intended to provide a starting point. There are many different options when it comes securing PostgreSQL and we encourage you to perform some due diligence when deciding whether or not this method will meet your organizational needs.
{{% /notice  %}}

We'll start off by generating the certificates we need for Sensu and PostgreSQL.

# Prerequisites

* A running Sensu deployment
* A running PostgreSQL instance

# Installing cfssl

If you've gone through the exercise of securing backend to agent communication, you'll already have [Cloudflare's cfssl][2] tool downloaded and ready to use. If not, please go ahead and install it now:

### Download cfssl

{{< language-toggle >}}

{{< code shell MacOS >}}

# Install cfssl via homebrew

brew install cfssl

{{< /code >}}

{{< code "RedHat/Rocky/Alma" >}}

# Download and install cfssl binaries from Github

sudo curl -s -L -o /bin/cfssl https://github.com/cloudflare/cfssl/releases/download/v1.6.2/cfssl-bundle_1.6.2_linux_amd64

sudo curl -s -L -o /bin/cfssl-certinfo https://github.com/cloudflare/cfssl/releases/download/v1.6.2/cfssl-certinfo_1.6.2_linux_amd64

sudo chmod +x /bin/cfssl*

{{< /code >}}

{{< code "Ubuntu/Debian" >}}

# Update apt repos
sudo apt-get update

# Install cfssl
sudo apt-get install golang-cfssl

{{< /code >}}

{{< /language-toggle >}}

Once you've installed cfssl, you can verify that it's beens successfully installed by running

{{< code shell >}}

cfssl version

{{< /code >}}

### Create a Certificate Authority (CA)

To generate certificates for Sensu and PostgreSQL, we're going to follow a very similar process to the one in ["Generate certificates for your Sensu installation"][3]. So if you've already gone through that exercise, this should be familiar.

Follow these steps to create a CA with cfssl and cfssljson:

1. Create `/etc/sensu/tls` (which does not exist by default):
{{< code shell >}}
mkdir -p /etc/sensu/tls
{{< /code >}}

2. Navigate to the new /etc/sensu/tls directory:
{{< code shell >}}
cd /etc/sensu/tls
{{< /code >}}

3. Create the CA:
{{< code shell >}}
echo '{"CN":"Sensu Test CA","key":{"algo":"rsa","size":2048}}' | cfssl gencert -initca - | cfssljson -bare ca -
{{< /code >}}

4. Define signing parameters and profiles:
{{< code shell >}}
echo '{"signing":{"default":{"expiry":"17520h","usages":["signing","key encipherment","client auth"]},"profiles":{"postgresql":{"usages":["signing","key encipherment","server auth","client auth"],"expiry":"4320h"},"backend":{"usages":["signing","key encipherment","client auth"],"expiry":"4320h"}}}}' > ca-config.json
{{< /code >}}
{{% notice note %}}
**NOTE**: We suggest a 6-month expiry duration for security, but you can use any duration you prefer when you define the `expiry` attribute value in the signing parameters.
{{% /notice %}}

<a id="copy-ca-pem"></a>

You should now have a directory at `/etc/sensu/tls` that contains the following files:

 filename        | description |
-----------------|-------------|
`ca.pem`         | CA root certificate. Required for all systems running the Sensu backend or agent. The agent and backend use `ca.pem` to validate server certificates at connection time. |
`ca-key.pem`     | CA root certificate private key. |
`ca-config.json` | CA signing parameters and profiles. Not used by Sensu. |
`ca.csr`         | Certificate signing request for the CA root certificate. Not used by Sensu. |

### Generate certificate and key for PostgreSQL

Now, let's generate the certs we need for PostgreSQL.

<a id="example-postgresql"></a>

This guide assumes your PostgreSQL instance is reachable via a `10.0.0.x` IP address, a fully qualified name (for example, `postgres.example.com`), and an unqualified name (for example, `postgres`):

Unqualified<br>name | IP address | Fully qualified<br>domain name<br>(FQDN) | Additional<br>names |
-----------------|------------|------------------------------------|----------------------|
postgres         | 10.0.0.43   | postgres.example.com              | localhost, 127.0.0.1 |

The additional names for localhost and 127.0.0.1 are added here for convenience and are not strictly required.

- The values provided for the ADDRESS variable will be used to populate the certificate's SAN records.
For systems with multiple hostnames and IP addresses, add each to the comma-delimited value of the ADDRESS variable.
- The value provided for the NAME variable will be used to populate the certificate's CN record.
It will also be used in the names for the `*.pem` and `*.csr` files.

{{< code shell >}}

export ADDRESS=localhost,127.0.0.1,10.0.0.43,postgres,postgres.example.com

export NAME=postgres.example.com

echo '{"CN":"'$NAME'","hosts":[""],"key":{"algo":"rsa","size":2048}}' | cfssl gencert -config=ca-config.json -profile="postgresql" -ca=ca.pem -ca-key=ca-key.pem -hostname="$ADDRESS" - | cfssljson -bare $NAME

{{< /code >}}

Let's move on to generating the certificate for the Sensu backend.

You should now have the following files in your `/etc/sensu/tls` directory that we'll use for our PostgreSQL instance:

 filename        | description |
-----------------|-------------|
`postgres.example.com.pem`         | The certificate that your PostgreSQL instance will use.|
`postgres.example.com-key.pem`     | The private key that your PostgreSQL instance will use. |
`postgres.example.com.csr`         | Certificate signing request for the PostgreSQL certificate. Not used. |

### Generate certificate and key for your Sensu backend

Just like we generated the certificate and key for PostgreSQL, we'll need another cert and key for the Sensu backend. To start, we'll do the following:

{{< code shell >}}

export POSTGRES_USERNAME=sensu

echo '{"CN":"'$POSTGRES_USERNAME'","hosts":[""],"key":{"algo":"rsa","size":2048}}' | cfssl gencert -config=ca-config.json -ca=ca.pem -ca-key=ca-key.pem -hostname="" -profile=backend - | cfssljson -bare $POSTGRES_USERNAME

{{< /code >}}

You should now have the following files in your `/etc/sensu/tls` directory that the Sensu backend will use to communicate with PostgreSQL:

 filename        | description |
-----------------|-------------|
`sensu.pem`         | The certificate that your Sensu backend will use.|
`sensu-key.pem`     | The private key that your Sensu backend will use. |
`sensu.csr`         | Certificate signing request for the Sensu backend certificate. Not used. |

Now that we have our certs and keys, let's get them onto our PostgreSQL instance and Sensu backend. We'll start with the Sensu backend first.

### Configuring Sensu to use certificate authentication with PostgreSQL

This guide assumes that you've been working from your Sensu backend. With that in mind, we're going to start by providing some environment variables to tell the Sensu backend that it will use a certificate to authenticate to PostgreSQL.

{{% notice note %}}
**NOTE**: Under the hood, the Sensu backend uses the libpq library to make connections to PostgreSQL. This library [supports a number of environment variables](https://www.postgresql.org/docs/current/libpq-envars.html) that can be injected into the PostgreSQL data source name (DSN) and are loaded at runtime using the systems environment variable file.
{{% /notice %}}

Let's start by providing the environment variables to ensure that Sensu will use a certificate to authenticate to Postgres:

{{< language-toggle >}}

{{< code "Redhat/Rocky/Alma" >}}

echo 'PGUSER=sensu
PGSSLMODE="verify-full"
PGSSLCERT="/etc/sensu/tls/sensu.pem"
PGSSLKEY="/etc/sensu/tls/sensu-key.pem"
PGSSLROOTCERT="/etc/sensu/tls/ca.pem"' | sudo tee /etc/sysconfig/sensu-backend

{{< /code >}}

{{< code "Ubuntu/Debian" >}}

echo 'PGUSER=sensu
PGSSLMODE="verify-full"
PGSSLCERT="/etc/sensu/tls/sensu.pem"
PGSSLKEY="/etc/sensu/tls/sensu-key.pem"
PGSSLROOTCERT="/etc/sensu/tls/ca.pem"' | sudo tee /etc/default/sensu-backend

{{< /code >}}

{{< /language-toggle >}}

We won't restart our backend to load those environment variables just yet. There are still a few steps left to ensure that we don't inadvertently take down our backend

Our next step is to ensure that we adjust our Sensu datastore connection.

On a system running `sensuctl`, run the following:

{{< code shell >}}

echo 'type: PostgresConfig
api_version: store/v1
metadata:
  name: sensu_postgres
spec:
  dsn: "postgresql://postgres.example.com:5432/sensu_events"
  pool_size: 20
  strict: false' | sudo tee postgresconfig.yml

sensuctl create -f postgresconfig.yml

{{< /code >}}

{{% notice note %}}
**NOTE**: By setting `strict: false` in our configuration, we ensure that if we make any mistakes during this process, the Sensu backend will remain active and able to process events.
{{% /notice %}}

To validate the your connection to your PostgreSQL instance is healthy, run the following command:

{{< code shell >}}

 curl http://localhost:8080/health

{{< /code >}}

You should see output that looks like:

{{< code json >}}

{
  "Alarms": null,
  "ClusterHealth": [
    {
      "MemberID": 13217573501179607000,
      "MemberIDHex": "b76e4111d26d35e2",
      "Name": "sensu.example.com",
      "Err": "",
      "Healthy": true
    }
  ],
  "Header": {
    "cluster_id": 11959078708079102000,
    "member_id": 6370351775894128000,
    "raft_term": 4242
  },
  "PostgresHealth": [
    {
      "Name": "sensu_postgres",
      "Active": true,
      "Healthy": true
    }
  ]
}

{{< /code >}}

Both the "Active" and "Healthy" keys should return `true`.

Now that we've confirmed that the Sensu backend can connect to our PostgreSQL instance, let's move on to configuring PostgreSQL to use TLS.

### Configuring PostgreSQL to use TLS

The first thing we need to do to prepare our PostgreSQL instance is to move our certs off of our Sensu backend.

{{< code shell >}}

# This assumes you're still in the /etc/sensu/tls directory

scp postgres.example.com* postgres.example.com:/home/user

scp ca.pem postgres.example.com:/home/user

{{< /code >}}

From our PostgreSQL instance, we'll start by creating a new directory in `/etc/postgresql/14/main`:

{{< code shell >}}

sudo mkdir /etc/postgresql/14/main/tls

cd /etc/postgresql/14/main/tls

cp /home/user/postgres.example.com* .

cp /home/user/ca.pem .

{{< /code >}}

Once your certs and key files are present, we'll move on to making changes in PostgreSQL. This will entail editing `postgresql.conf` to turn on TLS, as well as configuring host based authentication to only accept certificates when accessing the `sensu_events` database.

We'll start by modifying the file `/etc/postgresql/14/main/postgresql.conf`. Using your system's code editor, ensure that your PostgreSQL config file contains the following lines:

{{< code shell >}}

# - SSL -

ssl = on
ssl_ca_file = '/etc/postgresql/14/main/tls/ca.pem'
ssl_cert_file = '/etc/postgresql/14/main/tls/postgres.example.com.pem'
ssl_key_file = '/etc/postgresql/14/main/tls/postgres.example.com-key.pem'

{{< /code >}}

After you've saved the `postgresql.conf` file, we'll edit the `/etc/postgresql/14/main/pg_hba.conf`. Your file should contain the following lines:

{{< code shell >}}

# do not let the "postgres" superuser login via a certificate
hostssl all             postgres        ::/0                    reject
hostssl all             postgres        0.0.0.0/0               reject

# Rules for Sensu DB connection
hostssl sensu_events    sensu           0.0.0.0/0               cert

{{< /code >}}

Once you've made those changes, restart PostgreSQL:

{{< code shell >}}

sudo systemctl restart postgresql.service

{{< /code >}}

Let's finalize our Sensu backend configuration.

### Completing the Sensu backend configuration for PostgreSQL

Now that we've configured PostgreSQL to use TLS and that our Sensu user has to authenticate with a certificate, let's validate that our Sensu backend is still able to reach PostgreSQL and authenticate. We'll run the same command we ran earlier:

{{< code shell >}}

 curl http://localhost:8080/health

{{< /code >}}

Our output should still look something like:

{{< code json >}}

{
  "Alarms": null,
  "ClusterHealth": [
    {
      "MemberID": 13217573501179607000,
      "MemberIDHex": "b76e4111d26d35e2",
      "Name": "sensu.example.com",
      "Err": "",
      "Healthy": true
    }
  ],
  "Header": {
    "cluster_id": 11959078708079102000,
    "member_id": 6370351775894128000,
    "raft_term": 4242
  },
  "PostgresHealth": [
    {
      "Name": "sensu_postgres",
      "Active": true,
      "Healthy": true
    }
  ]
}

{{< /code >}}

If you don't see `"Active": true` and `"Healthy": true` in the output, you'll need to troubleshoot the connection to PostgreSQL ***before*** you complete this final step.

{{% notice note %}}
**NOTE**: This last step is completely optional. We will set `strict: true` in our config. This will force Sensu to always use PostgreSQL as the event store and will not fall back to Etcd in the event that PostgreSQL should become unavailable. If you would rather have your backend use Etcd as a fallback, you can stop here. Note that using Etcd as a fallback (especially in environments with a large amount of events) may cause Etcd to trigger disk quota alarms and become unavailble.
{{% /notice %}}

If the values both show `true` in the JSON output, you may proceed to the next step.

It's now time to update our backed PostgreSQL configuration so that we force the backend to always use PostgreSQL as the event store. Let's run the command below:

{{< code shell >}}

echo 'type: PostgresConfig
api_version: store/v1
metadata:
  name: sensu_postgres
spec:
  dsn: "postgresql://postgres.example.com:5432/sensu_events"
  pool_size: 20
  strict: true' | sudo tee postgresconfig.yml

sensuctl create -f postgresconfig.yml

{{< /code >}}

Your backend will now use PostgreSQL exclusively for storing events. If you'd like to validate that your configuration is updated, you can run the following:

{{< code shell >}}

sensuctl dump store/v1.PostgresConfig --format yaml

{{< /code >}}

### Wrapping up

In this guide, we covered how to configure Sensu to use certificate authentication when communicating with PostgreSQL. We hope you've found it useful. If you have any feedback you'd like to provide, or changes you think should be made, feel free to click on the "Edit this page" link on the right side of the screen.

[1]: ../secure-sensu
[2]: https://github.com/cloudflare/cfssl
[3]: ../generate-certificates
[4]: https://www.postgresql.org/docs/current/libpq-envars.html
