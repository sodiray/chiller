import { SidebarLayout } from 'src/layouts/SidebarLayout'
import { Title } from 'src/components/Meta'
import { documentationNav } from 'src/navs/documentation'

export function DocumentationLayout(props) {
  return (
    <>
      <Title>{props.layoutProps.meta.metaTitle || props.layoutProps.meta.title}</Title>
      <SidebarLayout nav={documentationNav} {...props} />
    </>
  )
}

DocumentationLayout.nav = documentationNav
