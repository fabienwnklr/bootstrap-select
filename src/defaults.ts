import { classNames } from './constants';

export const DEFAULTS = {
  noneSelectedText: 'Nothing selected',
  noneResultsText: 'No results matched {0}',
  countSelectedText(numSelected: number, _numTotal: number) {
    return numSelected == 1 ? '{0} item selected' : '{0} items selected';
  },
  maxOptionsText(numAll: number, numGroup: number) {
    return [
      numAll == 1 ? 'Limit reached ({n} item max)' : 'Limit reached ({n} items max)',
      numGroup == 1 ? 'Group limit reached ({n} item max)' : 'Group limit reached ({n} items max)'
    ];
  },
  local: 'en',
  selectAllText: 'Select All',
  deselectAllText: 'Deselect All',
  doneButton: false,
  // doneButtonText: 'Close',
  multipleSeparator: ', ',
  styleBase: 'btn',
  style: classNames.BUTTONCLASS,
  size: 'auto',
  title: null,
  placeholder: null,
  allowClear: false,
  selectedTextFormat: 'values',
  width: 'auto',
  container: 'auto',
  dropupAuto: true,
  header: false,
  search: false,
  liveSearchPlaceholder: null,
  normalizeSearch: false,
  actionsBox: false,
  iconBase: classNames.ICONBASE,
  tickIcon: classNames.TICKICON,
  showTick: false,
  template: {
    header: () => {
      // Use 'this' as current bootstrap-select instance
      return `<h6 class="dropdown-header">Dropdown header</h6>`;
    },
    item: ($el: HTMLOptionElement) => {
      // Use 'this' as current bootstrap-select instance
      return `<span class="{{ class }}">{{ content }}</span>`;
    }, // Only for select "multiple"
    optgroup: ($el: HTMLOptGroupElement) => {
      // Use 'this' as current bootstrap-select instance
      return ``;
    },
    option: ($el: HTMLOptionElement) => {
      // Use 'this' as current bootstrap-select instance
      return `<a class="dropdown-item" href="#">Something else here</a>`;
    },
    divider: ($el: HTMLOptionElement) => {
      // Use 'this' as current bootstrap-select instance
      return `<hr class="dropdown-divider">`
    }
  },
  maxOptions: false,
  mobile: false,
  selectOnTab: true,
  dropdownPosition: 'auto',
  virtualScroll: 600,
};
