---
title: "Troubleshoot Sensu"
linkTitle: "Troubleshoot"
description: "Here’s how to troubleshoot Sensu, including how to look into errors, service logging, log levels. Sensu service logs produced by sensu-backend and sensu-agent are often the best source of truth when troubleshooting issues, so start there."
weight: 30
version: "6.4"
product: "Sensu Go"
platformContent: true
platforms: ["Linux", "Windows"]
menu:
  sensu-go-6.4:
    parent: maintain-sensu
---

## Service logging

Logs produced by Sensu services (sensu-backend and sensu-agent) are often the best place to start when troubleshooting a variety of issues.

### Log levels

Each log message is associated with a log level that indicates the relative severity of the event being logged:

| Log level          | Description |
|--------------------|--------------------------------------------------------------------------|
| panic              | Severe errors that cause the service to shut down in an unexpected state |
| fatal              | Fatal errors that cause the service to shut down (status 0)              |
| error              | Non-fatal service error messages                                         |
| warn               | Warning messages that indicate potential issues                          |
| info               | Information messages that represent service actions                      |
| debug              | Detailed service operation messages to help troubleshoot issues          |
| trace              | Confirmation messages about whether a rule authorized a request          |

You can configure these log levels by specifying the desired log level as the value of `log-level` in the service configuration file (`agent.yml` or `backend.yml`) or as an argument to the `--log-level` command line flag:

{{< code shell >}}
sensu-agent start --log-level debug
{{< /code >}}

You must restart the service after you change log levels via configuration files or command line arguments.
For help with restarting a service, see the [agent reference][5] or [backend reference][9].

#### Increment log level verbosity

To increment the log level verbosity at runtime for the backend, run:

{{< code shell >}}
kill -s SIGUSR1 $(pidof sensu-backend)
{{< /code >}}

To increment the log level verbosity at runtime for the agent, run:

{{< code shell >}}
kill -s SIGUSR1 $(pidof sensu-agent)
{{< /code >}}

When you increment the log at the trace level (the most verbose log level), the log will wrap around to the error level.

### Log file locations

{{< platformBlock "Linux" >}}

#### Linux

Sensu services print [structured log messages][7] to standard output.
To capture these log messages to disk or another logging facility, Sensu services use capabilities provided by the underlying operating system's service management.
For example, logs are sent to the journald when systemd is the service manager, whereas log messages are redirected to `/var/log/sensu` when running under sysv init schemes.
If you are running systemd as your service manager and would rather have logs written to `/var/log/sensu/`, see [forwarding logs from journald to syslog][11].

For journald targets, use these commands to follow the logs.
Replace the `<service>` variable with the name of the desired service (for example, `backend` or `agent`).

{{< language-toggle >}}

{{< code shell "RHEL/CentOS >= 7" >}}
journalctl --follow --unit sensu-<service>
{{< /code >}}

{{< code shell "Ubuntu >= 15.04" >}}
journalctl --follow --unit sensu-<service>
{{< /code >}}

{{< code shell "Debian >= 8" >}}
journalctl --follow --unit sensu-<service>
{{< /code >}}

{{< /language-toggle >}}

For log file targets, use these commands to follow the logs.
Replace the `<service>` variable with the name of the desired service (for example, `backend` or `agent`).

{{< language-toggle >}}

{{< code shell "RHEL/CentOS <= 6" >}}
tail --follow /var/log/sensu/sensu-<service>
{{< /code >}}

{{< code shell "Ubuntu <= 14.10" >}}
tail --follow /var/log/sensu/sensu-<service>
{{< /code >}}

{{< code shell "Debian <= 7" >}}
tail --follow /var/log/sensu/sensu-<service>
{{< /code >}}

{{< /language-toggle >}}

{{% notice note %}}
**NOTE**: Platform versions are listed for reference only and do not supersede the documented [supported platforms](../../../platforms).
{{% /notice %}}

##### Narrow your search to a specific timeframe

Use the `journald` keyword `since` to refine the basic `journalctl` commands and narrow your search by timeframe.

Retrieve all the logs for sensu-backend since yesterday:

{{< code shell >}}
journalctl -u sensu-backend --since yesterday | tee sensu-backend-$(date +%Y-%m-%d).log
{{< /code >}}

Retrieve all the logs for sensu-agent since a specific time:

