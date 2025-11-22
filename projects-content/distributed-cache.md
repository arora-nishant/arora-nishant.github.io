## Overview

Built a distributed caching system from scratch to handle high-throughput read/write operations across multiple nodes. The system implements consistent hashing for efficient data distribution and provides automatic failover capabilities.

## Key Features

- **Consistent Hashing**: Minimizes data redistribution when nodes are added or removed
- **Replication**: Configurable replication factor for fault tolerance
- **Cluster Management**: Automatic node discovery and health monitoring
- **Eviction Policies**: Supports LRU, LFU, and TTL-based eviction
- **Protocol**: Custom binary protocol for low-latency communication

## Architecture

The system follows a peer-to-peer architecture where each node is responsible for a portion of the key space. Virtual nodes (vnodes) are used to ensure balanced distribution even with heterogeneous hardware.

## Performance

- Handles 100K+ requests/second per node
- Sub-millisecond p99 latency for cache hits
- Linear scalability up to 50+ nodes tested

## Code

Available on [GitHub](https://github.com/example/distributed-cache)
