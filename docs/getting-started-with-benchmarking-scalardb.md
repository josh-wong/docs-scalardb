---
tags:
  - Community
  - Enterprise Standard
  - Enterprise Premium
displayed_sidebar: docsEnglish
---

# Getting Started with Benchmarking ScalarDB

This guide walks you through planning, running, and analyzing benchmarks for ScalarDB. A structured benchmarking methodology produces reliable, meaningful performance measurements that you can use to make informed decisions about system configuration, resource sizing, and technology selection.

## Plan the benchmark

Careful planning before running benchmarks prevents wasted effort and ensures that your results are actionable.

### Define your benchmarking objectives

Start by clarifying what you want to learn from the benchmark. Your objective determines the workload, metrics, environment, and configuration decisions that follow.

Common benchmarking objectives include the following:

- **System comparison:** Compare ScalarDB against other systems that provide similar capabilities to determine which best fits your requirements.
- **Scalability validation:** Confirm that ScalarDB scales as expected when you add nodes or increase concurrency under a specific workload.
- **Cost estimation:** Map the performance you need to the resources required to achieve it.
- **Performance verification:** Confirm that ScalarDB meets a minimum performance threshold under a specific workload.

### Understand performance metrics

The two fundamental performance metrics for benchmarking are throughput and latency. Throughput measures the number of transactions the system completes per unit of time, expressed as transactions per second (TPS). Latency measures the time elapsed between submitting a transaction and receiving a response, expressed in milliseconds (ms).

Throughput and latency are related but distinct. A system may achieve high throughput while individual transactions experience high latency, or vice versa. Measure both to get a complete picture of system performance.

:::tip

When reporting latency, include percentile distributions (p50, p95, p99) rather than averages alone. Average latency can mask tail latency issues that affect user experience.

:::

### Choose a workload

Performance varies significantly depending on the workload. A throughput number is meaningful only when paired with the workload that produced it. Consider two systems that both achieve 1,000 TPS. If one system performs 10 read-modify-write (RMW) operations per transaction while the other performs a single RMW, the first system is doing 10 times more work despite reporting the same TPS value.

When designing your workload, consider the following factors:

- **Operation mix:** The ratio of reads to writes.
- **Operations per transaction:** The number of operations within a single transaction.
- **Access pattern:** Uniform versus skewed toward hotspots.
- **Concurrency level:** The number of concurrent threads.
- **Dataset size:** The total amount of data the benchmark operates on.
- **Record size:** The size of each record the benchmark operates on.

Vary concurrency and access skew across experiments to understand how the system behaves under different conditions.

### Define the comparison baseline

When comparing ScalarDB against other systems, ensure that the comparison is fair and the results are interpretable.

First, ensure a fair comparison by using systems that provide the same guarantees. If multi-database transactions spanning multiple databases are a requirement, comparing ScalarDB against a system that does not support such transactions is not meaningful because the systems solve fundamentally different problems. However, if multi-database transactions are optional rather than required, comparing the two to measure the overhead of coordination is valid. In that case, state explicitly that the comparison measures coordination overhead, not general system performance.

Second, change one variable at a time. When comparing configurations or systems, vary only one parameter per experiment. If you change multiple variables simultaneously, you cannot determine which variable caused the observed performance difference.

:::warning

Comparing systems with different consistency guarantees (for example, eventual consistency versus linearizable consistency) without accounting for the difference leads to misleading conclusions. Always document the guarantees each system provides alongside the performance results.

:::

### Estimate expected performance

Before running benchmarks, estimate the expected performance based on your understanding of the workload and the system. Benchmarking is the combination of performance estimation and performance measurement. Measurement without estimation is difficult to validate.

To create an estimate, first identify the operations your workload performs (reads, writes, commits). Then, review the phases of the [Consensus Commit protocol](./consensus-commit.mdx) that ScalarDB executes for each transaction and sum the per-phase latencies based on the storage backend and network characteristics to estimate the latency of a single transaction. Finally, divide the expected concurrency by this single-transaction latency to derive a rough throughput estimate.

When modeling ScalarDB application performance, the dominant cost factor depends on your environment. In most modern environments where storage I/O is fast, the number of network hops is the primary factor that determines transaction latency, so counting the network round trips each transaction phase requires gives a reasonable latency estimate. However, in environments with large datasets and I/O-intensive workloads where disk throughput is a bottleneck, the number of disk reads and writes per transaction is a better basis for the estimate.

