export default class FlexibleMenu {
    constructor(params) {
        const menuData = params.$menu.dataset;

        this.$menu = params.$menu;
        this.$menuItems = params.$menuItems;
        this.$collapsedMenu = null;
        this.$collapsedItems = [];
        this.complCollapsed = false;
        this.minItems = menuData.elems ? menuData.elems : 3;
        this.maxItemsInExpandedMenu = parseInt(menuData.maxItemsInExpandedMenu) || 0; //maximum number visible items in the expanded menu
        this.collapsedTitle = menuData.title ? menuData.title : 'Остальное';
        this.buttonContent = menuData.buttonContent ? menuData.buttonContent : '';
        this.customClass = menuData.class ? menuData.class : 'flexible-menu__link';
        this.prevBodyWidth = document.documentElement.clientWidth;
        this.enabled = window.innerWidth >= 996

        this.init.call(this);
    }

    init() {
        setTimeout(() => {

            if (!this.checkItems.call(this) && this.enabled) {
                this.collapseItems.call(this);
            }

            this.collapseRedundantItems();

            window.addEventListener('resize', () => {
                if (window.innerWidth >= 996 && !this.enabled) {
                    this.enable.call(this);
                } else if (window.innerWidth < 996 && this.enabled) {

                    this.disable.call(this);
                }

                if (this.enabled) {
                    //the window shrank
                    if ((this.prevBodyWidth > window.innerWidth) && !this.checkItems.call(this) && !this.complCollapsed) {
                        this.collapseItems.call(this);
                    } else if ((this.prevBodyWidth < window.innerWidth) && (this.$collapsedItems.length > 0)) {
                        this.uncollapseItems.call(this);
                    }

                    this.prevBodyWidth = document.documentElement.clientWidth;
                }
            });
        }, 200);
    }

    checkItems() {
        let oneLine = true;
        let firstBottom = false;

        this.$menuItems.forEach(($item) => {
            if (!firstBottom) {
                firstBottom = $item.getBoundingClientRect().bottom;
            }

            if (firstBottom <= $item.getBoundingClientRect().top) {
                oneLine = false;
            }
        });

        if (this.$collapsedMenu && firstBottom <= this.$collapsedMenu.getBoundingClientRect().top) {
            oneLine = false;
        }

        return oneLine;
    }

    collapseItems() {

        if (!this.$collapsedMenu) {
            this.$collapsedMenu = this.createCollapsedMenu.call(this);
            this.$menu.appendChild(this.$collapsedMenu);
        }

        if (this.$menuItems.length > this.minItems) {
            this.$collapsedItems.unshift(this.$menuItems.pop());

            const $collapseInner = this.$collapsedMenu.querySelector('.flexible-menu__inner');

            this.$collapsedItems.forEach(($item) => {
                $collapseInner.appendChild($item);
            });

            if (!this.checkItems.call(this)) {
                this.collapseItems.call(this);
            }
        } else {
            this.collapseMenu.call(this);
        }

        this.changeButton.call(this, 'collapsed');
    }

    //collapse redundant hat menu items
    collapseRedundantItems() {
        if (this.maxItemsInExpandedMenu === 0 || !this.enabled) {
            return;
        }

        while (this.$menuItems.length > this.maxItemsInExpandedMenu) {
            this.collapseItems();
        }
    }

    collapseMenu() {
        this.complCollapsed = true;
        const $collapseInner = this.$collapsedMenu.querySelector('.flexible-menu__inner');

        this.$menuItems.forEach(($item) => {
            $collapseInner.insertBefore($item, this.$collapsedItems[0]);
        });

        if (this.collapsedTitle) {
            this.changeButton.call(this, 'collapsed');
        }

        this.$menu.classList.add('collapsed');
    }

    uncollapseItems() {
        if (
            this.maxItemsInExpandedMenu > 0 &&
            this.$menuItems.length === this.maxItemsInExpandedMenu
        ) {
            return;
        }

        if (this.$collapsedItems.length !== 0) {
            this.$menuItems.push(this.$collapsedItems.shift());
            this.$menu.insertBefore(this.$menuItems[this.$menuItems.length - 1], this.$collapsedMenu);

            if (!this.checkItems.call(this)) {
                this.collapseItems.call(this);
            } else {
                this.uncollapseItems.call(this);
            }

            if (this.complCollapsed) {
                this.uncollapseMenu.call(this);
                this.collapseRedundantItems();
            }
        }

        if (this.$collapsedItems.length === 0 && this.$collapsedMenu) {
            this.$collapsedMenu.parentNode.removeChild(this.$collapsedMenu);
            this.$collapsedMenu = null;
        }
    }

