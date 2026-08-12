'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, ServerCog } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE, fadeUp, scaleIn, staggerContainer, viewportOnce } from '@/lib/motion';
import { HighlightedGo } from './highlighted-go';

const tabs = [
  {
    label: 'AWS',
    color: '#FF9900',
    sdk: 'aws-sdk-go-v2',
    code: `import (
    awsserver "github.com/stackshy/cloudemu/server/aws"
    "github.com/aws/aws-sdk-go-v2/service/s3"
)

cloud := cloudemu.NewAWS()
ts := httptest.NewServer(awsserver.New(awsserver.Drivers{
    S3: cloud.S3, DynamoDB: cloud.DynamoDB, EC2: cloud.EC2,
    Lambda: cloud.Lambda, SQS: cloud.SQS,
}))

// Use the REAL aws-sdk-go-v2 client — only the endpoint changes.
client := s3.NewFromConfig(cfg, func(o *s3.Options) {
    o.BaseEndpoint = aws.String(ts.URL)
    o.UsePathStyle  = true
})
client.PutObject(ctx, &s3.PutObjectInput{ /* ... */ })`,
  },
  {
    label: 'Azure',
    color: '#0078D4',
    sdk: 'azure-sdk-for-go',
    code: `import (
    azureserver "github.com/stackshy/cloudemu/server/azure"
    "github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/compute/armcompute/v5"
)

cp := cloudemu.NewAzure()
ts := httptest.NewTLSServer(azureserver.New(azureserver.Drivers{
    VirtualMachines: cp.VirtualMachines, BlobStorage: cp.BlobStorage,
    CosmosDB: cp.CosmosDB, Network: cp.VNet,
    Functions: cp.Functions, ServiceBus: cp.ServiceBus,
}))

// Use the REAL armcompute client — only the endpoint changes.
opts := &arm.ClientOptions{ ClientOptions: azcore.ClientOptions{
    Cloud:     cloud.Configuration{ /* ts.URL as ResourceManager */ },
    Transport: ts.Client(),
}}
client, _ := armcompute.NewVirtualMachinesClient("sub-1", cred, opts)`,
  },
  {
    label: 'GCP',
    color: '#4285F4',
    sdk: 'cloud.google.com/go',
    code: `import (
    gcpserver "github.com/stackshy/cloudemu/server/gcp"
    gcpcompute "cloud.google.com/go/compute/apiv1"
)

cp := cloudemu.NewGCP()
ts := httptest.NewServer(gcpserver.New(gcpserver.Drivers{
    Compute: cp.GCE, Storage: cp.GCS, Firestore: cp.Firestore,
    Networking: cp.VPC, Monitoring: cp.CloudMonitoring,
    CloudFunctions: cp.CloudFunctions, PubSub: cp.PubSub,
}))

// Use the REAL Google Cloud SDK — only the endpoint changes.
client, _ := gcpcompute.NewInstancesRESTClient(ctx,
    option.WithEndpoint(ts.URL),
    option.WithoutAuthentication(),
    option.WithHTTPClient(ts.Client()),
)`,
  },
  {
    label: 'OCI',
    color: '#C74634',
    sdk: 'oci-go-sdk',
    code: `import (
    ociserver "github.com/stackshy/cloudemu/server/oci"
    "github.com/oracle/oci-go-sdk/v65/identity"
)

cp := cloudemu.NewOCI()
ts := httptest.NewServer(ociserver.New(ociserver.Drivers{
    Identity: cp.Identity, Monitoring: cp.Monitoring, VCN: cp.VCN,
}))

// Use the REAL oci-go-sdk client — only the endpoint changes.
client, _ := identity.NewIdentityClientWithConfigurationProvider(cfg)
client.Host = ts.URL
client.HTTPClient = ts.Client()
client.ListUsers(ctx, identity.ListUsersRequest{ /* ... */ })`,
  },
];

const summaryCards = [
  {
    title: 'Storage / Compute / Database',
    body: 'S3, EC2, DynamoDB · Blob, VMs, Cosmos · GCS, GCE, Firestore',
  },
  {
    title: 'Serverless / Message Queue',
    body: 'Lambda, SQS · Functions, Service Bus · Cloud Functions, Pub/Sub',
  },
  {
    title: 'Networking / Monitoring',
    body: 'VPC, CloudWatch · VNet, Azure Monitor · VPC, Cloud Monitoring',
  },
];

