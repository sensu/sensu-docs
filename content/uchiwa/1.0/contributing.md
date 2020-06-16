---
title: Contributing
weight: 50
product: "Uchiwa"
version: "1.0"
menu: "uchiwa-1.0"
layout: "single"
---

## Installation

### Backend
[Follow these instructions][1]
for the Go backend.

### Frontend
*Optional*. If you wish to modify the frontend components, you'll need to follow
these additional instructions:

Clone the [uchiwa-web](https://github.com/sensu/uchiwa-web) repository:
{{< code shell >}}
git clone git@github.com:sensu/uchiwa-web.git && cd uchiwa-web{{< /code >}}

Install third-party libraries:
{{< code shell >}}
npm install # Standard user
npm install --unsafe-perm # Root user{{< /code >}}

Create a global link for uchiwa-web:
{{< code shell >}}
bower link{{< /code >}}

Move to your uchiwa repository directory:
{{< code shell >}}
cd $GOPATH/src/github.com/sensu/uchiwa{{< /code >}}

Uninstall the uchiwa-web bower component if previously installed:
{{< code shell >}}
bower uninstall uchiwa-web{{< /code >}}

Point the bower component uchiwa-web to the previously created link
{{< code shell >}}
bower link uchiwa-web{{< /code >}}

## Development

### Backend
Run the program:
{{< code shell >}}
go run uchiwa.go{{< /code >}}

**N.B.**: You'll need to relaunch this command if you modify the source code
to apply changes.

### Frontend
Generate **CSS** files from **Sass** templates:
{{< code shell >}}
grunt sass{{< /code >}}

## Testing

### Backend
Run the unit tests:
{{< code shell >}}
go test -v ./...{{< /code >}}

### Frontend
Run linting and unit tests:
{{< code shell >}}
grunt{{< /code >}}

[1]: ../getting-started/installation/#from-source