{{< code shell >}}
journalctl -u sensu-agent --since 09:00 --until "1 hour ago" | tee sensu-agent-$(date +%Y-%m-%d).log
{{< /code >}}

Retrieve all the logs for sensu-backend for a specific date range:

{{< code shell >}}
journalctl -u sensu-backend --since "2015-01-10" --until "2015-01-11 03:00" | tee sensu-backend-$(date +%Y-%m-%d).log
{{< /code >}}

{{< platformBlockClose >}}

{{< platformBlock "Windows" >}}

##### Logging edge cases

If a Sensu service experiences a panic crash, the service may seem to start and stop without producing any output in journalctl.
This is due to a [bug in systemd][12].

In these cases, try using the `_COMM` variable instead of the `-u` flag to access additional log entries:

{{< code shell >}}
journalctl _COMM=sensu-backend.service --since yesterday
{{< /code >}}

#### Windows

The Sensu agent stores service logs to the location specified by the `log-file` configuration flag (default `%ALLUSERSPROFILE%\sensu\log\sensu-agent.log`, `C:\ProgramData\sensu\log\sensu-agent.log` on standard Windows installations).
For more information about managing the Sensu agent for Windows, see the [agent reference][1].
You can also view agent events using the Windows Event Viewer, under Windows Logs, as events with source SensuAgent.

If you're running a [binary-only distribution of the Sensu agent for Windows][2], you can follow the service log printed to standard output using this command:

{{< code text >}}
Get-Content -  Path "C:\scripts\test.txt" -Wait
{{< /code >}}

{{< platformBlockClose >}}

## Sensu backend startup errors

The following errors are expected when starting up a Sensu backend with the default configuration:

{{< code shell >}}
{"component":"etcd","level":"warning","msg":"simple token is not cryptographically signed","pkg":"auth","time":"2019-11-04T10:26:31-05:00"}
{"component":"etcd","level":"warning","msg":"set the initial cluster version to 3.5","pkg":"etcdserver/membership","time":"2019-11-04T10:26:31-05:00"}
{"component":"etcd","level":"warning","msg":"serving insecure client requests on 127.0.0.1:2379, this is strongly discouraged!","pkg":"embed","time":"2019-11-04T10:26:33-05:00"}
{{< /code >}}

The `serving insecure client requests` warning is an expected warning from the embedded etcd database.
[TLS configuration][3] is recommended but not required.
For more information, see [etcd security documentation][4].

## CommonName deprecation in Go 1.15

Sensu Go 6.4.0 upgrades the Go version from 1.13.15 to 1.16.5.
As of [Go 1.15][27], certificates must include their CommonName (CN) as a Subject Alternative Name (SAN) field.

The following logged error indicates that a certificate used to secure Sensu does not include the CN as a SAN field:

{{< code shell >}}
{"component":"agent","error":"x509: certificate relies on legacy Common Name field, use SANs or temporarily enable Common Name matching with GODEBUG=x509ignoreCN=0","level":"error","msg":"reconnection attempt failed","time":"2021-06-29T11:07:51+02:00"}
{{< /code >}}

To prevent connection errors after upgrading to Sensu Go 6.4.0, follow [Generate certificates][28] to make sure your certificates' SAN fields include their CNs.

## Permission issues

The Sensu user and group must own files and folders within `/var/cache/sensu/` and `/var/lib/sensu/`.
You will see a logged error like those listed here if there is a permission issue with either the sensu-backend or the sensu-agent:

{{< code shell >}}
{"component":"agent","error":"open /var/cache/sensu/sensu-agent/assets.db: permission denied","level":"fatal","msg":"error executing sensu-agent","time":"2019-02-21T22:01:04Z"}
{"component":"backend","level":"fatal","msg":"error starting etcd: mkdir /var/lib/sensu: permission denied","time":"2019-03-05T20:24:01Z"}
{{< /code >}}

Use a recursive `chown` to resolve permission issues with the sensu-backend:

{{< code shell >}}
sudo chown -R sensu:sensu /var/cache/sensu/sensu-backend
{{< /code >}}

or the sensu-agent:

{{< code shell >}}
sudo chown -R sensu:sensu /var/cache/sensu/sensu-agent
{{< /code >}}

## Handlers and event filters

Whether implementing new workflows or modifying existing workflows, you may need to troubleshoot various stages of the event pipeline.

### Create an agent API test event

In many cases, generating events using the [agent API][6] will save you time and effort over modifying existing check configurations.

