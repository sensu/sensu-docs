---
title: "TimescaleDB"
product: "Sensu Enterprise"
version: "3.4"
weight: 22
menu:
  sensu-enterprise-3.4:
    parent: integrations
---
**ENTERPRISE: Built-in integrations are available for [Sensu Enterprise][1]
users only.**

- [Overview](#overview)
- [Configuration](#configuration)
  - [Examples](#examples)
  - [Integration Specification](#integration-specification)
    - [`timescaledb` attributes](#timescaledb-attributes)

## Overview

[TimescaleDB][2] is an open source time series database powered by PostgreSQL.
This integration allows Sensu Enterprise to send metrics directly to TimescaleDB using the [PostgreSQL protocol][4].

## Configuration

The TimescaleDB integration requires a TimescaleDB table with following columns and types.

| column | type | reference |
| --- | --- | --- |
| `time` | `timestamptz` | [Date/Time Types][6]
| `name` | `text` | [Character Types][7]
| `value` | `double precision` | [Numeric Types][8]
| `source` | `text` | [Character Types][7]
| `tags` | `jsonb` | [JSON Types][9]

For example, the following commands create a `sensu` database, a `metrics` table with the required table structure, and a `sensu` user with access privileges for the `metrics` table:

{{< highlight shell >}}
CREATE database sensu;

\c sensu

CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

CREATE TABLE metrics (
    time    TIMESTAMPTZ        NOT NULL,
    name    TEXT               NOT NULL,
    value   DOUBLE PRECISION   NULL,
    source  TEXT               NOT NULL,
    tags    JSONB
);

SELECT create_hypertable('metrics', 'time');

CREATE USER sensu WITH PASSWORD 'secret';
GRANT ALL PRIVILEGES ON TABLE metrics TO sensu;
{{< /highlight >}}

### Examples {#examples}

The following is an example global configuration for the Sensu Enterprise
TimescaleDB integration.

{{< highlight json >}}
{
  "timescaledb": {
    "host": "timescaledb.example.com",
    "port": 5432,
    "user": "sensu",
    "password": "secret",
    "database": "sensu",
    "table": "metrics",
    "tags": {
      "dc": "us-west-2"
    }
  }
}
{{< /highlight >}}

### Integration specification

#### `timescaledb` attributes

The following attributes are configured within the `{"timescaledb": {} }`
[configuration scope][3].

host         | 
-------------|------
description  | The TimescaleDB host address.
required     | false
type         | String
default      | `127.0.0.1`
example      | {{< highlight shell >}}"host": "timescaledb.example.com"{{< /highlight >}}

port         | 
-------------|------
description  | The TimescaleDB port.
required     | false
type         | Integer
default      | `5432`
example      | {{< highlight shell >}}"port": 5432{{< /highlight >}}

user         | 
-------------|------
description  | The TimescaleDB username. This user must have access privileges for the table specified in the `table` attribute.
required     | false
type         | String
default      | `postgres`
example      | {{< highlight shell >}}"user": "postgres"{{< /highlight >}}

password     | 
-------------|------
description  | The TimescaleDB user password.
required     | false
type         | String
default      | `nil`
example      | {{< highlight shell >}}"password": "secret"{{< /highlight >}}

database     | 
-------------|------
description  | The TimescaleDB database name.
required     | false
type         | String
default      | `sensu`
example      | {{< highlight shell >}}"database": "sensu"{{< /highlight >}}

table        | 
-------------|------
description  | The TimescaleDB table where Sensu will send metrics, configured with [required columns and types][10]. See the [TimescaleDB docs][5] for information about creating a table.
required     | false
type         | String
default      | `metrics`
example      | {{< highlight shell >}}"table": "metrics"{{< /highlight >}}

tags         | 
-------------|------
description  | Configurable custom tags (key/value pairs) to add to every TimescaleDB measurement.
required     | false
type         | Hash
default      | {{< highlight shell >}}{}{{< /highlight >}}
example      | {{< highlight shell >}}
"tags": {
  "dc": "us-central-1"
}
{{< /highlight >}}

[1]: /sensu-enterprise
[2]: https://www.timescale.com/
[3]: /sensu-core/latest/reference/configuration#configuration-scopes
[4]: https://www.postgresql.org/docs/current/static/protocol.html
[5]: https://docs.timescale.com
[6]: https://www.postgresql.org/docs/current/static/datatype-datetime.html
[7]: https://www.postgresql.org/docs/current/static/datatype-character.html
[8]: https://www.postgresql.org/docs/current/static/datatype-numeric.html
[9]: https://www.postgresql.org/docs/current/static/datatype-json.html
[10]: #configuration