The estimate does not need to be precise. Even a rough order-of-magnitude estimate helps detect misconfigurations. For example, if a configuration error is suppressing performance, having no estimate means you have no way to detect the problem from the measurement results alone. Conversely, if the estimate and measurement agree, both are likely correct. If they disagree, investigating the discrepancy often reveals errors in either the estimate or the system configuration.

## Prepare the environment

This section explains how to set up the infrastructure, establish baseline measurements, and prepare the benchmarking tool.

### Prepare the infrastructure

The testing environment directly affects benchmark results. Use stable compute resources and avoid cloud instance types that introduce performance variance.

Cloud virtual machines share physical hardware with other tenants, so performance can vary by time of day. Do not use burstable instances (for example, AWS T-series), because these instances throttle CPU performance after credits are exhausted, producing inconsistent results. Similarly, do not use spot instances or preemptible instances, as these use surplus capacity and may be reclaimed during a benchmark run.

In addition to choosing stable instance types, match the resources to your workload. For example, if your workload is I/O-intensive, provision instances with high I/O throughput (such as instances backed by NVMe SSDs). Otherwise, I/O bottlenecks may mask the actual system performance.

:::note

For production-grade benchmarks of ScalarDB Cluster, a minimum of 3 worker nodes with 4 vCPU and 8 GB memory each is recommended, with ScalarDB Cluster pods limited to 2 vCPU and 4 GB memory per pod. Place nodes in different availability zones for resilience testing. For details, see [Production checklist for ScalarDB Cluster](./scalar-kubernetes/ProductionChecklistForScalarDBCluster.mdx).

:::

### Measure baseline environment performance

Before benchmarking ScalarDB, measure the raw performance of your environment to establish a baseline and detect infrastructure issues early. The following tools are useful for measuring baseline performance:

