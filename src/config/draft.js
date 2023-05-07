import {CompositeDecorator} from "draft-js";
import ELink from "@widgets/WEditor/CustomEditorControls/Link";
import {findLinkEntities} from "@widgets/WEditor/CustomEditorControls/Link/helpers";


const BLOCK_TYPES = [
  {label: "H1", style: "header-one"},
  {label: "H2", style: "header-two"},
  {label: "H3", style: "header-three"},
  {label: "H4", style: "header-four"},
  {label: "H5", style: "header-five"},
  {label: "H6", style: "header-six"},
  {label: "Blockquote", style: "blockquote"},
  {label: "UL", style: "unordered-list-item"},
  {label: "OL", style: "ordered-list-item"},
];

const INLINE_STYLES = [
  {label: "Bold", style: "BOLD"},
  {label: "Italic", style: "ITALIC"},
  {label: "Underline", style: "UNDERLINE"},
  {label: "Monospace", style: "CODE"},
];

const decorators = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: ELink.View,
  }
]);