Here's an example that uses cURL with the API of a local sensu-agent process to generate test-event check results:

{{< code shell >}}
curl -X POST \
-H 'Content-Type: application/json' \
-d '{
  "check": {
    "metadata": {
      "name": "test-event"
    },
    "status": 2,
    "output": "this is a test event targeting the email_ops handler",
    "handlers": [ "email_ops" ]
  }
}' \
http://127.0.0.1:3031/events
{{< /code >}}

### Use a debug handler

It may also be helpful to see the complete event object being passed to your workflows.
We recommend using a debug handler like this one to write an event to disk as JSON data:

{{< language-toggle >}}

{{< code yml >}}
---
type: Handler
api_version: core/v2
metadata:
  name: debug
spec:
  type: pipe
  command: cat > /var/log/sensu/debug-event.json
  timeout: 2
{{< /code >}}

{{< code json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "debug"
  },
  "spec": {
    "type": "pipe",
    "command": "cat > /var/log/sensu/debug-event.json",
    "timeout": 2
  }
}
{{< /code >}}

{{< /language-toggle >}}

With this handler definition installed in your Sensu backend, you can add the `debug` to the list of handlers in your test event:

{{< code shell >}}
curl -X POST \
-H 'Content-Type: application/json' \
-d '{
  "check": {
    "metadata": {
      "name": "test-event"
    },
    "status": 2,
    "output": "this is a test event targeting the email_ops handler",
    "handlers": [ "email_ops", "debug" ]
  }
}' \
http://127.0.0.1:3031/events
{{< /code >}}

The observability event data should be written to `/var/log/sensu/debug-event.json` for inspection.
The contents of this file will be overwritten by every event sent to the `debug` handler.

{{% notice note %}}
**NOTE**: When multiple Sensu backends are configured in a cluster, event processing is distributed across all members.
You may need to check the filesystem of each Sensu backend to locate the debug output for your test event.
{{% /notice %}}

### Manually execute a handler

If you are not receiving events via a handler even though a check is generating events as expected, follow these steps to manually execute the handler and confirm whether the handler is working properly.

1. List all events:
{{< code shell >}}
sensuctl event list
{{< /code >}}

   Choose an event from the list to use for troubleshooting and note the event's check and entity names.

2. Navigate to the `/var/cache/sensu/sensu-backend/` directory:
{{< code shell >}}
cd /var/cache/sensu/sensu-backend/
{{< /code >}}

3. Run `ls` to list the contents of the `/var/cache/sensu/sensu-backend/` directory.
In the list, identify the handler's dynamic runtime asset SHA.

   {{% notice note %}}
**NOTE**: If the list includes more than one SHA, run `sensuctl asset list`.
In the response, the Hash column contains the first seven characters for each asset build's SHA.
Note the hash for your build of the handler asset and compare it with the SHAs listed in the `/var/cache/sensu/sensu-backend/` directory to find the correct handler asset SHA.
{{% /notice %}}

4. Navigate to the `bin` directory for the handler asset SHA.
Before you run the command below, replace `<handler_asset_sha>` with the SHA you identified in the previous step.
{{< code shell >}}
cd <handler_asset_sha>/bin
{{< /code >}}

5. Run the command to manually execute the handler.
Before you run the command below, replace the following text:
   - `<entity_name>`: Replace with the entity name for the event you are using to troubleshoot.
   - `<check_name>`: Replace with the check name for the event you are using to troubleshoot.
   - `<handler_command>`: Replace with the `command` value for the handler you are troubleshooting.

   {{< code shell >}}
sensuctl event info <entity_name> <check_name> --format json | ./<handler_command>
{{< /code >}}

If your handler is working properly, you will receive an alert for the event via the handler.
The response for your manual execution command will also include a message to confirm notification was sent.
In this case, your Sensu pipeline is not causing the problem with missing events.

If you do not receive an alert for the event, the handler is not working properly.
In this case, the manual execution response will include the message `Error executing <handler_asset_name>:` followed by a description of the specific error to help you correct the problem.

## Dynamic runtime assets

Use the information in this section to troubleshoot error messages related to dynamic runtime assets.

### Incorrect asset filter

Dynamic runtime asset filters allow you to scope an asset to a particular operating system or architecture.
You can see an example in the [asset reference][10].
An improperly applied asset filter can prevent the asset from being downloaded by the desired entity and result in error messages both on the agent and the backend illustrating that the command was not found:

