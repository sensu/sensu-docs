---
title: Installation
weight: 12
product: "Uchiwa"
version: "1.0"
menu:
  uchiwa-1.0:
    parent: getting-started
---

## Manual Installation
See the [download page](https://uchiwa.io/#download) to download the packages.

## Debian/Ubuntu

Install the GPG public key:
{{< code shell >}}
wget -q https://sensu.global.ssl.fastly.net/apt/pubkey.gpg -O- | sudo apt-key add -{{< /code >}}

Determine the codename of the Ubuntu/Debian release on your system:
{{< code shell >}}
. /etc/os-release && echo $VERSION
"14.04.4 LTS, Trusty Tahr" # codename for this system is "trusty"{{< /code >}}

Create an APT configuration file at `/etc/apt/sources.list.d/sensu.list`:
{{< code shell >}}
export CODENAME=your_release_codename_here # e.g. "trusty"
echo "deb     https://sensu.global.ssl.fastly.net/apt $CODENAME main" | sudo tee /etc/apt/sources.list.d/sensu.list{{< /code >}}

Update APT:
{{< code shell >}}
sudo apt-get update{{< /code >}}

Install Uchiwa:
{{< code shell >}}
sudo apt-get install uchiwa{{< /code >}}

## RHEL/CentOS

Create the YUM repository configuration file for the Sensu Core repository at `/etc/yum.repos.d/sensu.repo`:
{{< code shell >}}
echo '[sensu]
name=sensu
baseurl=https://sensu.global.ssl.fastly.net/yum/$releasever/$basearch/
gpgcheck=0
enabled=1' | sudo tee /etc/yum.repos.d/sensu.repo{{< /code >}}

Install Sensu:
{{< code shell >}}
sudo yum install sensu{{< /code >}}

## Using Configuration Management

Chef: [uchiwa-chef](https://github.com/sensu/uchiwa-chef)  
Puppet: [puppet-uchiwa](https://github.com/Yelp/puppet-uchiwa)  
Ansible: [ansible-uchiwa](https://github.com/queeno/ansible-uchiwa)  
SaltStack: [sensu-formula](https://github.com/saltstack-formulas/sensu-formula)

## Using Docker

Uchiwa comes pre-packaged in a [Docker container](https://hub.docker.com/r/uchiwa/uchiwa/) for easy deployment.

Download the official Uchiwa Docker image:
{{< code shell >}}
docker pull uchiwa/uchiwa{{< /code >}}

Create a folder that will contain the configuration files:
{{< code shell >}}
mkdir ~/uchiwa-config{{< /code >}}

Create and adjust the main configuration file:
{{< code shell >}}
vi ~/uchiwa-config/config.json{{< /code >}}

Start the Docker container:
{{< code shell >}}
docker run -d -p 3000:3000 -v ~/uchiwa-config:/config uchiwa/uchiwa{{< /code >}}

Browse Uchiwa:
{{< code shell >}}
http://localhost:3000{{< /code >}}

## From Source {#from-source}

{{< note title="Note" >}}
This documentation provides instructions for advanced users who want to build
their own packages. Otherwise, we highly recommend to use the system packages
in order to get stable releases and an easier installation experience.
{{< /note >}}

### Prerequisites
* [Go >= 1.6](https://golang.org/doc/install)
* [NodeJS](https://nodejs.org/en/download/package-manager/)

### Backend

Download the source code:
{{< code shell >}}
go get -d github.com/sensu/uchiwa && cd $GOPATH/src/github.com/sensu/uchiwa{{< /code >}}

Build the Uchiwa binary:
{{< code shell >}}
go build -o build/uchiwa . # Build for your current system
GOOS=linux GOARCH=amd64 go build -o build/uchiwa . # Cross Compilation, see Go documentation{{< /code >}}

### Front-end Assets
Install the front-end assets:
{{< code shell >}}
npm install --production # Standard user
npm install --production --unsafe-perm # Root user{{< /code >}}

### Building package in docker

To get uchiwa packages (both rpm and deb), please follow the below steps:
{{< code shell >}}
# clone and go to the uchiwa project root
$ cd uchiwa
# Build docker images for building packages:
$ docker build ./build/ -t sensu_builder
# ensure you have tag on the commit from which packages should be built, please check build/travis.sh for details
# run build
$ docker run --rm -it \
  -v $(pwd):/go/src/github.com/sensu/uchiwa \
  -v /tmp/sensu_packages:/tmp/assets/pkg/s3 \
  -w /go/src/github.com/sensu/uchiwa sensu_builder ./build/travis.sh
# get packages from /tmp/sensu_packages{{< /code >}}

{{< note title="Note" >}}
Please note, within docker we build statically linked executable (CGO_ENABLED=0)
{{< /note >}}

### Running Uchiwa Locally
Adjust your configuration:
{{< code shell >}}
cp config.json.example config.json{{< /code >}}

Start Uchiwa
{{< code shell >}}
./build/uchiwa{{< /code >}}

### Developping
See the [Contributing documentation][1].

[1]:  ../../contributing
