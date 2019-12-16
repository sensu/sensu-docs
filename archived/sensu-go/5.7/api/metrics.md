---
title: "Metrics API"
description: "The metrics API provides HTTP access to internal Sensu metrics, including embedded etcd, memory usage, garbage collection, and gRPC metrics. Read on for the full reference."
version: "5.7"
product: "Sensu Go"
menu:
  sensu-go-5.7:
    parent: api
---

## The `/metrics` API endpoint

### `/metrics` (GET)

The `/metrics` API endpoint provides HTTP GET access to internal Sensu metrics in [Prometheus][1] format, including embedded etcd, memory usage, garbage collection, and gRPC metrics.

#### EXAMPLE {#metrics-get-example}

The following example demonstrates a request to the `/metrics` API, resulting in
plaintext output containing internal Sensu metrics.

{{< highlight text >}}
curl http://127.0.0.1:8080/metrics

HTTP/1.1 200 OK
# HELP etcd_debugging_mvcc_db_compaction_keys_total Total number of db keys compacted.
# TYPE etcd_debugging_mvcc_db_compaction_keys_total counter
etcd_debugging_mvcc_db_compaction_keys_total 2386
# HELP etcd_debugging_mvcc_db_compaction_pause_duration_milliseconds Bucketed histogram of db compaction pause duration.
# TYPE etcd_debugging_mvcc_db_compaction_pause_duration_milliseconds histogram
etcd_debugging_mvcc_db_compaction_pause_duration_milliseconds_bucket{le="1"} 0
etcd_debugging_mvcc_db_compaction_pause_duration_milliseconds_bucket{le="2"} 0
...
{{< /highlight >}}

#### API Specification {#metrics-get-specification}

/metrics (GET)  | 
---------------|------
description    | Returns internal Sensu metrics in Prometheus format, including embedded etcd, memory usage, garbage collection, and gRPC metrics.
example url    | http://hostname:8080/metrics
response type  | [Prometheus-formatted][1] plaintext
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight text >}}
# HELP etcd_debugging_mvcc_db_compaction_keys_total Total number of db keys compacted.
# TYPE etcd_debugging_mvcc_db_compaction_keys_total counter
etcd_debugging_mvcc_db_compaction_keys_total 2386
# HELP etcd_debugging_mvcc_db_compaction_pause_duration_milliseconds Bucketed histogram of db compaction pause duration.
# TYPE etcd_debugging_mvcc_db_compaction_pause_duration_milliseconds histogram
etcd_debugging_mvcc_db_compaction_pause_duration_milliseconds_bucket{le="1"} 0
etcd_debugging_mvcc_db_compaction_pause_duration_milliseconds_bucket{le="2"} 0
...
{{< /highlight >}}

[1]: https://prometheus.io/docs/concepts/data_model/
