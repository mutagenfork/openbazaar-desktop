import loadTemplate from '../../../utils/loadTemplate';
import BaseModal from '../BaseModal';
import SettingsGeneral from './SettingsGeneral';
import SettingsPage from './SettingsPage';
import $ from 'jquery';

export default class extends BaseModal {
  constructor(options = {}) {
    const opts = {
      removeOnClose: true,
      modelContentClass: 'modalContent clrP border clrBr',
      ...options,
    };

    super(opts);
    this.options = opts;

    this.tabViewCache = {};
    this.tabViews = { SettingsGeneral, SettingsPage };
  }

  className() {
    return `${super.className()} settings`;
  }

  events() {
    return {
      'click .js-tab': 'tabClick',
      'click .js-save': 'saveClick',
      ...super.events(),
    };
  }

  tabClick(e) {
    const targ = $(e.target).closest('.js-tab');

    this.selectTab(targ);
  }

  selectTab(targ) {
    const tabViewName = targ.data('tab');
    let tabView = this.tabViewCache[tabViewName];

    if (!this.currentTabView || this.currentTabView !== tabView) {
      this.$('.js-tab').removeClass('clrT active');
      targ.addClass('clrT active');
      if (this.currentTabView) this.currentTabView.$el.detach();
      if (!tabView) {
        tabView = this.createChild(this.tabViews[tabViewName]);
        this.tabViewCache[tabViewName] = tabView;
        tabView.render();
      }
      this.$tabContent.append(tabView.$el);
      this.currentTabView = tabView;
    }
  }

  saveClick() {
    this.save();
  }

  save() {
    this.$save.addClass('loading');

    // tab views should implement save to return a promise
    this.currentTabView.save()
      .always(() => this.$save.removeClass('loading'));
  }

  render() {
    loadTemplate('modals/settings/settings.html', (t) => {
      this.$el.html(t(this.options));

      super.render();

      this.$tabContent = this.$('.js-tabContent');
      this.$save = this.$('.js-save');
      this.selectTab(this.$('.js-tab[data-tab="SettingsGeneral"]'));
    });

    return this;
  }
}

