type ColorPath =
  // main colors
  | 'primary.light'
  | 'primary.main'
  | 'primary.dark'
  | 'primary.contrastText'
  | 'secondary.light'
  | 'secondary.main'
  | 'secondary.dark'
  | 'secondary.contrastText'
  | 'error.light'
  | 'error.main'
  | 'error.dark'
  | 'error.contrastText'
  | 'warning.light'
  | 'warning.main'
  | 'warning.dark'
  | 'warning.contrastText'
  | 'info.light'
  | 'info.main'
  | 'info.dark'
  | 'info.contrastText'
  | 'success.light'
  | 'success.main'
  | 'success.dark'
  | 'success.contrastText'

  // text color
  | 'text.primary'
  | 'text.secondary'
  | 'text.disabled'

  // back colors
  | 'background.default'
  | 'background.paper'

  // action colors
  | 'action.active'
  | 'action.hover'
  | 'action.hoverOpacity'
  | 'action.selected'
  | 'action.selectedOpacity'
  | 'action.disabled'
  | 'action.disabledBackground'
  | 'action.disabledOpacity'
  | 'action.focus'
  | 'action.focusOpacity'
  | 'action.activatedOpacity'

  // gray colors
  | 'grey.50'
  | 'grey.100'
  | 'grey.200'
  | 'grey.300'
  | 'grey.400'
  | 'grey.500'
  | 'grey.600'
  | 'grey.700'
  | 'grey.800'
  | 'grey.900'
  | 'grey.A100'
  | 'grey.A200'
  | 'grey.A400'
  | 'grey.A700'

  // divider color
  | 'divider'

  // common colors
  | 'common.black'
  | 'common.white';

export function colorPath(value: ColorPath): ColorPath {
  return value;
}
