
import { createGlobalStyle } from 'styled-components';
import { shade } from 'polished';

export const GlobalStyles = createGlobalStyle`
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background: #F9F9F9;
}

body {
  align-self: center;
  -wekit-font-smoothing: antialiased;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#root {
  display: flex;
  justify-content: center;
  width: 100%;
}

body, input, textarea, select, button {
  font: 400 1rem "Roboto", sans-serif;
}

input, button {
  margin-left: auto;
  margin-right: auto;
  max-width: 400px;
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  width: 100%;
  border-radius: 5px;
  padding: 10px;
  height: 50px;
}

button {
  cursor: pointer;
  background: #04d361;
  justify-content: center;
  border: 0;
  color: #fff;
  font-weight: bold;
  transition: background-color 0.2s;
  &:hover {
    background-color: ${shade(0.2, '#04d361')};
  }
}

a{
  color: inherit;
  text-decoration: none;
}

svg {
    margin-top: 5px;
    align-self: center;
    font-size: 24px;
    margin-right: 7px;
}

`;