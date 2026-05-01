'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, ServerCog } from 'lucide-react';
import { motion } from 'framer-motion';
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
];

export function SDKCompatSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="w-full max-w-6xl mx-auto px-6 pt-8 pb-16">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full border border-fd-primary/30 bg-fd-primary/5 text-sm text-fd-primary font-medium">
          <ServerCog className="w-4 h-4" />
          Real Cloud SDKs Work Unchanged
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Don&apos;t rewrite your tests.{' '}
          <span className="bg-gradient-to-r from-sky-400 to-violet-500 bg-clip-text text-transparent">
            Repoint them.
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
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="rounded-xl border border-fd-border bg-fd-card overflow-hidden shadow-2xl"
        style={{ boxShadow: '0 30px 60px -20px rgba(99,102,241,0.2)' }}
      >
        {/* macOS-style window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-fd-border bg-fd-secondary/50">
          <span className="w-3 h-3 rounded-full bg-red-500/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <span className="w-3 h-3 rounded-full bg-green-500/70" />
          <span className="ml-2 text-xs text-fd-muted-foreground font-mono">
            {tabs[active].label.toLowerCase()}_test.go · {tabs[active].sdk}
          </span>
        </div>

        {/* Provider tabs */}
        <div className="flex border-b border-fd-border">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActive(i)}
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
            </button>
          ))}
        </div>

        <motion.pre
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="p-6 overflow-x-auto"
        >
          <code className="text-sm font-mono text-fd-foreground leading-relaxed">
            <HighlightedGo code={tabs[active].code} />
          </code>
        </motion.pre>
      </motion.div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="rounded-lg border border-fd-border bg-fd-card p-4">
          <div className="font-semibold mb-1">Storage / Compute / Database</div>
          <div className="text-fd-muted-foreground">S3, EC2, DynamoDB · Blob, VMs, Cosmos · GCS, GCE, Firestore</div>
        </div>
        <div className="rounded-lg border border-fd-border bg-fd-card p-4">
          <div className="font-semibold mb-1">Serverless / Message Queue</div>
          <div className="text-fd-muted-foreground">Lambda, SQS · Functions, Service Bus · Cloud Functions, Pub/Sub</div>
        </div>
        <div className="rounded-lg border border-fd-border bg-fd-card p-4">
          <div className="font-semibold mb-1">Networking / Monitoring</div>
          <div className="text-fd-muted-foreground">VPC, CloudWatch · VNet, Azure Monitor · VPC, Cloud Monitoring</div>
        </div>
      </div>

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
