// styles/GlobalStyle.ts
import { createGlobalStyle } from 'styled-components';

const CompoundStyle = createGlobalStyle`
  :root {
    --primary-color: #00AD79;
    --bg-color: #0D131A;
    --text-color: #f1f1f3;
    --link-color: #f1f1f3;
    --heading-color: #f1f1f3;
    --border-color: #d1d5da;
    --header-bg: #1D2833;
    --block-bg: #1D2833;
  }
`;

export default CompoundStyle;
