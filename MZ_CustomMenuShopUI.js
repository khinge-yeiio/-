/*:
 * @target MZ
 * @plugindesc v1.0 自定义主菜单与商店 UI（窗口布局 + 视觉样式）
 * @author Codex
 * @help
 * [功能]
 * 1. 可调整主菜单布局（命令窗口、状态窗口、金钱窗口）。
 * 2. 可调整商店布局（帮助、购买、出售、数量、状态窗口）。
 * 3. 支持统一视觉样式：窗口背景透明度、文字大小、描边、强调色。
 * 4. 可选隐藏窗口皮肤，仅保留自定义背景（面板风）。
 *
 * [使用方式]
 * - 将本插件放入 js/plugins 后，在插件管理器启用。
 * - 通过参数调整各窗口坐标、尺寸和样式。
 * - 对于坐标/尺寸参数，填 0 表示使用引擎默认值。
 *
 * [兼容性]
 * - 适用于 RPG Maker MZ。
 * - 若你有其他改 Scene_Menu / Scene_Shop 的插件，尽量将本插件放在后面。
 *
 * @param menuLayout
 * @text 主菜单布局
 * @type struct<MenuLayout>
 * @default {"commandX":"0","commandY":"0","commandWidth":"300","statusX":"0","statusY":"0","statusWidth":"0","goldX":"0","goldY":"0","goldWidth":"300"}
 *
 * @param shopLayout
 * @text 商店布局
 * @type struct<ShopLayout>
 * @default {"helpHeight":"108","commandWidth":"300","numberWidth":"0","statusWidth":"360","buyWindowY":"0","sellWindowY":"0"}
 *
 * @param uiStyle
 * @text 通用UI样式
 * @type struct<UIStyle>
 * @default {"hideWindowFrame":"false","backgroundOpacity":"180","fontSize":"24","lineHeight":"36","outlineWidth":"3","accentColor":"#7fd6ff","titleColor":"#ffe6a8"}
 */

/*~struct~MenuLayout:
 * @param commandX
 * @text 命令窗口 X
 * @type number
 * @default 0
 *
 * @param commandY
 * @text 命令窗口 Y
 * @type number
 * @default 0
 *
 * @param commandWidth
 * @text 命令窗口宽度
 * @type number
 * @default 300
 *
 * @param statusX
 * @text 状态窗口 X
 * @type number
 * @default 0
 *
 * @param statusY
 * @text 状态窗口 Y
 * @type number
 * @default 0
 *
 * @param statusWidth
 * @text 状态窗口宽度(0=默认)
 * @type number
 * @default 0
 *
 * @param goldX
 * @text 金钱窗口 X
 * @type number
 * @default 0
 *
 * @param goldY
 * @text 金钱窗口 Y
 * @type number
 * @default 0
 *
 * @param goldWidth
 * @text 金钱窗口宽度
 * @type number
 * @default 300
 */

/*~struct~ShopLayout:
 * @param helpHeight
 * @text 帮助窗口高度
 * @type number
 * @default 108
 *
 * @param commandWidth
 * @text 商店命令窗口宽度
 * @type number
 * @default 300
 *
 * @param numberWidth
 * @text 数量窗口宽度(0=默认)
 * @type number
 * @default 0
 *
 * @param statusWidth
 * @text 商品状态窗口宽度
 * @type number
 * @default 360
 *
 * @param buyWindowY
 * @text 购买窗口 Y 偏移(0=默认)
 * @type number
 * @default 0
 *
 * @param sellWindowY
 * @text 出售窗口 Y 偏移(0=默认)
 * @type number
 * @default 0
 */

