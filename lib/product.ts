/**
 * product.ts — the single source of truth for product facts and numbers.
 *
 * Every stat, count, provider name, run mode, and command shown on the
 * marketing surfaces MUST come from here. No hard-coded numbers in
 * components. Numbers are derived from the product repo (github.com/stackshy/cloudemu):
 *   - providers: cloudemu.go exports NewAWS / NewAzure / NewGCP (exactly 3).
 *   - sdkCompatServices: server/{aws,azure,gcp} handler dirs (30 + 36 + 24 = 90).
 *   - serviceDomains: services/ portable domains (~36).
 *   - ports/reset: docs/standalone-server.md.
 * When the product adds services, update the counts here and nowhere else.
 */

export const PRODUCT = {
  name: 'cloudemu',
  tagline: 'Run the real cloud SDKs against a local, in-memory emulator.',
  module: 'github.com/stackshy/cloudemu/v2',
  goVersion: '1.25',
  install: 'go get github.com/stackshy/cloudemu/v2',
  dockerImage: 'ghcr.io/stackshy/cloudemu:latest',
  repo: 'https://github.com/stackshy/cloudemu',
  license: 'MIT',

  providers: ['AWS', 'Azure', 'GCP'] as const,

  ports: { aws: 4566, azure: 4568, gcp: 4569, kubernetes: 4570 } as const,
  resetEndpoint: '/_cloudemu/reset',
} as const;

export const STATS = {
  clouds: 3, // AWS, Azure, GCP
  serviceDomains: 36, // services/ portable domains
  sdkCompatServices: 90, // server/{aws:30, azure:36, gcp:24} handlers
  runModes: 3,
  latency: '~10 ms', // in-process, per call
} as const;

export interface RunMode {
  id: 'in-process' | 'server' | 'docker';
  label: string;
  tagline: string;
  blurb: string;
  languages: string;
  command: string;
  lang: 'go' | 'bash';
}

export const RUN_MODES: RunMode[] = [
  {
    id: 'in-process',
    label: 'In-process',
    tagline: 'Go tests, zero network',
    blurb:
      'Spin the emulator up inside your test with httptest and point the SDK’s endpoint at it. Calls return in ~10 ms.',
    languages: 'Go',
    lang: 'go',
    command: `cloud := cloudemu.NewAWS()
ts := httptest.NewServer(awsserver.New(awsserver.Drivers{
    S3: cloud.S3, DynamoDB: cloud.DynamoDB,
}))
client := s3.NewFromConfig(cfg, func(o *s3.Options) {
    o.BaseEndpoint = aws.String(ts.URL)
})`,
  },
  {
    id: 'server',
    label: 'Standalone server',
    tagline: 'Any language, long-lived',
    blurb:
      'Run one long-lived process and point any SDK — in any language — at the printed endpoints.',
    languages: 'Any language',
    lang: 'bash',
    command: `go run ./cmd/cloudemu serve
#   AWS     http://127.0.0.1:4566
#   Azure   https://127.0.0.1:4568
#   GCP     http://127.0.0.1:4569`,
  },
  {
    id: 'docker',
    label: 'Docker',
    tagline: 'One command, no Go toolchain',
    blurb:
      'Pull the published image and run it anywhere Docker runs. Great for CI and polyglot stacks.',
    languages: 'Any language',
    lang: 'bash',
    command: `docker run --rm \\
  -p 4566:4566 -p 4568:4568 -p 4569:4569 \\
  ghcr.io/stackshy/cloudemu:latest`,
  },
];
