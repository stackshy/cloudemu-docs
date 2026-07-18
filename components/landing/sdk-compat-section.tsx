import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { MorphCode } from '@/components/code/morph-code';
import { Reveal } from '@/components/reveal';

const SNIPPETS = {
  aws: {
    filename: 'aws_test.go',
    focus: "BaseEndpoint",
    code: `cloud := cloudemu.NewAWS()
ts := httptest.NewServer(awsserver.New(awsserver.Drivers{
    S3: cloud.S3, DynamoDB: cloud.DynamoDB, EC2: cloud.EC2,
}))
defer ts.Close()

// The REAL aws-sdk-go-v2 client — only the endpoint changes.
client := s3.NewFromConfig(cfg, func(o *s3.Options) {
    o.BaseEndpoint = aws.String(ts.URL)
    o.UsePathStyle = true
})

client.PutObject(ctx, &s3.PutObjectInput{ /* production code */ })`,
  },
  azure: {
    filename: 'azure_test.go',
    focus: "Transport|ResourceManager",
    code: `cloud := cloudemu.NewAzure()
ts := httptest.NewTLSServer(azureserver.New(azureserver.Drivers{
    VirtualMachines: cloud.VirtualMachines, BlobStorage: cloud.BlobStorage,
}))
defer ts.Close()

// The REAL armcompute client — only the endpoint changes.
opts := &arm.ClientOptions{ClientOptions: azcore.ClientOptions{
    Cloud:     cloudcfg.Configuration{ /* ts.URL as ResourceManager */ },
    Transport: ts.Client(),
}}

client, _ := armcompute.NewVirtualMachinesClient("sub-1", cred, opts)`,
  },
  gcp: {
    filename: 'gcp_test.go',
    focus: "WithEndpoint",
    code: `cloud := cloudemu.NewGCP()
ts := httptest.NewServer(gcpserver.New(gcpserver.Drivers{
    Compute: cloud.GCE, Storage: cloud.GCS, PubSub: cloud.PubSub,
}))
defer ts.Close()

// The REAL Google Cloud SDK — only the endpoint changes.
client, _ := gcpcompute.NewInstancesRESTClient(ctx,
    option.WithEndpoint(ts.URL),
    option.WithoutAuthentication(),
    option.WithHTTPClient(ts.Client()),
)

_ = client // production code from here on`,
  },
};

export function SDKCompatSection() {
  return (
    <section className="w-full border-t border-line">
      <div className="mx-auto w-full max-w-6xl px-6 py-20">
        <Reveal>
          <p className="u-eyebrow mb-3">
            <span className="text-ink-3">01</span> · sdk-compat server
          </p>
          <h2 className="max-w-2xl text-3xl font-bold tracking-[-0.01em] text-ink sm:text-4xl">
            Don&apos;t rewrite your tests.{' '}
            <span className="text-ink">Repoint them.</span>
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-secondary">
            cloudemu speaks the real wire protocols — AWS Query/JSON/Smithy,
            Azure ARM, GCP REST — over a local{' '}
            <code className="u-chip-code">httptest.NewServer</code>. Switch the
            provider tab below and watch: the shape stays, one line changes.
          </p>
        </Reveal>

        <Reveal delay={60} className="mt-8">
          <MorphCode snippets={SNIPPETS} />
        </Reveal>

        <div className="mt-6">
          <Link
            href="/docs/sdk-compat"
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.08em] text-ink underline decoration-line-2 underline-offset-4 hover:text-accent hover:decoration-accent"
          >
            Full coverage tables
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
