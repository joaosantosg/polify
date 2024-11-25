// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'
import UnderConstruction from '@views/UnderConstruction'

// Util Imports
import { getServerMode, getSystemMode } from '@core/utils/serverHelpers'

const UnderConstructionPage: React.FC = () => {
  // Vars
  const direction: 'ltr' | 'rtl' = 'ltr'
  const mode: string = getServerMode()
  const systemMode: string = getSystemMode()

  return (
    <Providers direction={direction}>
      <BlankLayout systemMode={systemMode}>
        <UnderConstruction mode={mode} />
      </BlankLayout>
    </Providers>
  )
}

export default UnderConstructionPage