export function SDKCompatSection() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  return (
    <section className="w-full max-w-6xl mx-auto px-6 pt-8 pb-16">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full border border-fd-primary/30 bg-fd-primary/5 text-sm text-fd-primary font-medium">
          <ServerCog className="w-4 h-4" />
          Real Cloud SDKs Work Unchanged
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Don&apos;t rewrite your code.{' '}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(90deg, #ff6b2c, #d64d17)' }}
          >
            Repoint it.
          </span>
        </h2>
        <p className="mt-4 text-lg text-fd-muted-foreground max-w-3xl mx-auto leading-relaxed">
          cloudemu ships HTTP servers that speak the real wire protocols of{' '}
          <code className="px-1.5 py-0.5 rounded bg-fd-card border border-fd-border text-sm font-mono">aws-sdk-go-v2</code>,{' '}
          <code className="px-1.5 py-0.5 rounded bg-fd-card border border-fd-border text-sm font-mono">azure-sdk-for-go</code>, and{' '}
          <code className="px-1.5 py-0.5 rounded bg-fd-card border border-fd-border text-sm font-mono">cloud.google.com/go</code>.
          {' '}Point the SDK&apos;s endpoint at a local <code className="px-1.5 py-0.5 rounded bg-fd-card border border-fd-border text-sm font-mono">httptest.NewServer</code>{' '}
          and your existing production code runs unchanged against an in-memory backend. No mocks. No Docker. No accounts.
        </p>
      </div>

      <motion.div
        variants={scaleIn()}
        initial={reduced ? false : 'hidden'}
        whileInView="show"
        viewport={viewportOnce}
        className="rounded-xl border border-fd-border bg-fd-card overflow-hidden shadow-sm"
      >
        {/* macOS-style window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-fd-border bg-fd-secondary/50">
          <span className="w-2.5 h-2.5 rounded-full bg-fd-muted-foreground/25" />
          <span className="w-2.5 h-2.5 rounded-full bg-fd-muted-foreground/25" />
          <span className="w-2.5 h-2.5 rounded-full bg-fd-muted-foreground/25" />
          <span className="ml-2 text-xs text-fd-muted-foreground font-mono">
            {tabs[active].label.toLowerCase()}.go · {tabs[active].sdk}
          </span>
        </div>

        {/* Provider tabs */}
        <div className="flex border-b border-fd-border">
          {tabs.map((tab, i) => (
            <motion.button
              key={tab.label}
              onClick={() => setActive(i)}
              whileHover={reduced ? undefined : { y: -1 }}
              transition={{ duration: DUR.fast, ease: EASE }}
              className={`flex-1 sm:flex-none px-6 py-3 text-sm font-medium transition-colors ${
                active === i
                  ? 'bg-fd-card border-b-2 text-fd-foreground'
                  : 'text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-secondary/50'
              }`}
              style={active === i ? { borderBottomColor: tab.color } : undefined}
            >
              <span className="font-semibold" style={{ color: active === i ? tab.color : undefined }}>
                {tab.label}
              </span>
            </motion.button>
          ))}
        </div>

        <div className="relative overflow-hidden" style={{ background: 'hsl(26, 9%, 13%)' }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.pre
              key={active}
              initial={reduced ? false : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduced ? undefined : { opacity: 0, x: -16 }}
              transition={{ duration: DUR.fast, ease: EASE }}
              className="p-6 overflow-x-auto"
            >
              <code className="text-sm font-mono leading-relaxed" style={{ color: '#e6e6e6' }}>
                <HighlightedGo code={tabs[active].code} />
              </code>
            </motion.pre>
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div
        variants={staggerContainer()}
        initial={reduced ? false : 'hidden'}
        whileInView="show"
        viewport={viewportOnce}
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm"
      >
        {summaryCards.map((card) => (
          <motion.div
            key={card.title}
            variants={fadeUp()}
            className="rounded-lg border border-fd-border bg-fd-card p-4"
          >
            <div className="font-semibold mb-1">{card.title}</div>
            <div className="text-fd-muted-foreground">{card.body}</div>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-10 flex items-center justify-center">
        <Link
          href="/docs/sdk-compat"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-fd-border bg-fd-card font-medium hover:bg-fd-accent transition-colors"
        >
          See full SDK-compat coverage
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