**Agent log entry**

{{< code json >}}
{
  "asset": "check-disk-space",
  "component": "asset-manager",
  "entity": "sensu-centos",
  "filters": [
    "true == false"
  ],
  "level": "debug",
  "msg": "entity not filtered, not installing asset",
  "time": "2020-09-12T18:28:05Z"
}
{{< /code >}}

**Backend event**

{{< language-toggle >}}

{{< code yml >}}
---
timestamp: 1568148292
check:
  command: check-disk-space
  handlers: []
  high_flap_threshold: 0
  interval: 10
  low_flap_threshold: 0
  publish: true
  runtime_assets:
  - sensu-plugins-disk-checks
  subscriptions:
  - caching_servers
  proxy_entity_name: ''
  check_hooks:
  stdin: false
  subdue:
  ttl: 0
  timeout: 0
  round_robin: false
  duration: 0.001795508
  executed: 1568148292
  history:
  - status: 127
    executed: 1568148092
  issued: 1568148292
  output: 'sh: check-disk-space: command not found'
  state: failing
  status: 127
  total_state_change: 0
  last_ok: 0
  occurrences: 645
  occurrences_watermark: 645
  output_metric_format: ''
  output_metric_handlers:
  output_metric_tags:
  env_vars:
  metadata:
    name: failing-disk-check
    namespace: default
metadata:
  namespace: default
{{< /code >}}

{{< code json >}}
{
  "timestamp": 1568148292,
  "check": {
    "command": "check-disk-space",
    "handlers": [],
    "high_flap_threshold": 0,
    "interval": 10,
    "low_flap_threshold": 0,
    "publish": true,
    "runtime_assets": [
      "sensu-plugins-disk-checks"
    ],
    "subscriptions": [
      "caching_servers"
    ],
    "proxy_entity_name": "",
    "check_hooks": null,
    "stdin": false,
    "subdue": null,
    "ttl": 0,
    "timeout": 0,
    "round_robin": false,
    "duration": 0.001795508,
    "executed": 1568148292,
    "history": [
      {
        "status": 127,
        "executed": 1568148092
      }
    ],
    "issued": 1568148292,
    "output": "sh: check-disk-space: command not found\n",
    "state": "failing",
    "status": 127,
    "total_state_change": 0,
    "last_ok": 0,
    "occurrences": 645,
    "occurrences_watermark": 645,
    "output_metric_format": "",
    "output_metric_handlers": null,
    "output_metric_tags": null,
    "env_vars": null,
    "metadata": {
      "name": "failing-disk-check",
      "namespace": "default"
    }
  },
  "metadata": {
    "namespace": "default"
  }
}
{{< /code >}}

{{< /language-toggle >}}

If you see a message like this, review your asset definition &mdash; it means that the entity wasn't able to download the required asset due to asset filter restrictions.
To review the filters for an asset, use the sensuctl `asset info` command with a `--format` flag:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl asset info sensu-plugins-disk-checks --format yaml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl asset info sensu-plugins-disk-checks --format wrapped-json
{{< /code >}}

{{< /language-toggle >}}

#### Conflating operating systems with families

A common asset filter issue is conflating operating systems with the family they're a part of.
For example, although Ubuntu is part of the Debian family of Linux distributions, Ubuntu is not the same as Debian.
A practical example might be:

{{< language-toggle >}}

{{< code yml >}}
filters:
- entity.system.platform == 'debian'
- entity.system.arch == 'amd64'
{{< /code >}}

{{< code json >}}
{
  "filters": [
    "entity.system.platform == 'debian'",
    "entity.system.arch == 'amd64'"
  ]
}
{{< /code >}}

{{< /language-toggle >}}

This would not allow an Ubuntu system to run the asset.

Instead, the asset filter should look like this:

{{< language-toggle >}}

{{< code yml >}}
filters:
- entity.system.platform_family == 'debian'
- entity.system.arch == 'amd64'
{{< /code >}}

