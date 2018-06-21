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
{{< highlight shell >}}
wget -q https://sensu.global.ssl.fastly.net/apt/pubkey.gpg -O- | sudo apt-key add -{{< /highlight >}}

Determine the codename of the Ubuntu/Debian release on your system:
{{< highlight shell >}}
. /etc/os-release && echo $VERSION
"14.04.4 LTS, Trusty Tahr" # codename for this system is "trusty"{{< /highlight >}}

Create an APT configuration file at `/etc/apt/sources.list.d/sensu.list`:
{{< highlight shell >}}
export CODENAME=your_release_codename_here # e.g. "trusty"
echo "deb     https://sensu.global.ssl.fastly.net/apt $CODENAME main" | sudo tee /etc/apt/sources.list.d/sensu.list{{< /highlight >}}

Update APT:
{{< highlight shell >}}
sudo apt-get update{{< /highlight >}}

Install Uchiwa:
{{< highlight shell >}}
sudo apt-get install uchiwa{{< /highlight >}}

## RHEL/CentOS

Create the YUM repository configuration file for the Sensu Core repository at `/etc/yum.repos.d/sensu.repo`:
{{< highlight shell >}}
echo '[sensu]
name=sensu
baseurl=https://sensu.global.ssl.fastly.net/yum/$releasever/$basearch/
gpgcheck=0
enabled=1' | sudo tee /etc/yum.repos.d/sensu.repo{{< /highlight >}}

Install Sensu:
{{< highlight shell >}}
sudo yum install sensu{{< /highlight >}}

## Using Configuration Management

Chef: [uchiwa-chef](https://github.com/sensu/uchiwa-chef)  
Puppet: [puppet-uchiwa](https://github.com/Yelp/puppet-uchiwa)  
Ansible: [ansible-uchiwa](https://github.com/queeno/ansible-uchiwa)  
SaltStack: [sensu-formula](https://github.com/saltstack-formulas/sensu-formula)

## Using Docker

Uchiwa comes pre-packaged in a [Docker container](https://hub.docker.com/r/uchiwa/uchiwa/) for easy deployment.

Download the official Uchiwa Docker image:
{{< highlight shell >}}
docker pull uchiwa/uchiwa{{< /highlight >}}

Create a folder that will contain the configuration files:
{{< highlight shell >}}
mkdir ~/uchiwa-config{{< /highlight >}}

Create and adjust the main configuration file:
{{< highlight shell >}}
vi ~/uchiwa-config/config.json{{< /highlight >}}

Start the Docker container:
{{< highlight shell >}}
docker run -d -p 3000:3000 -v ~/uchiwa-config:/config uchiwa/uchiwa{{< /highlight >}}

Browse Uchiwa:
{{< highlight shell >}}
http://localhost:3000{{< /highlight >}}

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
{{< highlight shell >}}
go get -d github.com/sensu/uchiwa && cd $GOPATH/src/github.com/sensu/uchiwa{{< /highlight >}}

Build the Uchiwa binary:
{{< highlight shell >}}
go build -o build/uchiwa . # Build for your current system
GOOS=linux GOARCH=amd64 go build -o build/uchiwa . # Cross Compilation, see Go documentation{{< /highlight >}}

### Front-end Assets
Install the front-end assets:
{{< highlight shell >}}
npm install --production # Standard user
npm install --production --unsafe-perm # Root user{{< /highlight >}}

### Building package in docker

To get uchiwa packages (both rpm and deb), please follow the below steps:
{{< highlight shell >}}
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
# get packages from /tmp/sensu_packages{{< /highlight >}}

{{< note title="Note" >}}
Please note, within docker we build statically linked executable (CGO_ENABLED=0)
{{< /note >}}

### Running Uchiwa Locally
Adjust your configuration:
{{< highlight shell >}}
cp config.json.example config.json{{< /highlight >}}

Start Uchiwa
{{< highlight shell >}}
./build/uchiwa{{< /highlight >}}

### Developping
See the [Contributing documentation][1].

[1]:  ../../contributing