- [sysbench](https://github.com/akopytov/sysbench) — CPU and memory throughput.
- [fio](https://github.com/axboe/fio) — Sequential and random I/O throughput and latency.
- [iperf](https://github.com/esnet/iperf) — Network bandwidth and latency between nodes.

These baselines help you determine whether the infrastructure is performing as expected and whether any bottleneck you observe during ScalarDB benchmarks originates from the infrastructure rather than from ScalarDB.

### Prepare the benchmarking tool

If an existing benchmarking tool supports your workload, use it rather than building a custom tool. Using an established tool reduces the risk of measurement errors and makes it easier for others to reproduce your results. Regardless of which approach you choose, understanding what the workload does remains important.

[ScalarDB benchmarks](./scalardb-benchmarks/README.mdx) is the official benchmarking tool for ScalarDB. It provides standard workloads (TPC-C and YCSB variants) built on the [Kelpie](https://github.com/scalar-labs/kelpie) framework. If your benchmarking scenario requires a workload that ScalarDB benchmarks does not support, you can build a custom benchmark. In that case, consider reusing the measurement infrastructure from Kelpie to ensure accurate timing and reporting.

For instructions on setting up ScalarDB benchmarks, including cloning the repository, building the benchmark JAR, downloading Kelpie, loading schemas, and creating benchmark configuration files, see the [ScalarDB benchmarks repository](https://github.com/scalar-labs/scalardb-benchmarks). For the full list of workload-specific parameters, see [ScalarDB benchmarks](./scalardb-benchmarks/README.mdx).

## Configure ScalarDB for benchmarking

Before running benchmarks, configure ScalarDB with the performance parameters that match your benchmarking objectives. The connection mode subsection below is specific to ScalarDB Cluster. The performance-related properties apply to both ScalarDB Core and ScalarDB Cluster, but the configuration location differs (see [Tune performance-related properties](#tune-performance-related-properties)).

### Choose a deployment pattern

Choose a deployment pattern based on how your application uses ScalarDB. ScalarDB supports the following deployment patterns:

- **ScalarDB Core (embedded):** The application or benchmark program embeds ScalarDB as a library. This pattern is the simplest to set up because it requires no separate server infrastructure. Use this pattern when you want to benchmark ScalarDB without the overhead of a cluster deployment.
- **ScalarDB Cluster with a single cluster:** A single ScalarDB Cluster instance serves the application. This is the most common deployment pattern when using ScalarDB Cluster. Use this pattern for most benchmarking scenarios because it is simpler to manage and requires fewer resources. In microservice use cases, this pattern is called the *shared cluster pattern*, where all services share the single cluster instance and use the one-phase commit interface.
- **ScalarDB Cluster with multiple clusters:** Each application or service has its own dedicated ScalarDB Cluster instance. Transactions that span multiple clusters use the two-phase commit interface, which adds complexity to transaction handling and error recovery but provides stronger resource isolation. Use this pattern only if you specifically need to evaluate cross-cluster transaction performance with the two-phase commit interface. In microservice use cases, this pattern is called the *separated cluster pattern*.

For details on microservice deployment patterns, see [ScalarDB Cluster deployment patterns for microservices](./scalardb-cluster/deployment-patterns-for-microservices.mdx).

### Choose a connection mode

When using ScalarDB Cluster, choose a client connection mode. ScalarDB Cluster supports two modes: `direct-kubernetes` mode and `indirect` mode.

In **`direct-kubernetes` mode**, the client uses the Kubernetes API and a membership-based routing algorithm to connect directly to the correct cluster node. This eliminates an extra network hop, resulting in lower latency and higher throughput. However, the client application must run inside the same Kubernetes cluster as ScalarDB Cluster.

In **`indirect` mode**, the client sends requests to any cluster node through a load balancer. There are two routing options within `indirect` mode:

- **Via Service (ClusterIP) (recommended):** The client connects through an L4 load balancer to a Kubernetes Service, which routes to a cluster node. This option avoids the extra hop through Envoy, resulting in lower latency.
- **Via Envoy:** The client connects through an L4 load balancer to an Envoy proxy, which routes to a cluster node. This option provides better load balancing across ScalarDB Cluster nodes because Envoy can distribute requests at the L7 layer, but it introduces an additional network hop.

`indirect` mode allows clients to run outside the Kubernetes cluster but adds extra network hops per request. Of the two options, connecting via Service is generally recommended for lower latency, while connecting via Envoy may be preferable when load distribution across cluster nodes is a priority.

From a performance perspective, `direct-kubernetes` mode is recommended over both options within `indirect` mode. To configure `direct-kubernetes` mode, set the following properties in your ScalarDB configuration file:

```properties
scalar.db.transaction_manager=cluster
scalar.db.contact_points=direct-kubernetes:<NAMESPACE>/<ENDPOINT_NAME>
scalar.db.contact_port=60053
```

To configure `indirect` mode, replace the `contact_points` value:

```properties
scalar.db.contact_points=indirect:<LOAD_BALANCER_IP>
```

### Tune performance-related properties

ScalarDB provides several configuration properties that affect performance. The following sections describe the most relevant properties for benchmarking.

:::note

If you use ScalarDB Core, set these properties in the application's ScalarDB configuration file. If you use ScalarDB Cluster, set them in the ScalarDB Cluster configuration. The exception is the client-side optimizations described in [Client-side optimizations](#client-side-optimizations), which are ScalarDB Cluster-specific and configured on the client.

:::

#### Consensus Commit optimizations

The [Consensus Commit protocol](./consensus-commit.mdx) supports several optimizations that improve performance. The parallel execution properties (like `parallel_preparation` and `parallel_commit`) are enabled by default and execute protocol phases in parallel for multi-record transactions. Async commit (`async_commit`) returns to the client after the commit-state phase completes without waiting for the commit-records phase, which increases throughput at the cost of a slightly wider recovery window. One-phase commit (`one_phase_commit`) skips the prepare and commit-state phases entirely when all mutations can be applied atomically, significantly reducing round trips for simple transactions.

| Property | Default | Description |
|----------|---------|-------------|
| `scalar.db.consensus_commit.parallel_preparation.enabled` | `true` | Execute the prepare phase in parallel for multi-record transactions. |
| `scalar.db.consensus_commit.parallel_commit.enabled` | `true` | Execute the commit-records phase in parallel. |
| `scalar.db.consensus_commit.async_commit.enabled` | `false` | Return to the client after the commit-state phase without waiting for commit-records. Note that it might cause a slowdown under a medium-to-high contention workload due to excessive recovery. |
| `scalar.db.consensus_commit.one_phase_commit.enabled` | `false` | Skip prepare and commit-state phases when mutations can be applied atomically. |

For details on how each optimization affects the Consensus Commit protocol, see [Performance optimization](./consensus-commit.mdx#performance-optimization).

#### Isolation level

The `scalar.db.consensus_commit.isolation_level` property controls the transaction isolation level. The available levels are `SNAPSHOT`, `SERIALIZABLE`, and `READ_COMMITTED`. Higher isolation levels increase overhead because the protocol must perform additional checks to prevent anomalies.

Choose the isolation level based on the anomalies your application can accept, not based on performance alone. Each level permits different types of anomalies, and the correct choice depends on your application's correctness requirements.

:::warning

Do not weaken the isolation level solely to improve benchmark throughput. If your application requires `SERIALIZABLE` isolation, benchmarking with `READ_COMMITTED` produces throughput numbers that are irrelevant to your production workload. Always benchmark with the isolation level you intend to use in production.

:::

#### Group commit

Group commit batches multiple transactions' coordinator state writes into a single operation, which is particularly beneficial when the coordinator table resides in a remote or high-latency storage backend. Group commit is incompatible with the two-phase commit interface.

| Property | Default | Description |
|----------|---------|-------------|
| `scalar.db.consensus_commit.coordinator.group_commit.enabled` | `false` | Enable group commit for coordinator state writes. |
| `scalar.db.consensus_commit.coordinator.group_commit.slot_capacity` | `20` | Maximum number of transaction slots per group. |
| `scalar.db.consensus_commit.coordinator.group_commit.group_size_fix_timeout_millis` | `40` | Milliseconds to wait for a group to fill before processing. |

When tuning group commit, benchmark combinations of `slot_capacity` and `group_size_fix_timeout_millis` together to find the balance that works best for your workload and storage backend. For example, try `20` and `40`; `30` and `40`, and `20` and `80`, respectively.

#### Client-side optimizations

The following properties are specific to ScalarDB Cluster and reduce network round trips without changing transaction semantics. The `piggyback_begin` property eliminates the dedicated begin RPC call by piggybacking the transaction begin onto the first CRUD operation, saving one round trip per transaction. The `write_buffering` property buffers non-conditional write operations (inserts, upserts, unconditional puts, updates, and deletes) and executes them in batches, reducing the total number of RPC calls for write-heavy transactions.

| Property | Default | Description |
|----------|---------|-------------|
| `scalar.db.cluster.client.piggyback_begin.enabled` | `false` | Eliminate the dedicated begin RPC by piggybacking it onto the first CRUD operation. |
| `scalar.db.cluster.client.write_buffering.enabled` | `false` | Buffer non-conditional write operations and execute them in batches. |

:::warning

* If `piggyback_begin` is enabled, you will get an `IllegalStateException` when calling the `DistributedTransaction.getId()` method until the actual begin operation is executed.
* If `piggyback_begin` or `write_buffering` is enabled, you will always get an `IllegalStateException` when calling the `DistributedTransactionManager.resume()` and `DistributedTransactionManager.join()` methods.

:::

Similar optimizations are available for SQL transactions. The `piggyback_begin` property works the same way as the primitive API version, eliminating the dedicated begin RPC call. The `write_buffering` property buffers `INSERT` and `UPSERT` statements on the client side and executes them in batches.

| Property | Default | Description |
|----------|---------|-------------|
| `scalar.db.sql.cluster_mode.client.piggyback_begin.enabled` | `false` | Eliminate the dedicated begin RPC by piggybacking it onto the first execute operation. |
| `scalar.db.sql.cluster_mode.client.write_buffering.enabled` | `false` | Buffer `INSERT` and `UPSERT` statements and execute them in batches. |

:::warning

* If `piggyback_begin` is enabled, `SqlSession.getTransactionId()` returns `Optional.empty()` until the actual begin operation is executed.
* If `piggyback_begin` or `write_buffering` is enabled, you will always get an `IllegalStateException` when calling the `SqlSession.resume()` and `SqlSession.join()` methods.

:::

#### JDBC connection pool

If you use a JDBC database as the storage backend, tune the connection pool to match your expected concurrency. The `max_total` property controls the maximum number of connections in the pool.

| Property | Default | Description |
|----------|---------|-------------|
| `scalar.db.jdbc.connection_pool.min_idle` | `20` | Minimum idle connections in the pool. |
| `scalar.db.jdbc.connection_pool.max_total` | `200` | Maximum total connections (idle + active). |
| `scalar.db.jdbc.connection_pool.connection_timeout_millis` | `30000` | Maximum time in milliseconds to wait for a connection from the pool. |
| `scalar.db.jdbc.connection_pool.idle_timeout_millis` | `600000` | Maximum time in milliseconds that a connection is allowed to sit idle in the pool. |
| `scalar.db.jdbc.connection_pool.max_lifetime_millis` | `1800000` | Maximum lifetime in milliseconds of a connection in the pool. |
| `scalar.db.jdbc.connection_pool.keepalive_time_millis` | `0` | Interval in milliseconds for connection keepalive. `0` disables keepalive. |

For the complete list of configuration properties, see [ScalarDB Core Configurations](./configurations.mdx) and [ScalarDB Cluster Configurations](./scalardb-cluster/scalardb-cluster-configurations.mdx).

## Run the benchmark

This section outlines practices for running benchmarks that produce consistent and reliable measurements.

### Warm up the target system

Before measuring performance, warm up the system to eliminate initialization overhead such as JVM class loading, JIT compilation, connection pool establishment, and cache population. ScalarDB benchmarks supports a ramp-up period through the `ramp_for_sec` parameter. Set this to at least 30 seconds. Data collected during the ramp-up period is excluded from the results.

### Run for a sufficient duration

Run the benchmark for at least 60 seconds after the ramp-up period. Short runs are more susceptible to transient variations such as garbage collection pauses and network fluctuations that can skew results.

For specific objectives, adjust the duration accordingly. For quick validation, 1 to 5 minutes is typically sufficient. For performance comparisons that require statistical rigor, run for 5 to 15 minutes. For stability testing or degradation detection, run for several hours or days to observe long-term behavior.

### Run multiple iterations

Cloud environments exhibit performance variance due to shared physical infrastructure. Run each benchmark configuration at least three times and aggregate the results by averaging. If results vary significantly across iterations, use a trimmed mean (discarding the highest and lowest values) or report results with standard deviation to convey the variance. If the standard deviation exceeds 10% of the mean (the coefficient of variation is greater than 0.1), it is advisable to investigate the cause of the variance before drawing conclusions from the data.

## Validate and analyze the results

This section describes how to validate benchmark results against your estimates and iterate on the configuration to ensure the measurements are accurate and actionable.

### Compare with estimated performance

After each benchmark run, compare the measured results against the estimates you prepared before running the benchmark.

If the results match your estimates, both the estimate and the measurement are likely correct. If the results fall significantly below your estimates, a misconfiguration, resource bottleneck, or environmental issue may be suppressing performance. Investigate before accepting the results. If the results exceed your estimates, the estimate may have overlooked an optimization, or the measurement may be incorrect (for example, measuring only successful transactions while ignoring failures).

:::warning

Do not publish or act on benchmark results that you cannot explain. Unexplained results may stem from misconfigurations that invalidate the measurements.

:::

### Tune and re-run

If measured performance falls short of estimates, the system may not be optimally configured. Review the configuration properties described in the previous sections, adjust one parameter at a time, and re-run the benchmark after each change. Repeat this cycle until the measured results and estimates converge.

Common tuning actions include the following:

- Tuning the retry backoff interval to reduce wasted work from repeated conflicts under high-contention workloads, since ScalarDB uses optimistic concurrency control (OCC). For example, the TPC-C workload in ScalarDB benchmarks provides a `backoff` parameter for this purpose.
- Enabling async commit for high-throughput workloads.
- Enabling and tuning group commit for workloads with high coordinator write traffic.
- Adjusting the JDBC connection pool size to match the concurrency level.

### Analyze the results

Once measured results and estimates are in agreement, you can be confident that the results are valid. Summarize the throughput, latency distribution (p50, p95, p99), and any error rates for each configuration you tested. Use your understanding of the workload and system to explain why each configuration produced the results it did. Based on your original objective, determine the deployment configuration, resource sizing, or system choice that best meets your requirements.

## Next steps

- [ScalarDB Benchmarking Tools](./scalardb-benchmarks/README.mdx) — Full reference for the official ScalarDB benchmarking tool, including all workload parameters.
- [ScalarDB Core Configurations](./configurations.mdx) — Complete list of ScalarDB Core configuration properties.
- [ScalarDB Cluster Configurations](./scalardb-cluster/scalardb-cluster-configurations.mdx) — Cluster-specific configuration properties, including client-side optimizations.
- [Consensus Commit Protocol](./consensus-commit.mdx) — How ScalarDB achieves ACID transactions across databases.
- [ScalarDB Cluster Deployment Patterns for Microservices](./scalardb-cluster/deployment-patterns-for-microservices.mdx) — Shared versus separated cluster patterns.
- [Production Checklist for ScalarDB Cluster](./scalar-kubernetes/ProductionChecklistForScalarDBCluster.mdx) — Resource sizing and deployment recommendations for production.
