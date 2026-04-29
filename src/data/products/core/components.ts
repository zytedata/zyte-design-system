import type { DsCategory } from "@/data/foundations/types";

export const CORE_COMPONENT_CATEGORIES: DsCategory[] = [
  {
    title: "Form",
    items: [
      { label: "InputText", slug: "inputtext", implemented: true },
      { label: "InputNumber", slug: "inputnumber", implemented: true },
      { label: "Dropdown", slug: "dropdown", implemented: true },
      { label: "Calendar", slug: "calendar", implemented: true },
      { label: "AutoComplete", slug: "autocomplete", implemented: false },
      { label: "Checkbox", slug: "checkbox", implemented: true },
      { label: "InputSwitch", slug: "inputswitch", implemented: false },
      { label: "MultiSelect", slug: "multiselect", implemented: false },
      { label: "Password", slug: "password", implemented: true },
      { label: "RadioButton", slug: "radiobutton", implemented: true },
      { label: "Slider", slug: "slider", implemented: true },
      { label: "Textarea", slug: "textarea", implemented: false },
    ],
  },
  {
    title: "Button",
    items: [
      { label: "Button", slug: "button", implemented: true },
      { label: "SplitButton", slug: "splitbutton", implemented: true },
      { label: "SpeedDial", slug: "speeddial", implemented: true },
    ],
  },
  {
    title: "Data",
    items: [
      { label: "Table", slug: "table", implemented: true },
      { label: "Tree", slug: "tree", implemented: true },
      { label: "Paginator", slug: "paginator", implemented: true },
      { label: "Timeline", slug: "timeline", implemented: true },
    ],
  },
  {
    title: "Panel",
    items: [
      { label: "Card", slug: "card", implemented: true },
      { label: "TabView", slug: "tabview", implemented: true },
      { label: "Accordion", slug: "accordion", implemented: true },
      { label: "Divider", slug: "divider", implemented: true },
    ],
  },
  {
    title: "Overlay",
    items: [
      { label: "Dialog", slug: "dialog", implemented: true },
      { label: "Sidebar", slug: "sidebar", implemented: true },
      { label: "Tooltip", slug: "tooltip", implemented: true },
      { label: "OverlayPanel", slug: "overlaypanel", implemented: false },
    ],
  },
  {
    title: "Messages",
    items: [
      { label: "Toast", slug: "toast", implemented: true },
      { label: "Tag", slug: "tag", implemented: true },
      { label: "Badge", slug: "badge", implemented: false },
      { label: "ProgressBar", slug: "progressbar", implemented: true },
    ],
  },
];
