---
title: Contributing
weight: 50
product: "Uchiwa"
version: "1.0"
weight: 0
menu: "uchiwa-1.0"
layout: "product-versions"
---

## Installation

### Backend
[Follow these instructions][1]
for the Go backend.

### Frontend
*Optional*. If you wish to modify the frontend components, you'll need to follow
these additional instructions:

Clone the [uchiwa-web](https://github.com/sensu/uchiwa-web) repository:
{{< highlight shell >}}
git clone git@github.com:sensu/uchiwa-web.git && cd uchiwa-web{{< /highlight >}}

Install third-party libraries:
{{< highlight shell >}}
npm install # Standard user
npm install --unsafe-perm # Root user{{< /highlight >}}

Create a global link for uchiwa-web:
{{< highlight shell >}}
bower link{{< /highlight >}}

Move to your uchiwa repository directory:
{{< highlight shell >}}
cd $GOPATH/src/github.com/sensu/uchiwa{{< /highlight >}}

Uninstall the uchiwa-web bower component if previously installed:
{{< highlight shell >}}
bower uninstall uchiwa-web{{< /highlight >}}

Point the bower component uchiwa-web to the previously created link
{{< highlight shell >}}
bower link uchiwa-web{{< /highlight >}}

## Development

### Backend
Run the program:
{{< highlight shell >}}
go run uchiwa.go{{< /highlight >}}

**N.B.**: You'll need to relaunch this command if you modify the source code
to apply changes.

### Frontend
Generate **CSS** files from **Sass** templates:
{{< highlight shell >}}
grunt sass{{< /highlight >}}

## Testing

### Backend
Run the unit tests:
{{< highlight shell >}}
go test -v ./...{{< /highlight >}}

### Frontend
Run linting and unit tests:
{{< highlight shell >}}
grunt{{< /highlight >}}

[1]: ../getting-started/installation/#from-source
