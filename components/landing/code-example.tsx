import { Reveal } from '@/components/reveal';
import { MorphCode } from '@/components/code/morph-code';

const SNIPPETS = {
  aws: {
    filename: 'portable_aws.go',
    code: `cloud := cloudemu.NewAWS()

// Launch instances
cloud.EC2.RunInstances(ctx, computedriver.InstanceConfig{
    ImageID:      "ami-0abcdef1234",
    InstanceType: "t3.large",
}, 3)

// Object storage
cloud.S3.CreateBucket(ctx, "app-data")
cloud.S3.PutObject(ctx, "app-data", "config.yaml",
    []byte("port: 8080"), "text/yaml", nil)

// Metrics
cloud.CloudWatch.PutMetricData(ctx, []mondriver.MetricDatum{
    {Namespace: "App", MetricName: "CPU", Value: 45.2},
})`,
  },
  azure: {
    filename: 'portable_azure.go',
    code: `cloud := cloudemu.NewAzure()

// Launch instances
cloud.VirtualMachines.RunInstances(ctx, computedriver.InstanceConfig{
    ImageID:      "Ubuntu-22.04",
    InstanceType: "Standard_D2s_v3",
}, 3)

// Object storage
cloud.BlobStorage.CreateBucket(ctx, "app-data")
cloud.BlobStorage.PutObject(ctx, "app-data", "config.yaml",
    []byte("port: 8080"), "text/yaml", nil)

// Metrics
cloud.Monitor.PutMetricData(ctx, []mondriver.MetricDatum{
    {Namespace: "App", MetricName: "CPU", Value: 45.2},
})`,
  },
  gcp: {
    filename: 'portable_gcp.go',
    code: `cloud := cloudemu.NewGCP()

// Launch instances
cloud.GCE.RunInstances(ctx, computedriver.InstanceConfig{
    ImageID:      "debian-11",
    InstanceType: "e2-standard-2",
}, 3)

// Object storage
cloud.GCS.CreateBucket(ctx, "app-data")
cloud.GCS.PutObject(ctx, "app-data", "config.yaml",
    []byte("port: 8080"), "text/yaml", nil)

// Metrics
cloud.CloudMonitoring.PutMetricData(ctx, []mondriver.MetricDatum{
    {Namespace: "App", MetricName: "CPU", Value: 45.2},
})`,
  },
};

export function CodeExample() {
  return (
    <section className="w-full border-t border-line">
      <div className="mx-auto w-full max-w-4xl px-6 py-20">
        <Reveal>
          <p className="u-eyebrow mb-3">
            <span className="text-ink-3">05</span> · portable go api
          </p>
          <h2 className="text-3xl font-bold tracking-[-0.01em] text-ink">
            Or skip HTTP entirely.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-secondary">
            The same backend behind typed Go interfaces — one shape across all
            three providers. Switch tabs: the calls don&apos;t change, only the
            service names do.
          </p>
        </Reveal>
        <Reveal delay={60} className="mt-8">
          <MorphCode snippets={SNIPPETS} />
        </Reveal>
      </div>
    </section>
  );
}
