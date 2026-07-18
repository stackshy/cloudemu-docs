export interface ServiceMapping {
  category: string;
  /** per-provider service names; '—' = no equivalent on that provider */
  aws: string;
  azure: string;
  gcp: string;
  slug: string;
  description: string;
}

/**
 * The 21 documented service domains, verified against the cloudemu
 * provider structs (providers/{aws,azure,gcp}) and the docs service pages.
 * Provider service counts: AWS 22 · Azure 25 · GCP 19 (66 services total,
 * plus a resource-discovery engine per provider).
 */
export const services: ServiceMapping[] = [
  { category: 'Compute', aws: 'EC2', azure: 'VirtualMachines', gcp: 'GCE', slug: 'compute', description: 'Virtual machine instances with lifecycle state machines' },
  { category: 'Storage', aws: 'S3', azure: 'BlobStorage', gcp: 'GCS', slug: 'storage', description: 'Object storage with buckets, versioning, and multipart upload' },
  { category: 'Database', aws: 'DynamoDB', azure: 'CosmosDB', gcp: 'Firestore', slug: 'database', description: 'NoSQL database with queries, TTL, and streams' },
  { category: 'Relational DB', aws: 'RDS · Redshift', azure: 'SQL · Flex', gcp: 'CloudSQL', slug: 'relationaldb', description: 'Managed relational database control planes' },
  { category: 'Serverless', aws: 'Lambda', azure: 'Functions', gcp: 'CloudFunctions', slug: 'serverless', description: 'Function-as-a-service with versions and aliases' },
  { category: 'Kubernetes', aws: 'EKS', azure: 'AKS', gcp: 'GKE', slug: 'kubernetes', description: 'Managed clusters with a shared in-memory data plane' },
  { category: 'Networking', aws: 'VPC', azure: 'VNet', gcp: 'VPC', slug: 'networking', description: 'Virtual networks, subnets, and security groups' },
  { category: 'Monitoring', aws: 'CloudWatch', azure: 'Monitor', gcp: 'CloudMonitoring', slug: 'monitoring', description: 'Metrics, alarms, and metric queries' },
  { category: 'IAM', aws: 'IAM', azure: 'RBAC', gcp: 'IAM', slug: 'iam', description: 'Identity, roles, and policy evaluation' },
  { category: 'DNS', aws: 'Route53', azure: 'DNS', gcp: 'CloudDNS', slug: 'dns', description: 'DNS zones and records with weighted routing' },
  { category: 'Load Balancer', aws: 'ELB', azure: 'LB', gcp: 'LB', slug: 'loadbalancer', description: 'Load balancers, target groups, and health checks' },
  { category: 'Message Queue', aws: 'SQS', azure: 'ServiceBus', gcp: 'PubSub', slug: 'messagequeue', description: 'Queues with FIFO dedup and dead-letter queues' },
  { category: 'Notification', aws: 'SNS', azure: 'NotificationHubs', gcp: 'FCM', slug: 'notification', description: 'Topics, subscriptions, and push notifications' },
  { category: 'Event Bus', aws: 'EventBridge', azure: 'EventGrid', gcp: 'Eventarc', slug: 'eventbus', description: 'Event routing with rules and targets' },
  { category: 'Container Registry', aws: 'ECR', azure: 'ACR', gcp: 'ArtifactRegistry', slug: 'containerregistry', description: 'Container image storage and lifecycle' },
  { category: 'Cache', aws: 'ElastiCache', azure: 'Cache', gcp: 'Memorystore', slug: 'cache', description: 'In-memory cache with TTL support' },
  { category: 'Secrets', aws: 'SecretsManager', azure: 'KeyVault', gcp: 'SecretManager', slug: 'secrets', description: 'Secret storage and versioning' },
  { category: 'Logging', aws: 'CloudWatchLogs', azure: 'LogAnalytics', gcp: 'CloudLogging', slug: 'logging', description: 'Log groups and log streams' },
  { category: 'Resource Discovery', aws: 'ResourceExplorer', azure: 'ResourceGraph', gcp: 'AssetInventory', slug: 'resource-discovery', description: 'Query resources across services and tags' },
  { category: 'Generative AI', aws: 'Bedrock · SageMaker', azure: '—', gcp: 'VertexAI', slug: 'ai', description: 'Model control planes with deterministic inference' },
  { category: 'Databricks', aws: '—', azure: 'Databricks', gcp: '—', slug: 'databricks', description: 'ARM workspace control plane and data plane' },
];
