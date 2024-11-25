// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, MenuItem, MenuSection, SubMenu} from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuItem href='/home' icon={<i className='tabler-smart-home' />}>
          Dashboard
        </MenuItem>
        <SubMenu label='Gestão de Saude' icon={<i className='tabler-smart-home' />}>
          <MenuItem href='/gestao-saude/mapa-leitos' icon={<i className='tabler-smart-home' />}>
            Mapa de leitos
          </MenuItem>
          <MenuItem href='/gestao-saude/pacientes' icon={<i className='tabler-smart-home' />} >
          360° Panorama
          </MenuItem>
          <MenuItem href='/gestao-saude/relatorios' icon={<i className='tabler-smart-home' />}>
            Relatórios
          </MenuItem>
        </SubMenu>

        <SubMenu label='Gestão econômica' icon={<i className='tabler-smart-home' />}>
          <MenuItem href='/gestao-economica/relatorios' icon={<i className='tabler-smart-home' />}>
            Relatórios
          </MenuItem>
          <MenuItem href='/gestao-economica/indicadores' icon={<i className='tabler-smart-home' />}>
            Indicadores
          </MenuItem>
        </SubMenu>
        <MenuItem href='/usuarios' icon={<i className='tabler-smart-home' />}>
          Usuários
        </MenuItem>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