{{< code json >}}
{
  "filters": [
    "entity.system.platform_family == 'debian'",
    "entity.system.arch == 'amd64'"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

or

{{< language-toggle >}}

{{< code yml >}}
filters:
- entity.system.platform == 'ubuntu'
- entity.system.arch == 'amd64'
{{< /code >}}

{{< code json >}}
{
  "filters": [
    "entity.system.platform == 'ubuntu'",
    "entity.system.arch == 'amd64'"
  ]
}
{{< /code >}}

{{< /language-toggle >}}

This would allow the asset to be downloaded onto the target entity.

#### Running the agent on an unsupported Linux platform

If you run the Sensu agent on an unsupported Linux platform, the agent might fail to correctly identify your version of Linux and could download the wrong version of an asset.

This issue affects Linux distributions that do not include the `lsb_release` package in their default installations.
In this case, `gopsutil` may try to open `/etc/lsb_release` or try to run `/usr/bin/lsb_release` to find system information, including Linux version.
Since the `lsb_release` package is not installed, the agent will not be able to discover the Linux version as expected.

To resolve this problem, install the [`lsb_release` package][8] for your Linux distribution.

### Checksum mismatch

When a downloaded dynamic runtime asset checksum does not match the checksum specified in the asset definition, the agent logs a message similar to this example:

{{< code json >}}
{
  "asset": "check-disk-space",
  "component": "asset-manager",
  "entity": "sensu-centos",
  "filters": [
    "true == false"
  ],
  "level": "debug",
  "msg": "error getting assets for check: could not validate downloaded asset $ASSET_NAME (X.X MB): sha512 of downloaded asset (6b73p32XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX) does not match specified sha512 in asset definition (e6b7c8eXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX)",
  "time": "2019-09-12T18:28:05Z"
}
{{< /code >}}

To correct this issue, first confirm that the URL in the asset definition is valid.
Manually download the asset with a cURL or wget command and make sure that the downloaded file is a valid `tar.gz` file with the contents you expect.

If the downloaded `tar.gz` file contents are correct, use the [`sha512sum` command][21] to calculate the asset checksum and manually confirm that the checksum in the downloaded asset definition is correct.

If the checksum in the downloaded asset definition is correct, confirm that there is enough space available in `/tmp` to download the asset.
On Linux systems, the Sensu agent downloads assets into `/tmp`.
The log error message specifies the size of the asset artifact in parentheses after the asset name.
If space in `/tmp` is insufficient, asset downloads will be truncated and the checksum will not be validated.

## Etcd clusters

Some issues require you to investigate the state of the etcd cluster or data stored within etcd.
In these cases, we suggest using the `etcdctl` tool to query and manage the etcd database.

Sensu's supported packages do not include the `etcdctl` executable, so you must get it from a compatible etcd release.

### Configure etcdctl environment variables

To use etcdctl to investigate etcd cluster and data storage issues, first run these commands to configure etcdctl environment variables:

{{< code shell >}}
export ETCDCTL_API=3
export ETCDCTL_CACERT=/etc/sensu/ca.pem
export ETCDCTL_ENDPOINTS="https://backend01:2379,https://backend02:2379,https://backend03:2379"
{{< /code >}}

If your etcd uses client certificate authentication, run these commands too:

{{< code shell >}}
export ETCDCTL_CERT=/etc/sensu/cert.pem
export ETCDCTL_KEY=/etc/sensu/key.pem
{{< /code >}}

### View cluster status and alarms

Use the commands listed here to retrieve etcd cluster status and list and clear alarms.

To retrieve etcd cluster status:

{{< code shell >}}
etcdctl endpoint status
{{< /code >}}

To retrieve a list of etcd alarms:

{{< code shell >}}
etcdctl alarm list
{{< /code >}}

To clear etcd alarms:

{{< code shell >}}
etcdctl alarm dearm
{{< /code >}}

### Restore a cluster with an oversized database 

The etcd default maximum database size is 2 GB.
If you suspect your etcd database exceeds the maximum size, run this command to confirm cluster size:

{{< code shell >}}
etcdctl endpoint status
{{< /code >}}

The response will list the current cluster status and database size:

{{< code shell >}}
https://backend01:2379, 88db026f7feb72b4, 3.5.0, 2.1GB, false, 144, 18619245
https://backend02:2379, e98ad7a888d16bd6, 3.5.0, 2.1GB, true, 144, 18619245
https://backend03:2379, bc4e39432cbb36d, 3.5.0, 2.1GB, false, 144, 18619245
{{< /code >}}

To restore an etcd cluster with a database size that exceeds 2 GB:

1. Get the current revision number:
{{< code shell >}}
etcdctl endpoint status --write-out="json" | egrep -o '"revision":[0-9]*' | egrep -o '[0-9].*'
{{< /code >}}

2. Compact to revision and substitute the current revision for `$rev`:
{{< code shell >}}
etcdctl compact $rev
{{< /code >}}

3. Defragment to free up space:
{{< code shell >}}
etcdctl defrag
{{< /code >}}

4. Confirm that the cluster is restored:
{{< code shell >}}
etcdctl endpoint status
{{< /code >}}

   The response should list the current cluster status and database size:
{{< code shell >}}
https://backend01:2379, 88db026f7feb72b4, 3.5.0, 1.0 MB, false, 144, 18619245
https://backend02:2379, e98ad7a888d16bd6, 3.5.0, 1.0 MB, true, 144, 18619245
https://backend03:2379, bc4e39432cbb36d, 3.5.0, 1.0 MB, false, 144, 18619245
{{< /code >}}

### Remove and redeploy a cluster

{{% notice protip %}}
**PRO TIP**: Use [etcd snapshots](https://etcd.io/docs/latest/op-guide/recovery/) to keep a backup so that you can restore your Sensu resources if you have to redeploy your cluster.
For extra reassurance, take regular etcd snapshots and make regular backups with [sensuctl dump](../../../sensuctl/back-up-recover/) in addition to etcd's running snapshots.

If you wait until cluster nodes are failing, it may not be possible to make a backup.
For example, in a three-node cluster, if one node fails, you will still be able to make a backup.
If two nodes fail, the whole cluster will be down and you will not be able to create a snapshot or run sensuctl dump.
{{% /notice %}}

You may need to completely remove a cluster and redeploy it in cases such as:

- Failure to reach consensus after losing more than `(N-1)/2` cluster members
- Etcd configuration issues
- Etcd corruption, perhaps from disk filling
- Unrecoverable hardware failure

To remove and redeploy a cluster:

1. Open a terminal window for each cluster member.

2. Stop each cluster member backend:
{{< code shell >}}
systemctl stop sensu-backend
{{< /code >}}

3. Confirm that each backend stopped:
{{< code shell >}}
systemctl status sensu-backend
{{< /code >}}

    For each backend, the response should begin with the following lines:
    {{< code shell >}}
● sensu-backend.service - The Sensu Backend service.
Loaded: loaded (/usr/lib/systemd/system/sensu-backend.service; disabled; vendor preset: disabled)
Active: inactive (dead)
{{< /code >}}

4. Delete the etcd directories for each cluster member:
{{< code shell >}}
rm -rf /var/lib/sensu/sensu-backend/etcd/
{{< /code >}}

5. Follow the [Sensu backend configuration][23] instructions to reconfigure a new cluster.

6. [Initialize][25] a backend to specify admin credentials:
{{< code shell >}}
sensu-backend init --interactive
{{< /code >}}
    
    When you receive prompts for your username and password, replace `<YOUR_USERNAME>` and `<YOUR_PASSWORD>` with the administrator username and password you want to use for the cluster members:
{{< code shell >}}
Admin Username: <YOUR_USERNAME>
Admin Password: <YOUR_PASSWORD>
{{< /code >}}

7. Follow the [etcd restore process][26] or use [sensuctl create][24] to restore your cluster from a snapshot or backup.

## Datastore performance

In a default deployment, Sensu uses [etcd datastore][17] for both configuration and state.
As the number of checks and entities in your Sensu installation increases, so does the volume of read and write requests to etcd database.

One trade-off in etcd's design is its sensitivity to disk and CPU latency.
When certain latency tolerances are regularly exceeded, failures will cascade.
Sensu will attempt to recover from these conditions when it can, but this may not be successful.

To maximize Sensu Go performance, we recommend that you:
 * Follow our [recommended backend hardware configuration][19].
 * Implement [documented etcd system tuning practices][14].
 * [Benchmark your etcd storage volume][15] to establish baseline IOPS for your system.
 * [Scale event storage using PostgreSQL][16] with [round robin scheduling enabled][20] to reduce the overall volume of etcd transactions.

 As your Sensu deployments grow, preventing issues associated with poor datastore performance relies on ongoing collection and review of [Sensu time-series performance metrics][18].

### Symptoms of poor performance

At the Sensu backend's default "warn" log level, you may see messages like these from your backend:

{{< code json >}}
{"component":"etcd","level":"warning","msg":"read-only range request \"key:\\\"/sensu.io/handlers/default/keepalive\\\" limit:1 \" with result \"range_response_count:0 size:6\" took too long (169.767546ms) to execute","pkg":"etcdserver","time":"..."}
{{< /code >}}

The above message indicates that a database query ("read-only range request") exceeded a 100-millisecond threshold hard-coded into etcd.
Messages like these are helpful because they can alert you to a trend, but these occasional warnings don't necessarily indicate a problem.
For example, you may see this message if you provision attached storage but do not mount it to the etcd data directory.

However, a trend of increasingly long-running database transactions will eventually lead to decreased reliability.
You may experience symptoms of these conditions as inconsistent check execution behavior or configuration updates that are not applied as expected.

As the [etcd tuning documentation][14] states:

> An etcd cluster is very sensitive to disk latencies. Since etcd must persist proposals to its log, disk activity from other processes may cause long fsync latencies. [...] etcd may miss heartbeats, causing request timeouts and temporary leader loss.

When Sensu's etcd component doesn't recieve sufficient CPU cycles or its file system can't sustain a sufficient number of IOPS, transactions will begin to timeout, leading to cascading failures.

A message like this indicates that syncing the etcd database to disk exceeded another threshold:

{{< code json >}}
{"component":"etcd","level":"warning","msg":"sync duration of 1.031759056s, expected less than 1s","pkg":"wal","time":"..."}
{{< /code >}}

These subsequent "retrying of unary invoker failed" messages indicate failing requests to etcd:

{{< code json >}}
{"level":"warn","ts":"...","caller":"clientv3/retry_interceptor.go:62","msg":"retrying of unary invoker failed","target":"endpoint://client-6f6bfc7e-cf31-4498-a564-78d6b7b3a44e/localhost:2379","attempt":0,"error":"rpc error: code = Canceled desc = context canceled"}
{{< /code >}}

On busy systems you may also see output like "message repeated 5 times" indicating that failing requests were retried multiple times.

In many cases, the backend service detects and attempts to recover from errors like these, so you may see a message like this:

{{< code json >}}
{"component":"backend","error":"error from keepalived: internal error: etcdserver: request timed out","level":"error","msg":"backend stopped working and is restarting","time":"..."}
{{< /code >}}

This may result in a crash loop that is difficult to recover from.
You may observe that the Sensu backend process continues running but is not listening for connections on the agent websocket, API, or web UI ports.
The backend will stop listening on those ports when the etcd database is unavailable.


[1]: ../../../observability-pipeline/observe-schedule/agent#operation
[2]: ../../../platforms/#windows
[3]: ../../deploy-sensu/secure-sensu/#sensu-agent-mtls-authentication
[4]: https://etcd.io/docs/latest/op-guide/security/
[5]: ../../../observability-pipeline/observe-schedule/agent/#restart-the-service
[6]: ../../../observability-pipeline/observe-schedule/agent#events-post
[7]: https://dzone.com/articles/what-is-structured-logging
[8]: https://pkgs.org/download/lsb
[9]: ../../../observability-pipeline/observe-schedule/backend/#restart-the-service
[10]: ../../../plugins/assets#asset-example-multiple-builds
[11]: ../../monitor-sensu/log-sensu-systemd/
[12]: https://github.com/systemd/systemd/issues/2913
[13]: https://github.com/etcd-io/etcd/releases
[14]: https://etcd.io/docs/latest/tuning/#disk
[15]: https://www.ibm.com/cloud/blog/using-fio-to-tell-whether-your-storage-is-fast-enough-for-etcd
[16]: ../../deploy-sensu/datastore/#scale-event-storage
[17]: ../../deploy-sensu/datastore/#use-default-event-storage
[18]: ../../../api/metrics/
[19]: ../../deploy-sensu/hardware-requirements/#backend-recommended-configuration
[20]: ../../deploy-sensu/datastore/#round-robin-postgresql
[21]: https://www.computerhope.com/unix/sha512sum.htm
[22]: ../../../sensuctl/back-up-recover/
[23]: ../../deploy-sensu/cluster-sensu/#sensu-backend-configuration
[24]: ../../../sensuctl/back-up-recover/#restore-resources-from-backup
[25]: ../../../observability-pipeline/observe-schedule/backend/#initialization
[26]: https://etcd.io/docs/latest/op-guide/recovery/#restoring-a-cluster
[27]: https://golang.google.cn/doc/go1.15#commonname
[28]: ../../deploy-sensu/generate-certificates/
