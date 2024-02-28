
import { DocumentationLayout } from 'layouts/DocumentationLayout'
import { InstallationLayout } from 'layouts/InstallationLayout'
export default function TailwindCli({ code }) {
  return (
    <InstallationLayout>Installing Tailwind CLI</InstallationLayout>
  )
}

TailwindCli.layoutProps = {
  meta: {
    title: 'Installation',
    description:
      'The simplest and fastest way to get up and running with Tailwind CSS from scratch is with the Tailwind CLI tool.',
  },
  Layout: DocumentationLayout,
  allowOverflow: false,
}
