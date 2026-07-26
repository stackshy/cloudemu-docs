import Link from '@/components/link';
import { ArrowRight } from 'lucide-react';
import { MorphCode } from '@/components/code/morph-code';
import { Reveal } from '@/components/reveal';
import { TestProof } from '@/components/landing/test-proof';

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

const CHECKLIST = [
  'no mocks to maintain',
  'no Docker to babysit',
  'no cloud accounts, no bill',
];

/**
 * Two-column code showcase: the pitch and checklist on the left, the
 * provider-tabbed code on the right with a test-run proof line beneath.
 * The claim and the evidence share one viewport.
 */
export function SDKCompatSection() {
  return (
    <section className="w-full border-t border-line">
      <div className="mx-auto w-full max-w-[1120px] px-6 py-20">
        <div className="grid grid-cols-1 items-start gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
          {/* Left: the pitch */}
          <Reveal>
            <p className="u-eyebrow mb-3">
              <span className="text-ink-3">01</span> · sdk-compat server
            </p>
            <h2 className="text-3xl font-bold tracking-[-0.01em] text-ink">
              Don&apos;t rewrite your tests. Repoint them.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-2">
              cloudemu speaks the real wire protocols — AWS Query/JSON/Smithy,
              Azure ARM, GCP REST — over a local{' '}
              <code className="u-chip-code">httptest.NewServer</code>. Switch
              the provider tab: the shape stays, one line changes.
            </p>

            <ul className="mt-6 flex flex-col gap-2.5">
              {CHECKLIST.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-sm text-ink-2"
                >
                  <span aria-hidden className="font-mono text-[14px] text-ok">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href="/docs/sdk-compat"
              className="mt-8 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.06em] text-ink underline decoration-line-2 underline-offset-4 hover:text-accent hover:decoration-accent"
            >
              Full coverage tables
              <ArrowRight className="size-3.5" />
            </Link>
          </Reveal>

          {/* Right: the evidence */}
          <Reveal delay={60}>
            <MorphCode snippets={SNIPPETS} />
            <TestProof />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