    uncollapseMenu() {
        this.$menuItems.forEach(($item) => {
            this.$menu.insertBefore($item, this.$collapsedMenu);
        });
        this.$menu.querySelector('.flexible-menu__wrapper').style.width = 'auto';

        if (this.checkItems.call(this)) {
            this.complCollapsed = false;
            this.$menu.classList.remove('collapsed');

            if (this.collapsedTitle) {
                this.changeButton.call(this);
            }

            this.uncollapseItems.call(this);
        } else {
            this.collapseMenu.call(this);
        }

        this.$menu.querySelector('.flexible-menu__wrapper').style.width = '';
    }

    changeButton(type = '') {
        const $button = this.$menu.querySelector('.flexible-menu__button');

        if (!$button) {
            return;
        }

        if (type === 'collapsed') {
            if (this.customClass) {
                $button.classList.add(this.customClass);
            }
        } else {
            if (this.customClass) {
                $button.classList.remove(this.customClass);
            }

            $button.innerHTML = '';
        }
    }

    enable() {
        this.enabled = true;

        if (!this.checkItems.call(this)) {
            this.collapseItems.call(this);
        }
    }

    disable() {
        this.enabled = false;

        this.$menuItems = [...this.$menuItems, ...this.$collapsedItems];

        this.$menuItems.forEach(($item) => {
            this.$menu.appendChild($item);
        });

        this.$collapsedItems = [];

        if (this.$collapsedMenu) {
            this.$menu.removeChild(this.$collapsedMenu);
            this.$collapsedMenu = null;
        }

        this.collapseRedundantItems();
    }

    createCollapsedMenu() {
        const $menu = document.createElement('li');
        $menu.className = 'flexible-menu__wrapper';

        $menu.innerHTML = `
            ${this.buttonContent}
            <ul class="flexible-menu__inner"></ul>
        `;
        
        return $menu;
    }

    static create(selector) {
        let $menus = document.querySelectorAll(selector);

        $menus = [...$menus];

        $menus.forEach(($menu) => {
            let $menuItems = $menu.childNodes;

            $menuItems = [...$menuItems];
            $menuItems = $menuItems.filter((item) => item.tagName === 'LI');

            new FlexibleMenu({
                $menu,
                $menuItems
            });
        });
    }
}

FlexibleMenu.create('.header__menu-items')
// FlexibleMenu.create('.header__nav')

/*Выпадающие блоки*/
class Dropdown {
    static open($dropdown, prefix) {
        Dropdown.close();
        $dropdown.classList.add(`${prefix}--open`);
        Dropdown.openedDropdown = $dropdown;
    }

    static close() {
        if (Dropdown.openedDropdown) {
            Dropdown.openedDropdown.classList.remove(Dropdown.openedDropdown.className.match(/\S+--open/i));
            Dropdown.openedDropdown = null;
        }
    }

    static reOpen(classDropdown, commonClass) {
        if (Dropdown.openedDropdown && Dropdown.openedDropdown.classList.contains(classDropdown)) {
            const $toOpen = document.querySelector(`.${classDropdown}`);

            if ($toOpen) {
                Dropdown.open($toOpen, commonClass);
            }
        }
    }

    static init() {
        document.documentElement.addEventListener('click', (event) => {
            const $target = event.target;
            const $fb = $target.closest('.flexible-menu__button');
            const $db = $target.closest('.dropdown__button');

            if ($fb) {
                if ($fb.parentNode.classList.contains('flexible-menu__wrapper--open')) {
                    Dropdown.close();
                } else {
                    Dropdown.open($fb.parentNode, 'flexible-menu__wrapper');
                }
            }

            if ($db) {
                if ($db.parentNode.classList.contains('dropdown--open')) {
                    Dropdown.close();
                } else {
                    Dropdown.open($db.parentNode, 'dropdown');
                }
            }

            if (!$target.closest('.flexible-menu__wrapper') && !$target.closest('.dropdown') && Dropdown.openedDropdown) {
                Dropdown.close();
            }
        });
    }
}

Dropdown.init();
/*Выпадающие блоки*/