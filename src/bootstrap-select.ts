import { createElementFromString, mergeDeep, readDataAttr, toInteger } from './utils/utils';
import { DefaultOptions } from './utils/options';
import type { BootstrapSelectOptions } from './types/options';
import { classNames } from './utils/constants';

export class BootstrapSelect {
  // HTML Element
  public $select: HTMLSelectElement = document.createElement('select');
  public $btnDropdown: HTMLButtonElement = document.createElement('button');
  public $dropdown: HTMLDivElement = document.createElement('div');
  public $dropdownMenu: HTMLUListElement = document.createElement('ul');

  public options: BootstrapSelectOptions = DefaultOptions;
  public optionsMap: Array<Object> = [];
  public id: string = '';
  public values: Array<String> = [];

  constructor($element: HTMLSelectElement, options: BootstrapSelectOptions = DefaultOptions) {
    // Get data option and merge into options object
    const dataOptions = readDataAttr($element);
    options = mergeDeep<BootstrapSelectOptions>(options, dataOptions);
    
    this.$select = $element;
    this.options = mergeDeep(this.options, options);
    this.id = this.$select.getAttribute('id') || 'bs-select-' + Date.now();
    
    this.init();
  }

  init() {
    // Bind this to all template method
    this.options.template.divider = this.options.template.divider.bind(this);
    this.options.template.dropdown = this.options.template.dropdown.bind(this);
    this.options.template.dropdownButton = this.options.template.dropdownButton.bind(this);
    this.options.template.dropdownMenu = this.options.template.dropdownMenu.bind(this);
    this.options.template.header = this.options.template.header.bind(this);
    this.options.template.item = this.options.template.item.bind(this);
    this.options.template.optgroup = this.options.template.optgroup.bind(this);
    this.options.template.option = this.options.template.option.bind(this);

    this._createDropdown();
    this.render();
    this._initHandler();
  }

  /**
   * Create html dropdown
   */
  private _createDropdown() {
    this.$dropdown = createElementFromString<HTMLDivElement>(this.options.template.dropdown());
    this.$btnDropdown = createElementFromString<HTMLButtonElement>(this.options.template.dropdownButton(this.$select));
    this.$dropdownMenu = createElementFromString<HTMLUListElement>(this.options.template.dropdownMenu());

    this.$dropdown.appendChild(this.$btnDropdown);
    this.$dropdown.appendChild(this.$dropdownMenu);

    if (this.$select.children.length > 0) {
      for (let i in this.$select.children) {
        const child = this.$select.children[i];
        const prevChild = this.$select.children[toInteger(i) - 1];
        if (child instanceof HTMLOptionElement) {
          // addOption(child);
          const $opt = createElementFromString<HTMLOptionElement>(this.options.template.option(child));

          if (child.selected) $opt.setAttribute('selected', 'true');
          this.$dropdownMenu.append($opt);
        } else if (child instanceof HTMLOptGroupElement) {
          // addGroup(child);
          if (child.children.length > 0) {
            if (prevChild) {
              const $divider = createElementFromString<HTMLHRElement>(this.options.template.divider());
              this.$dropdownMenu.append($divider);
            }
            const $optGroup = createElementFromString<HTMLOptGroupElement>(this.options.template.optgroup(child));
            this.$dropdownMenu.append($optGroup);
            for (let i in child.children) {
              const opt = child.children[i];
              if (opt instanceof HTMLOptionElement) {
                const $options = createElementFromString<HTMLOptionElement>(this.options.template.option(opt));
                this.$dropdownMenu.append($options);
              }
            }
          }
        }
      }
    }
  }

  private _initHandler() {
    this.$dropdownMenu.querySelectorAll(`.${classNames.OPTION}`).forEach(($item) => {
      $item.addEventListener('click', this._onClickOption.bind(this))
    });
  }

  private _onClickOption(ev: Event) {
    const $opt = ev.target as HTMLAnchorElement;

    if (!$opt) return;

    if (this.$select.multiple) {
      this._toggleOptionState($opt);
    } else {
      // option already selected, do nothing
      if ($opt.classList.contains('active')) {
        return;
      } else {
        // Clear last selected item
        const $active = this.$dropdown.querySelector('.active') as HTMLAnchorElement;

        if ($active) {
          $active.classList.remove('active');
          $active.removeAttribute('aria-current');
          this._removeValue($active.dataset.bssValue as string);
        }


        $opt.setAttribute('aria-current', 'true');
        $opt.classList.add('active');
        this.$btnDropdown.textContent = $opt.textContent;
        this._addValue($opt.dataset.bssValue as string);
      }
    }

    this._updateNative();
    this._triggerNative('change');
  }

  private _triggerNative(evName: string) {
    this.$select.dispatchEvent(new Event(evName));
  }

  private _updateNative() {
    this.$select.value = this.values.join(',');
  }

  _removeValue(value: string) {
    if (this.values.indexOf(value) !== -1) {
      this.values.splice(this.values.indexOf(value), 1);
    }
  }

  _addValue(value: string) {
    if (this.values.indexOf(value) === -1) {
      this.values.push(value);
    }
  }

  _toggleOptionState($opt: HTMLAnchorElement) {
    if ($opt.classList.contains('active')) { 
      $opt.removeAttribute('aria-current');
      $opt.classList.remove('active');
      $opt.blur();
      this._removeValue($opt.dataset.bssValue as string);
    } else {
      $opt.setAttribute('aria-current', 'true');
      $opt.classList.add('active');
      this._addValue($opt.dataset.bssValue as string);
    }
  }


  /**
   * Render the dropdown into DOM
   */
  render() {
    this.$select.after(this.$dropdown);
    this.$select.classList.add('d-none');
  }

  setStyle() {}

  selectAll() {}

  clearSelected() {
    
  }

  toggle(e?: Event, state: boolean = false) {
    console.log(e, state);
  }

  open(e?: Event) {
    this.toggle(e, true);
  }

  close(e?: Event) {
    this.toggle(e, false);
  }

  mobile() {}

  refresh() {}

  hide() {}

  show() {}

  destroy() {}
}

document.addEventListener('DOMContentLoaded', function () {
  const $elements = document.querySelectorAll('[data-bsl]') as NodeListOf<HTMLSelectElement>;

  if ($elements) {
    $elements.forEach(function ($el) {
      const BS_S = new BootstrapSelect($el);
      $el["bs-select"] = BS_S;
    })
  }
});