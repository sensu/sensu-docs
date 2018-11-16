---
title: "Built-in Mutators"
product: "Sensu Enterprise"
version: "3.3"
weight: 9
menu: "sensu-enterprise-3.3"
---
**ENTERPRISE: Built-in mutators are available for [Sensu Enterprise][0]
users only.**

Sensu Core ships with a set of built-in [mutators][1] for transforming
event data into JSON, Ruby Hash, or extracting check output. Sensu Enterprise
comes with additional mutators, enabling third-party integrations, and providing
event handler authors with a set of supported tools with well defined
specifications.

## Enterprise mutators

### The output_format mutator {#output-format}

Sensu Enterprise simplifies the process of gaining insightful metrics from
complex distributed systems. The `output_format` enterprise mutator makes it
possible to mutate collected metrics in various formats from disparate data
sources, into a [proprietary intermediate format][2] that has been optimized for
portability.

The `output_format` enterprise mutator extracts metrics from check result
output. Users can specify an output format per check, enabling the use of
various check plugins (Nagios plugins, etc.) and data sources. The
`output_format` mutator currently supports several popular specifications:

- [InfluxDB line protocol][8]
- [Graphite Plaintext][3]
- [Nagios PerfData][4]
- [OpenTSDB][5]
- [Wavefront Data Format][9]
- [Metrics 2.0 as a wire format][6]
- [Wizardvan JSON][7]

#### Example output_format filter configuration

The following is an example of how to configure an output format for a metric
collection check, one that is making use of a Nagios plugin. This example check
not only monitors NTP but also collects several metrics. Note the multiple event
handlers: one for notifications (`pagerduty`), another for metric storage
(`graphite`).

{{< highlight json >}}
{
  "checks": {
    "ntp": {
      "command": "/usr/lib/nagios/plugins/check_ntp -H time.nrc.ca",
      "subscribers": [
        "production"
      ],
      "interval": 20,
      "output_format": "nagios_perfdata",
      "handlers": [
        "pagerduty",
        "graphite"
      ]
    }
  }
}
{{< /highlight >}}

#### Definition attributes {#sensu-metric-format}

output_format  | 
---------------|------
description    | A metric output format (to be parsed).
required       | true
type           | String
allowed values | `influxdb_line`, `graphite_plaintext`, `nagios_perfdata`, `opentsdb`, `wavefront`, `metrics20_wire`, `wizardvan_json`
default        | `graphite_plaintext`
example        | {{< highlight shell >}}"output_format": "graphite_plaintext"{{< /highlight >}}

[0]:  /sensu-enterprise
[1]:  /sensu-core/1.2/reference/mutators
[2]:  #sensu-metric-format
[3]:  http://graphite.readthedocs.org/en/latest/feeding-carbon.html#the-plaintext-protocol
[4]:  http://nagios.sourceforge.net/docs/3_0/perfdata.html
[5]:  http://opentsdb.net/docs/build/html/user_guide/writing.html
[6]:  http://metrics20.org/spec/
[7]:  https://github.com/opinionlab/sensu-metrics-relay#json-metric-format
[8]:  https://docs.influxdata.com/influxdb/v1.1/write_protocols/line_protocol_tutorial/
[9]:  https://community.wavefront.com/docs/DOC-1031