/*~struct~UIStyle:
 * @param hideWindowFrame
 * @text 隐藏窗口皮肤
 * @type boolean
 * @default false
 *
 * @param backgroundOpacity
 * @text 窗口背景透明度
 * @type number
 * @min 0
 * @max 255
 * @default 180
 *
 * @param fontSize
 * @text 字号
 * @type number
 * @default 24
 *
 * @param lineHeight
 * @text 行高
 * @type number
 * @default 36
 *
 * @param outlineWidth
 * @text 文字描边宽度
 * @type number
 * @default 3
 *
 * @param accentColor
 * @text 强调色(普通文本)
 * @type string
 * @default #7fd6ff
 *
 * @param titleColor
 * @text 标题色(系统文本)
 * @type string
 * @default #ffe6a8
 */

(() => {
  "use strict";

  const PLUGIN_NAME = "MZ_CustomMenuShopUI";
  const rawParams = PluginManager.parameters(PLUGIN_NAME);

  const parseStruct = (value, fallback = {}) => {
    if (!value) return fallback;
    try {
      return JSON.parse(value);
    } catch (_e) {
      return fallback;
    }
  };

  const toNumber = (value, fallback = 0) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
  };

  const toBool = (value, fallback = false) => {
    if (value === true || value === "true") return true;
    if (value === false || value === "false") return false;
    return fallback;
  };

  const menuLayout = parseStruct(rawParams.menuLayout);
  const shopLayout = parseStruct(rawParams.shopLayout);
  const uiStyle = parseStruct(rawParams.uiStyle);

  const settings = {
    menu: {
      commandX: toNumber(menuLayout.commandX, 0),
      commandY: toNumber(menuLayout.commandY, 0),
      commandWidth: toNumber(menuLayout.commandWidth, 300),
      statusX: toNumber(menuLayout.statusX, 0),
      statusY: toNumber(menuLayout.statusY, 0),
      statusWidth: toNumber(menuLayout.statusWidth, 0),
      goldX: toNumber(menuLayout.goldX, 0),
      goldY: toNumber(menuLayout.goldY, 0),
      goldWidth: toNumber(menuLayout.goldWidth, 300)
    },
    shop: {
      helpHeight: toNumber(shopLayout.helpHeight, 108),
      commandWidth: toNumber(shopLayout.commandWidth, 300),
      numberWidth: toNumber(shopLayout.numberWidth, 0),
      statusWidth: toNumber(shopLayout.statusWidth, 360),
      buyWindowY: toNumber(shopLayout.buyWindowY, 0),
      sellWindowY: toNumber(shopLayout.sellWindowY, 0)
    },
    style: {
      hideWindowFrame: toBool(uiStyle.hideWindowFrame, false),
      backgroundOpacity: toNumber(uiStyle.backgroundOpacity, 180),
      fontSize: toNumber(uiStyle.fontSize, 24),
      lineHeight: toNumber(uiStyle.lineHeight, 36),
      outlineWidth: toNumber(uiStyle.outlineWidth, 3),
      accentColor: String(uiStyle.accentColor || "#7fd6ff"),
      titleColor: String(uiStyle.titleColor || "#ffe6a8")
    }
  };

  const _Window_Base_lineHeight = Window_Base.prototype.lineHeight;
  Window_Base.prototype.lineHeight = function() {
    return settings.style.lineHeight || _Window_Base_lineHeight.call(this);
  };

  const _Window_Base_resetFontSettings = Window_Base.prototype.resetFontSettings;
  Window_Base.prototype.resetFontSettings = function() {
    _Window_Base_resetFontSettings.call(this);
    this.contents.fontSize = settings.style.fontSize;
    this.contents.outlineWidth = settings.style.outlineWidth;
  };

  const _ColorManager_normalColor = ColorManager.normalColor;
  ColorManager.normalColor = function() {
    return settings.style.accentColor || _ColorManager_normalColor.call(this);
  };

  const _ColorManager_systemColor = ColorManager.systemColor;
  ColorManager.systemColor = function() {
    return settings.style.titleColor || _ColorManager_systemColor.call(this);
  };

  const _Window_initialize = Window.prototype.initialize;
  Window.prototype.initialize = function() {
    _Window_initialize.apply(this, arguments);
    this.backOpacity = settings.style.backgroundOpacity;
    if (settings.style.hideWindowFrame && this._frameSprite) {
      this._frameSprite.visible = false;
    }
  };

  // ========== Scene_Menu ==========
  const _Scene_Menu_commandWindowRect = Scene_Menu.prototype.commandWindowRect;
  Scene_Menu.prototype.commandWindowRect = function() {
    const rect = _Scene_Menu_commandWindowRect.call(this);
    if (settings.menu.commandWidth > 0) rect.width = settings.menu.commandWidth;
    rect.x = settings.menu.commandX;
    rect.y = settings.menu.commandY;
    return rect;
  };

  const _Scene_Menu_statusWindowRect = Scene_Menu.prototype.statusWindowRect;
  Scene_Menu.prototype.statusWindowRect = function() {
    const rect = _Scene_Menu_statusWindowRect.call(this);
    if (settings.menu.statusWidth > 0) rect.width = settings.menu.statusWidth;
    if (settings.menu.statusX !== 0) rect.x = settings.menu.statusX;
    if (settings.menu.statusY !== 0) rect.y = settings.menu.statusY;
    return rect;
  };

  const _Scene_Menu_goldWindowRect = Scene_Menu.prototype.goldWindowRect;
  Scene_Menu.prototype.goldWindowRect = function() {
    const rect = _Scene_Menu_goldWindowRect.call(this);
    if (settings.menu.goldWidth > 0) rect.width = settings.menu.goldWidth;
    if (settings.menu.goldX !== 0) rect.x = settings.menu.goldX;
    if (settings.menu.goldY !== 0) rect.y = settings.menu.goldY;
    return rect;
  };

  // ========== Scene_Shop ==========
  const _Scene_Shop_helpWindowRect = Scene_Shop.prototype.helpWindowRect;
  Scene_Shop.prototype.helpWindowRect = function() {
    const rect = _Scene_Shop_helpWindowRect.call(this);
    if (settings.shop.helpHeight > 0) rect.height = settings.shop.helpHeight;
    return rect;
  };

  const _Scene_Shop_commandWindowRect = Scene_Shop.prototype.commandWindowRect;
  Scene_Shop.prototype.commandWindowRect = function() {
    const rect = _Scene_Shop_commandWindowRect.call(this);
    if (settings.shop.commandWidth > 0) rect.width = settings.shop.commandWidth;
    return rect;
  };

  const _Scene_Shop_numberWindowRect = Scene_Shop.prototype.numberWindowRect;
  Scene_Shop.prototype.numberWindowRect = function() {
    const rect = _Scene_Shop_numberWindowRect.call(this);
    if (settings.shop.numberWidth > 0) rect.width = settings.shop.numberWidth;
    return rect;
  };

  const _Scene_Shop_statusWindowRect = Scene_Shop.prototype.statusWindowRect;
  Scene_Shop.prototype.statusWindowRect = function() {
    const rect = _Scene_Shop_statusWindowRect.call(this);
    if (settings.shop.statusWidth > 0) rect.width = settings.shop.statusWidth;
    return rect;
  };

  const _Scene_Shop_buyWindowRect = Scene_Shop.prototype.buyWindowRect;
  Scene_Shop.prototype.buyWindowRect = function() {
    const rect = _Scene_Shop_buyWindowRect.call(this);
    if (settings.shop.buyWindowY !== 0) rect.y = settings.shop.buyWindowY;
    return rect;
  };

  const _Scene_Shop_sellWindowRect = Scene_Shop.prototype.sellWindowRect;
  Scene_Shop.prototype.sellWindowRect = function() {
    const rect = _Scene_Shop_sellWindowRect.call(this);
    if (settings.shop.sellWindowY !== 0) rect.y = settings.shop.sellWindowY;
    return rect;
  };
})();
